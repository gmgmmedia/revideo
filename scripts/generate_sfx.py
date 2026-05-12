#!/usr/bin/env python3
"""
SFX Generator for Revideo projects.

Reads `sfx-plan.json` (from `agents/sound-designer.md`), generates audio via the
ElevenLabs API, and outputs:
  - MP3 files into `<project>/sfx/{scene}/{id}_{name}.mp3`
  - `sfx-manifest.json` consumed by `agents/code-generator.md` for `<Audio>` wiring
  - `timeline.xml` (FCPXML, optional) for manual CapCut editor users
  - `sfx_reference.csv` (optional) for human review

Usage:
    pip install elevenlabs python-dotenv
    cp .env.example .env  # add ELEVENLABS_API_KEY
    python scripts/generate_sfx.py --project lumen
    python scripts/generate_sfx.py --project lumen --no-fcpxml
"""

import argparse
import os
import sys
import json
import time
import re
from pathlib import Path
from datetime import datetime

try:
    from dotenv import load_dotenv
    from elevenlabs.client import ElevenLabs
except ImportError:
    print("Missing dependencies. Please install:")
    print("  pip install elevenlabs python-dotenv")
    sys.exit(1)


# Path constants — resolved relative to repo root
REPO_ROOT = Path(__file__).parent.parent
ENV_FILE = REPO_ROOT / ".env"

# Frame rate for FCPXML timeline
FRAME_RATE = 30

# Schema version this script understands
EXPECTED_SCHEMA_VERSION = "1.0"

# Default volumes by layer when sfx-plan entry omits volume
LAYER_DEFAULT_VOLUMES = {
    "foreground": 0.8,
    "accent": 0.7,
    "background": 0.3,
    "ambient": 0.4,
}


def parse_args():
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description="SFX Generator for Revideo projects.")
    parser.add_argument(
        "--project",
        help="Project name under projects/ (e.g., 'lumen'). If omitted, uses repo-root sfx-plan.json.",
    )
    parser.add_argument(
        "--no-fcpxml",
        action="store_true",
        help="Skip FCPXML generation (headless pipelines).",
    )
    parser.add_argument(
        "--no-csv",
        action="store_true",
        help="Skip CSV reference generation.",
    )
    return parser.parse_args()


def resolve_paths(project_name):
    """Resolve input/output paths based on --project arg."""
    if project_name:
        project_root = REPO_ROOT / "projects" / project_name
        if not project_root.exists():
            print(f"Error: project directory {project_root} not found.")
            sys.exit(1)
        return {
            "plan_file": project_root / "sfx-plan.json",
            "manifest_file": project_root / "sfx-manifest.json",
            "output_dir": project_root / "sfx",
            "project_name": project_name,
        }
    else:
        return {
            "plan_file": REPO_ROOT / "sfx-plan.json",
            "manifest_file": REPO_ROOT / "sfx-manifest.json",
            "output_dir": REPO_ROOT / "sfx",
            "project_name": "default",
        }


def load_config():
    """Load environment variables and validate API key."""
    if ENV_FILE.exists():
        load_dotenv(ENV_FILE)
    else:
        load_dotenv(REPO_ROOT.parent / ".env")

    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("Error: ELEVENLABS_API_KEY not found or not set.")
        print(f"Please create {ENV_FILE} with your API key.")
        print("Get your key from: https://elevenlabs.io/app/settings/api-keys")
        sys.exit(1)

    return api_key


def load_sfx_plan(plan_file):
    """Load sound effects plan from JSON file.

    Supports the new nested-by-scene schema and emits a deprecation warning
    for the legacy flat 'sounds' list.
    """
    if not plan_file.exists():
        print(f"Error: {plan_file} not found.")
        print("       Run the sound-designer agent to produce sfx-plan.json first.")
        sys.exit(1)

    with open(plan_file, "r") as f:
        data = json.load(f)

    version = data.get("schema_version")
    if version and version != EXPECTED_SCHEMA_VERSION:
        print(
            f"Warning: sfx-plan schema_version={version}, expected {EXPECTED_SCHEMA_VERSION}."
            " Proceeding with best-effort parse."
        )

    # New nested-by-scene format
    if "scenes" in data and isinstance(data["scenes"], dict):
        flat_sounds = []
        for scene_id, entries in data["scenes"].items():
            for entry in entries:
                entry = {**entry}
                entry.setdefault("scene", scene_id)
                flat_sounds.append(entry)
        return data, flat_sounds, "nested"

    # Legacy flat format — best-effort compat
    if "sounds" in data and isinstance(data["sounds"], list):
        print("Warning: detected legacy flat 'sounds' schema. Recommend upgrading to nested 'scenes' format.")
        return data, data["sounds"], "legacy_flat"

    print("Error: sfx-plan.json must contain either 'scenes' (preferred) or 'sounds' (legacy).")
    sys.exit(1)


def sanitize_filename(name):
    """Convert name to safe filename."""
    safe = re.sub(r'[^\w\s-]', '', name.lower())
    safe = re.sub(r'[\s]+', '_', safe)
    return safe


def scene_subfolder(output_dir, scene_id):
    """Return per-scene subfolder, creating it if needed."""
    folder = output_dir / scene_id
    folder.mkdir(parents=True, exist_ok=True)
    return folder


def sound_filename(sound):
    """Compute MP3 filename for a sound entry."""
    return f"{sound['id']}_{sanitize_filename(sound['name'])}.mp3"


def sound_relative_file_path(sound, output_dir_name="sfx"):
    """Compute project-relative path used in sfx-manifest.json's `file` field."""
    return f"./{output_dir_name}/{sound['scene']}/{sound_filename(sound)}"


def generate_sound(client, sound, output_dir, index, total):
    """Generate a single sound effect using ElevenLabs API."""
    folder = scene_subfolder(output_dir, sound["scene"])
    filename = sound_filename(sound)
    filepath = folder / filename

    if filepath.exists():
        print(f"  [{index}/{total}] Skipping (exists): {sound['scene']}/{filename}")
        return filepath, True

    print(f"  [{index}/{total}] Generating: {sound['scene']}/{sound['name']}...")
    print(f"            Prompt: {sound['prompt'][:60]}...")

    try:
        duration = max(0.5, min(sound["duration"], 30))
        audio_generator = client.text_to_sound_effects.convert(
            text=sound["prompt"],
            duration_seconds=duration,
        )

        with open(filepath, "wb") as f:
            for chunk in audio_generator:
                f.write(chunk)

        print(f"            Saved: {sound['scene']}/{filename}")
        return filepath, True

    except Exception as e:
        print(f"            Error: {e}")
        return None, False


def compute_start_offset_seconds(sound, plan_data):
    """Compute the absolute start time of a sound (scene-relative when scene start unknown).

    Resolution order:
      1. If `absolute_seconds` is set explicitly, use it directly.
      2. Otherwise return `beat_offset` as scene-relative offset (the consumer of
         the manifest decides how to combine with scene start times).
      3. `vo_word_index` is left for the code-generator to resolve via VO timing
         when available; fall back to beat_offset of 0.
    """
    anchor = sound.get("anchor", "beat_offset")

    if anchor == "absolute_seconds" and sound.get("absolute_seconds") is not None:
        return float(sound["absolute_seconds"])

    if sound.get("beat_offset") is not None:
        return float(sound["beat_offset"])

    if sound.get("absolute_seconds") is not None:
        return float(sound["absolute_seconds"])

    return 0.0


def generate_revideo_manifest(plan_data, sounds, manifest_file, output_dir_name="sfx"):
    """Write sfx-manifest.json — the contract consumed by code-generator.md."""
    manifest = {
        "project": plan_data.get("project", "default"),
        "schema_version": EXPECTED_SCHEMA_VERSION,
        "framerate": plan_data.get("framerate", FRAME_RATE),
        "scenes": {},
    }

    for sound in sounds:
        scene_id = sound["scene"]
        manifest["scenes"].setdefault(scene_id, [])
        layer = sound.get("layer", "foreground")
        volume = sound.get("volume")
        if volume is None:
            volume = LAYER_DEFAULT_VOLUMES.get(layer, plan_data.get("default_volume", 0.7))

        manifest["scenes"][scene_id].append({
            "id": sound["id"],
            "name": sound["name"],
            "file": sound_relative_file_path(sound, output_dir_name=output_dir_name),
            "start_offset_seconds": compute_start_offset_seconds(sound, plan_data),
            "duration_seconds": float(sound.get("duration", 1.0)),
            "volume": float(volume),
            "layer": layer,
            "category": sound.get("category", "ui"),
        })

    with open(manifest_file, "w") as f:
        json.dump(manifest, f, indent=2)

    return manifest_file


def seconds_to_frames(seconds, frame_rate=FRAME_RATE):
    """Convert seconds to frame count."""
    return int(seconds * frame_rate)


def fcpxml_timestamp(sound):
    """Return timestamp used for FCPXML offset — absolute_seconds preferred, else beat_offset."""
    if sound.get("absolute_seconds") is not None:
        return float(sound["absolute_seconds"])
    if sound.get("beat_offset") is not None:
        return float(sound["beat_offset"])
    return float(sound.get("timestamp", 0))  # legacy fallback


def generate_fcpxml(sounds, output_dir, project_name="Revideo SFX"):
    """Generate FCPXML for optional CapCut import (manual editor users)."""
    xml_path = output_dir / "timeline.xml"

    if sounds:
        last_sound = max(sounds, key=fcpxml_timestamp)
        total_duration = fcpxml_timestamp(last_sound) + last_sound.get("duration", 1.0) + 2
    else:
        total_duration = 40

    total_frames = seconds_to_frames(total_duration)

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE fcpxml>',
        '<fcpxml version="1.9">',
        '  <resources>',
        f'    <format id="r1" name="FFVideoFormat1080p30" frameDuration="1/{FRAME_RATE}s" width="1920" height="1080"/>',
    ]

    for i, sound in enumerate(sounds):
        filepath = output_dir / sound["scene"] / sound_filename(sound)
        if filepath.exists():
            xml_lines.append(
                f'    <asset id="a{i+1}" name="{sound["name"]}" src="file://{filepath}" '
                f'duration="{seconds_to_frames(sound.get("duration", 1))}/{FRAME_RATE}s" hasAudio="1"/>'
            )

    xml_lines.extend([
        '  </resources>',
        '  <library>',
        f'    <event name="SFX Import - {datetime.now().strftime("%Y-%m-%d")}">',
        f'      <project name="{project_name}">',
        f'        <sequence format="r1" duration="{total_frames}/{FRAME_RATE}s" tcStart="0s" tcFormat="NDF">',
        '          <spine>',
    ])

    xml_lines.append(
        f'            <gap name="Timeline" duration="{total_frames}/{FRAME_RATE}s" start="0s"/>'
    )
    xml_lines.append('          </spine>')

    for i, sound in enumerate(sounds):
        filepath = output_dir / sound["scene"] / sound_filename(sound)
        if filepath.exists():
            offset_frames = seconds_to_frames(fcpxml_timestamp(sound))
            duration_frames = seconds_to_frames(sound.get("duration", 1))
            xml_lines.append(
                f'          <asset-clip ref="a{i+1}" name="{sound["name"]}" '
                f'offset="{offset_frames}/{FRAME_RATE}s" '
                f'duration="{duration_frames}/{FRAME_RATE}s" '
                f'lane="1" start="0s"/>'
            )

    xml_lines.extend([
        '        </sequence>',
        '      </project>',
        '    </event>',
        '  </library>',
        '</fcpxml>',
    ])

    with open(xml_path, "w") as f:
        f.write("\n".join(xml_lines))

    return xml_path


def generate_csv_reference(sounds, output_dir):
    """Generate a simple CSV reference file for manual sync."""
    csv_path = output_dir / "sfx_reference.csv"

    with open(csv_path, "w") as f:
        f.write("ID,Scene,Timestamp (s),Name,Filename,Duration (s),Layer,Category,Prompt\n")
        for sound in sounds:
            filename = sound_filename(sound)
            timestamp = fcpxml_timestamp(sound)
            prompt = sound["prompt"].replace('"', '""')
            f.write(
                f'{sound["id"]},{sound["scene"]},{timestamp:.2f},'
                f'"{sound["name"]}",{filename},{sound.get("duration", 1):.1f},'
                f'{sound.get("layer", "foreground")},{sound.get("category", "ui")},"{prompt}"\n'
            )

    return csv_path


def main():
    args = parse_args()
    paths = resolve_paths(args.project)

    print("=" * 60)
    print(f"SFX Generator for Revideo — project: {paths['project_name']}")
    print("=" * 60)

    print("\n[1/5] Loading configuration...")
    api_key = load_config()
    print("      API key loaded.")

    print(f"\n[2/5] Loading sound plan from {paths['plan_file'].relative_to(REPO_ROOT)}...")
    plan_data, sounds, schema_kind = load_sfx_plan(paths["plan_file"])
    print(f"      Schema: {schema_kind}; total sounds: {len(sounds)}")

    print("\n[3/5] Setting up output directory...")
    paths["output_dir"].mkdir(parents=True, exist_ok=True)
    print(f"      Output: {paths['output_dir'].relative_to(REPO_ROOT)}")

    print("\n[4/5] Generating sound effects...")
    client = ElevenLabs(api_key=api_key)

    success_count = 0
    failed_count = 0
    skipped_count = 0

    for i, sound in enumerate(sounds, 1):
        filepath, success = generate_sound(client, sound, paths["output_dir"], i, len(sounds))
        if success:
            if filepath and filepath.exists():
                success_count += 1
            else:
                skipped_count += 1
        else:
            failed_count += 1

        if success and i < len(sounds):
            time.sleep(0.5)

    print(f"\n      Generated: {success_count}")
    print(f"      Skipped:   {skipped_count}")
    print(f"      Failed:    {failed_count}")

    print("\n[5/5] Writing manifest + import files...")

    manifest_path = generate_revideo_manifest(
        plan_data, sounds, paths["manifest_file"], output_dir_name=paths["output_dir"].name,
    )
    print(f"      Revideo manifest: {manifest_path.relative_to(REPO_ROOT)}")

    if not args.no_fcpxml:
        xml_path = generate_fcpxml(sounds, paths["output_dir"], plan_data.get("project", "Revideo SFX"))
        print(f"      FCP XML (optional): {xml_path.relative_to(REPO_ROOT)}")

    if not args.no_csv:
        csv_path = generate_csv_reference(sounds, paths["output_dir"])
        print(f"      CSV Reference (optional): {csv_path.relative_to(REPO_ROOT)}")

    print("\n" + "=" * 60)
    print("COMPLETE!")
    print("=" * 60)
    print(f"\nOutput directory: {paths['output_dir'].relative_to(REPO_ROOT)}")
    print(f"Total sounds: {len(sounds)}")
    print(f"Successfully generated: {success_count}")
    print("\nNext steps:")
    print("  1. The code-generator agent auto-wires <Audio> components from sfx-manifest.json.")
    print("  2. Run `npm run start` in the project folder to preview in the Revideo editor.")
    if not args.no_fcpxml:
        print("  3. (Optional) Import timeline.xml into CapCut for manual editing.")


if __name__ == "__main__":
    main()
