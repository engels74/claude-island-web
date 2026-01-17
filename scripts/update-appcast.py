#!/usr/bin/env python3
"""Update appcast.xml with a new release item."""

import os
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

SPARKLE_NS = "http://www.andymatuschak.org/xml-namespaces/sparkle"
DC_NS = "http://purl.org/dc/elements/1.1/"

ET.register_namespace("sparkle", SPARKLE_NS)
ET.register_namespace("dc", DC_NS)


def update_appcast() -> None:
    version = os.environ["VERSION"]
    download_url = os.environ["DOWNLOAD_URL"]
    ed_signature = os.environ.get("ED_SIGNATURE", "")
    file_size = os.environ.get("FILE_SIZE", "0")
    min_system_version = os.environ.get("MIN_SYSTEM_VERSION", "15.6")

    tree = ET.parse("public/appcast.xml")
    root = tree.getroot()
    channel_elem = root.find("channel")

    if channel_elem is None:
        msg = "No <channel> element found in appcast.xml"
        raise ValueError(msg)

    # Create new item
    item = ET.Element("item")
    ET.SubElement(item, "title").text = f"Version {version}"
    ET.SubElement(item, "pubDate").text = datetime.now(timezone.utc).strftime(
        "%a, %d %b %Y %H:%M:%S %z"
    )
    ET.SubElement(item, f"{{{SPARKLE_NS}}}version").text = version
    ET.SubElement(item, f"{{{SPARKLE_NS}}}shortVersionString").text = version
    ET.SubElement(item, f"{{{SPARKLE_NS}}}minimumSystemVersion").text = min_system_version

    enclosure = ET.SubElement(item, "enclosure")
    enclosure.set("url", download_url)
    enclosure.set("length", file_size)
    enclosure.set("type", "application/octet-stream")
    if ed_signature:
        enclosure.set(f"{{{SPARKLE_NS}}}edSignature", ed_signature)

    # Insert new item at the beginning (after channel metadata)
    items = channel_elem.findall("item")
    if items:
        index = list(channel_elem).index(items[0])
        channel_elem.insert(index, item)
    else:
        channel_elem.append(item)

    # Keep only last 10 versions
    all_items = channel_elem.findall("item")
    if len(all_items) > 10:
        for old_item in all_items[10:]:
            channel_elem.remove(old_item)

    tree.write("public/appcast.xml", encoding="utf-8", xml_declaration=True)


if __name__ == "__main__":
    update_appcast()
