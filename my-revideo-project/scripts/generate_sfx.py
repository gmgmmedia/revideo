#!/usr/bin/env python3
"""
SFX Generator for Solana Boxes Explainer Video
Generates sound effects using ElevenLabs API and creates FCP XML for CapCut import.

Usage:
    1. Copy .env.example to .env and add your ElevenLabs API key
    2. pip install elevenlabs python-dotenv
    3. python scripts/generate_sfx.py
"""

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


# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
SFX_DATA_FILE = PROJECT_ROOT / "sfx_data.json"
OUTPUT_DIR = PROJECT_ROOT / "sfx_output"
ENV_FILE = PROJECT_ROOT / ".env"

# Frame rate for XML timeline
FRAME_RATE = 30


def load_config():
    """Load environment variables and validate API key."""
    if ENV_FILE.exists():
        load_dotenv(ENV_FILE)
    else:
        # Try parent directory
        load_dotenv(PROJECT_ROOT.parent / ".env")

    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("Error: ELEVENLABS_API_KEY not found or not set.")
        print(f"Please create {ENV_FILE} with your API key.")
        print("Get your key from: https://elevenlabs.io/app/settings/api-keys")
        sys.exit(1)

    return api_key


def load_sfx_data():
    """Load sound effects data from JSON file."""
    if not SFX_DATA_FILE.exists():
        print(f"Error: {SFX_DATA_FILE} not found.")
        sys.exit(1)

    with open(SFX_DATA_FILE, "r") as f:
        return json.load(f)


def sanitize_filename(name):
    """Convert name to safe filename."""
    # Remove special characters, replace spaces with underscores
    safe = re.sub(r'[^\w\s-]', '', name.lower())
    safe = re.sub(r'[\s]+', '_', safe)
    return safe


def generate_sound(client, sound, output_dir, index, total):
    """Generate a single sound effect using ElevenLabs API."""
    filename = f"{sound['id']}_{sanitize_filename(sound['name'])}.mp3"
    filepath = output_dir / filename

    # Skip if already exists
    if filepath.exists():
        print(f"  [{index}/{total}] Skipping (exists): {filename}")
        return filepath, True

    print(f"  [{index}/{total}] Generating: {sound['name']}...")
    print(f"            Prompt: {sound['prompt'][:50]}...")

    try:
        # Generate sound effect
        # API requires duration between 0.5 and 30 seconds
        duration = max(0.5, min(sound["duration"], 30))
        audio_generator = client.text_to_sound_effects.convert(
            text=sound["prompt"],
            duration_seconds=duration
        )

        # Write audio to file
        with open(filepath, "wb") as f:
            for chunk in audio_generator:
                f.write(chunk)

        print(f"            Saved: {filename}")
        return filepath, True

    except Exception as e:
        print(f"            Error: {e}")
        return None, False


def seconds_to_frames(seconds, frame_rate=FRAME_RATE):
    """Convert seconds to frame count."""
    return int(seconds * frame_rate)


def generate_fcpxml(sounds, output_dir, project_name="Solana SFX"):
    """Generate Final Cut Pro XML for CapCut import."""
    xml_path = output_dir / "timeline.xml"

    # Calculate total duration (last sound timestamp + duration + buffer)
    if sounds:
        last_sound = max(sounds, key=lambda s: s["timestamp"])
        total_duration = last_sound["timestamp"] + last_sound["duration"] + 2
    else:
        total_duration = 40

    total_frames = seconds_to_frames(total_duration)

    # Build XML
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE fcpxml>',
        '<fcpxml version="1.9">',
        '  <resources>',
        f'    <format id="r1" name="FFVideoFormat1080p30" frameDuration="1/{FRAME_RATE}s" width="1920" height="1080"/>',
    ]

    # Add asset references
    for i, sound in enumerate(sounds):
        filename = f"{sound['id']}_{sanitize_filename(sound['name'])}.mp3"
        filepath = output_dir / filename
        if filepath.exists():
            xml_lines.append(
                f'    <asset id="a{i+1}" name="{sound["name"]}" src="file://{filepath}" '
                f'duration="{seconds_to_frames(sound["duration"])}/{FRAME_RATE}s" hasAudio="1"/>'
            )

    xml_lines.extend([
        '  </resources>',
        '  <library>',
        f'    <event name="SFX Import - {datetime.now().strftime("%Y-%m-%d")}">',
        f'      <project name="{project_name}">',
        f'        <sequence format="r1" duration="{total_frames}/{FRAME_RATE}s" tcStart="0s" tcFormat="NDF">',
        '          <spine>',
    ])

    # Add placeholder video gap for the full duration
    xml_lines.append(
        f'            <gap name="Timeline" duration="{total_frames}/{FRAME_RATE}s" start="0s"/>'
    )

    xml_lines.append('          </spine>')

    # Add audio clips on a separate lane
    for i, sound in enumerate(sounds):
        filename = f"{sound['id']}_{sanitize_filename(sound['name'])}.mp3"
        filepath = output_dir / filename
        if filepath.exists():
            offset_frames = seconds_to_frames(sound["timestamp"])
            duration_frames = seconds_to_frames(sound["duration"])
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
        f.write("ID,Scene,Timestamp (s),Name,Filename,Duration (s),Prompt\n")
        for sound in sounds:
            filename = f"{sound['id']}_{sanitize_filename(sound['name'])}.mp3"
            # Escape commas in prompt
            prompt = sound["prompt"].replace('"', '""')
            f.write(
                f'{sound["id"]},{sound["scene"]},{sound["timestamp"]:.2f},'
                f'"{sound["name"]}",{filename},{sound["duration"]:.1f},"{prompt}"\n'
            )

    return csv_path


def main():
    print("=" * 60)
    print("SFX Generator for Solana Boxes Explainer")
    print("=" * 60)

    # Load configuration
    print("\n[1/5] Loading configuration...")
    api_key = load_config()
    print("      API key loaded.")

    # Load SFX data
    print("\n[2/5] Loading sound data...")
    data = load_sfx_data()
    sounds = data["sounds"]
    print(f"      Found {len(sounds)} sounds to generate.")

    # Create output directory
    print("\n[3/5] Setting up output directory...")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"      Output: {OUTPUT_DIR}")

    # Initialize ElevenLabs client
    print("\n[4/5] Generating sound effects...")
    client = ElevenLabs(api_key=api_key)

    success_count = 0
    failed_count = 0
    skipped_count = 0

    for i, sound in enumerate(sounds, 1):
        filepath, success = generate_sound(client, sound, OUTPUT_DIR, i, len(sounds))
        if success:
            if filepath and filepath.exists():
                success_count += 1
            else:
                skipped_count += 1
        else:
            failed_count += 1

        # Rate limiting - be nice to the API
        if success and i < len(sounds):
            time.sleep(0.5)

    print(f"\n      Generated: {success_count}")
    print(f"      Skipped:   {skipped_count}")
    print(f"      Failed:    {failed_count}")

    # Generate import files
    print("\n[5/5] Generating import files...")

    xml_path = generate_fcpxml(sounds, OUTPUT_DIR, data.get("project", "SFX Project"))
    print(f"      FCP XML: {xml_path}")

    csv_path = generate_csv_reference(sounds, OUTPUT_DIR)
    print(f"      CSV Reference: {csv_path}")

    # Summary
    print("\n" + "=" * 60)
    print("COMPLETE!")
    print("=" * 60)
    print(f"\nOutput directory: {OUTPUT_DIR}")
    print(f"Total sounds: {len(sounds)}")
    print(f"Successfully generated: {success_count}")
    print("\nNext steps:")
    print("  1. Open CapCut Desktop")
    print("  2. Go to File > Import > XML File")
    print(f"  3. Select: {xml_path}")
    print("  4. Audio clips will appear on timeline at correct timestamps")
    print("\nAlternatively, use the CSV file for manual reference:")
    print(f"  {csv_path}")


if __name__ == "__main__":
    main()
