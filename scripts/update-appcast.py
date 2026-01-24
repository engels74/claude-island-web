#!/usr/bin/env python3
"""Update appcast.xml with a new release item.

This script reads release information from environment variables and
updates the Sparkle appcast XML file with a new release entry.

Environment Variables:
    VERSION (required): The version string (e.g., "1.2.3")
    BUILD_NUMBER (required): The build number (e.g., "202601251200")
    DOWNLOAD_URL (required): URL to download the release archive
    ED_SIGNATURE (optional): EdDSA signature for Sparkle
    FILE_SIZE (optional): Size of the download in bytes (default: "0")
    MIN_SYSTEM_VERSION (optional): Minimum macOS version (default: "15.6")

Usage:
    VERSION=1.0.0 BUILD_NUMBER=202601251200 DOWNLOAD_URL=https://example.com/app.zip python update-appcast.py

Example:
    >>> import os
    >>> os.environ["VERSION"] = "1.0.0"
    >>> os.environ["BUILD_NUMBER"] = "202601251200"
    >>> os.environ["DOWNLOAD_URL"] = "https://example.com/app.zip"
    >>> update_appcast()  # Updates public/appcast.xml
"""

import os
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Final, NotRequired, TypedDict

# Constants
SPARKLE_NS: Final[str] = "http://www.andymatuschak.org/xml-namespaces/sparkle"
DC_NS: Final[str] = "http://purl.org/dc/elements/1.1/"
APPCAST_PATH: Final[Path] = Path("public/appcast.xml")
MAX_VERSIONS: Final[int] = 10

# Register namespaces
ET.register_namespace("sparkle", SPARKLE_NS)
ET.register_namespace("dc", DC_NS)


class AppcastError(Exception):
    """Raised when appcast update fails."""


class EnvConfig(TypedDict):
    """Environment variable configuration for release info."""

    VERSION: str
    BUILD_NUMBER: str
    DOWNLOAD_URL: str
    ED_SIGNATURE: NotRequired[str]
    FILE_SIZE: NotRequired[str]
    MIN_SYSTEM_VERSION: NotRequired[str]


@dataclass(slots=True, frozen=True)
class ReleaseConfig:
    """Configuration for a release item.

    Attributes:
        version: The version string (e.g., "1.2.3").
        build_number: The build number (e.g., "202601251200").
        download_url: URL to download the release archive.
        ed_signature: EdDSA signature for Sparkle verification.
        file_size: Size of the download in bytes.
        min_system_version: Minimum macOS version required.
    """

    version: str
    build_number: str
    download_url: str
    ed_signature: str
    file_size: str
    min_system_version: str


def load_config_from_env() -> ReleaseConfig:
    """Load release configuration from environment variables.

    Returns:
        ReleaseConfig with values from environment.

    Raises:
        AppcastError: If required environment variables are missing.
    """
    try:
        version = os.environ["VERSION"]
        build_number = os.environ["BUILD_NUMBER"]
        download_url = os.environ["DOWNLOAD_URL"]
    except KeyError as e:
        msg = f"Missing required environment variable: {e.args[0]}"
        raise AppcastError(msg) from e

    file_size = os.environ.get("FILE_SIZE", "0")
    try:
        _ = int(file_size)
    except ValueError as e:
        msg = f"FILE_SIZE must be a valid integer, got: {file_size!r}"
        raise AppcastError(msg) from e

    return ReleaseConfig(
        version=version,
        build_number=build_number,
        download_url=download_url,
        ed_signature=os.environ.get("ED_SIGNATURE", ""),
        file_size=file_size,
        min_system_version=os.environ.get("MIN_SYSTEM_VERSION", "15.6"),
    )


def create_release_item(config: ReleaseConfig, /) -> ET.Element:
    """Create a new release item XML element.

    Args:
        config: Release configuration containing version, URL, and metadata.

    Returns:
        XML Element representing the release item.
    """
    item = ET.Element("item")
    ET.SubElement(item, "title").text = f"Version {config.version}"
    ET.SubElement(item, "pubDate").text = datetime.now(timezone.utc).strftime(
        "%a, %d %b %Y %H:%M:%S %z"
    )
    # Use build_number for sparkle:version (compared against CFBundleVersion)
    ET.SubElement(item, f"{{{SPARKLE_NS}}}version").text = config.build_number
    # Use version for sparkle:shortVersionString (displayed to user)
    ET.SubElement(item, f"{{{SPARKLE_NS}}}shortVersionString").text = config.version
    ET.SubElement(
        item, f"{{{SPARKLE_NS}}}minimumSystemVersion"
    ).text = config.min_system_version

    enclosure = ET.SubElement(item, "enclosure")
    enclosure.set("url", config.download_url)
    enclosure.set("length", config.file_size)
    enclosure.set("type", "application/octet-stream")
    if config.ed_signature:
        enclosure.set(f"{{{SPARKLE_NS}}}edSignature", config.ed_signature)

    return item


def prune_old_items(channel: ET.Element, /, *, max_items: int = MAX_VERSIONS) -> None:
    """Remove old release items, keeping only the most recent.

    Args:
        channel: The channel element containing items.
        max_items: Maximum number of items to retain (default: 10).
    """
    all_items = channel.findall("item")
    if len(all_items) > max_items:
        for old_item in all_items[max_items:]:
            channel.remove(old_item)


def update_appcast(appcast_path: Path = APPCAST_PATH, /) -> None:
    """Update the appcast.xml file with a new release.

    Reads release information from environment variables, creates a new
    release item, inserts it at the beginning of the channel, and prunes
    old items to keep only the most recent versions.

    Args:
        appcast_path: Path to the appcast.xml file (default: public/appcast.xml).

    Raises:
        AppcastError: If required environment variables are missing or
            the appcast.xml structure is invalid.
    """
    config = load_config_from_env()

    tree = ET.parse(appcast_path)
    root = tree.getroot()

    if (channel_elem := root.find("channel")) is None:
        msg = "No <channel> element found in appcast.xml"
        raise AppcastError(msg)

    item = create_release_item(config)

    # Insert new item at the beginning (after channel metadata)
    if items := channel_elem.findall("item"):
        index = list(channel_elem).index(items[0])
        channel_elem.insert(index, item)
    else:
        channel_elem.append(item)

    prune_old_items(channel_elem)

    # Write XML to file
    tree.write(appcast_path, encoding="utf-8", xml_declaration=True)

    # Post-process: strip trailing whitespace and ensure trailing newline
    # (required by pre-commit hooks)
    content = appcast_path.read_text(encoding="utf-8")
    lines = [line.rstrip() for line in content.splitlines()]
    _ = appcast_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    update_appcast()
