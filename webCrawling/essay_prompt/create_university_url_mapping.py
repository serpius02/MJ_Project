#!/usr/bin/env python3
"""
University URL Mapping Creator

Reads a CSV file containing university names and associated essay prompt URLs
from different sources and creates a dictionary mapping for essay crawling.
"""

import json
import os
from typing import Dict, List, Optional

import pandas as pd


def create_university_url_mapping(
    csv_file_path: str,
) -> Dict[str, Dict[str, Optional[str]]]:
    """
    Create a dictionary mapping university names to their essay prompt URLs from multiple sources.

    Args:
        csv_file_path: Path to the CSV file containing university data

    Returns:
        Dictionary with university names as keys and dict of URL sources as values
        Structure: {university_name: {source1: url1, source2: url2, ...}}
    """
    print(f"📁 Loading CSV file: {csv_file_path}")

    # Load the CSV file
    try:
        df = pd.read_csv(csv_file_path)
        print(f"✅ Successfully loaded CSV with {len(df)} rows")
    except Exception as e:
        print(f"❌ Error loading CSV file: {e}")
        return {}

    print(f"📋 Columns found: {list(df.columns)}")
    
    # Clean up column names (remove any line breaks and extra whitespace)
    df.columns = df.columns.str.strip().str.replace('\n', '', regex=True)
    print(f"📋 Cleaned columns: {list(df.columns)}")

    # Verify required columns exist  
    required_columns = ["Institution_name"]
    url_columns = [
        "CollegeEssayAdvisors",
        "EssayGuy", 
        "CollegeVineEssays",
        "CollegeVineGuide",
    ]

    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print(f"❌ Missing required columns: {missing_columns}")
        return {}

    available_url_columns = [col for col in url_columns if col in df.columns]
    print(f"🔗 Available URL columns: {available_url_columns}")
    
    # Debug: Show all columns to help identify correct column names
    if not available_url_columns:
        print("⚠️  No expected URL columns found. Here are all available columns:")
        for i, col in enumerate(df.columns):
            print(f"  {i+1}. '{col}'")
        print("Please check if your CSV has different column names for the URL sources.")
        return {}

    # Create the mapping dictionary
    university_url_mapping = {}

    print("\n🔄 Processing university mappings...")

    for index, row in df.iterrows():
        university_name = row["Institution_name"]

        # Skip rows with missing/null university names
        if pd.isna(university_name) or str(university_name).strip() == "":
            print(f"⚠️  Skipping row {index + 1}: Missing university name")
            continue

        university_name = str(university_name).strip()

        # Create a dictionary to store all URLs for this university
        url_sources = {}
        valid_urls_found = 0

        # Check each URL column and add valid URLs
        for url_col in available_url_columns:
            url_value = row[url_col]

            # Check if URL is not null/NaN and not empty
            if (
                pd.notna(url_value)
                and str(url_value).strip() != ""
                and str(url_value).lower() != "nan"
            ):
                url_value = str(url_value).strip()

                # Basic URL validation (starts with http)
                if url_value.startswith(("http://", "https://")):
                    url_sources[url_col] = url_value
                    valid_urls_found += 1
                else:
                    url_sources[url_col] = None
            else:
                url_sources[url_col] = None

        # Add to mapping
        university_url_mapping[university_name] = url_sources

        # Log the result
        if valid_urls_found > 0:
            print(f"✅ {university_name} -> {valid_urls_found} valid URLs found")
            for source, url in url_sources.items():
                if url:
                    print(f"   • {source}: {url}")
        else:
            print(f"❌ {university_name} -> No valid URLs found")
            for source in url_sources.keys():
                print(f"   • {source}: None")

    return university_url_mapping


def save_mapping_to_json(
    mapping: Dict[str, Dict[str, Optional[str]]],
    output_file: str = "university_url_mapping.json",
):
    """
    Save the university URL mapping to a JSON file.

    Args:
        mapping: Dictionary mapping university names to URLs
        output_file: Output JSON filename
    """
    print(f"\n💾 Saving mapping to: {output_file}")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)

    print(f"✅ Mapping saved successfully")


def print_mapping_statistics(mapping: Dict[str, Dict[str, Optional[str]]]):
    """
    Print statistics about the university URL mapping.

    Args:
        mapping: Dictionary mapping university names to URL sources
    """
    total_universities = len(mapping)
    universities_with_any_urls = 0
    total_urls_by_source = {}

    # Calculate statistics
    for university, url_sources in mapping.items():
        has_any_url = any(url is not None for url in url_sources.values())
        if has_any_url:
            universities_with_any_urls += 1

        # Count URLs by source
        for source, url in url_sources.items():
            if source not in total_urls_by_source:
                total_urls_by_source[source] = 0
            if url is not None:
                total_urls_by_source[source] += 1

    universities_without_urls = total_universities - universities_with_any_urls

    print(f"\n📊 Mapping Statistics:")
    print(f"=" * 50)
    print(f"Total universities: {total_universities}")
    print(f"Universities with at least one URL: {universities_with_any_urls}")
    print(f"Universities without any URLs: {universities_without_urls}")
    print(
        f"Overall coverage rate: {universities_with_any_urls/total_universities*100:.1f}%"
        if total_universities > 0
        else "Overall coverage rate: 0.0%"
    )

    print(f"\n🔗 URLs by Source:")
    for source, count in total_urls_by_source.items():
        coverage = count / total_universities * 100 if total_universities > 0 else 0
        print(f"  • {source}: {count} URLs ({coverage:.1f}% coverage)")

    # Show some examples
    print(f"\n📝 Sample entries with multiple URLs:")
    count = 0
    for name, url_sources in mapping.items():
        valid_urls = {k: v for k, v in url_sources.items() if v is not None}
        if len(valid_urls) > 1 and count < 3:
            print(f"  • {name}:")
            for source, url in valid_urls.items():
                print(f"    - {source}: {url}")
            count += 1

    print(f"\n🚫 Sample entries without URLs:")
    count = 0
    for name, url_sources in mapping.items():
        if not any(url is not None for url in url_sources.values()) and count < 3:
            print(f"  • {name}: No valid URLs")
            count += 1


def main():
    """Main function to create university URL mapping"""
    print("🎓 University URL Mapping Creator")
    print("=" * 50)

    # Use CSV file in the same directory
    csv_file_path = "Essay.csv"  # Assumes CSV file is named "Essay.csv"

    if not os.path.exists(csv_file_path):
        print(f"❌ File not found: {csv_file_path}")
        print("Make sure 'Essay.csv' is in the same directory as this script.")
        return

    print(f"📁 Using CSV file: {csv_file_path}")

    # Create the mapping
    mapping = create_university_url_mapping(csv_file_path)

    if not mapping:
        print("❌ Failed to create mapping")
        return

    # Print statistics
    print_mapping_statistics(mapping)

    # Save to JSON file
    output_file = "university_url_mapping.json"
    save_mapping_to_json(mapping, output_file)

    print(f"\n🎉 Process complete! University URL mapping created.")
    print(f"📁 Output file: {output_file}")

    # Ask if user wants to see the full mapping
    show_full = (
        input("\n🔍 Do you want to see the full mapping? (y/N): ").strip().lower()
    )
    if show_full == "y":
        print(f"\n📋 Full University URL Mapping:")
        print("=" * 80)
        for name, url_sources in mapping.items():
            valid_urls = sum(1 for url in url_sources.values() if url is not None)
            status = "✅" if valid_urls > 0 else "❌"
            print(f"{status} {name} ({valid_urls} URLs):")
            for source, url in url_sources.items():
                url_status = "  ✅" if url else "  ❌"
                print(f"{url_status} {source}: {url or 'None'}")
            print()


if __name__ == "__main__":
    main()
