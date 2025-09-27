#!/usr/bin/env python3
"""
College Essay Prompt Crawler

Uses crawl4ai to extract college supplemental essay prompts from web pages
and structures them using dspy and OpenAI API for consistent output format.
"""

import asyncio
import json
import os
from typing import Any, Dict, List, Literal, Optional
from urllib.parse import urlparse

import dspy
import pydantic
from crawl4ai import AsyncWebCrawler
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class EssayPrompt(pydantic.BaseModel):
    """Individual essay prompt structure"""

    prompt_number: int
    prompt_text: str
    word_limit: Optional[str] = None
    prompt_specific_guidelines: Optional[str] = None
    additional_notes: Optional[str] = None


class CollegeEssayPrompts(pydantic.BaseModel):
    """Complete college essay prompt structure"""

    academic_year: Optional[
        Literal["23-24", "24-25", "25-26", "26-27", "27-28", "28-29", "29-30"]
    ] = None
    general_essay_guidelines: Optional[str] = None
    prompts: List[EssayPrompt]
    source_url: str

    class Config:
        json_schema_extra = {
            "description": "Structured representation of college supplemental essay prompts"
        }


class ExtractEssayPrompts(dspy.Signature):
    """
    You are an expert at analyzing college application websites and extracting essay prompt information.
    Extract and structure all supplemental essay prompts from the given webpage content.

    Key Instructions:
    1. Extract the academic year for these prompts in the format "XX-XX" (e.g., "24-25", "23-24", "25-26"). Convert full years like "2024-2025" to "24-25" format. Choose from: 23-24, 24-25, 25-26, 26-27, 27-28, 28-29, 29-30.
    2. Extract all supplemental essay prompts (not common application essays)
    3. For each prompt, capture:
       - The full prompt text
       - Word/character limits if mentioned
       - Prompt-specific guidelines: Extract the COMPLETE paragraphs or sections that provide specific guidance for that individual prompt. Include all sentences and details, not just the first sentence. This may include multiple paragraphs of advice specific to that prompt.
       - Any additional notes specific to that prompt
    4. Extract general essay guidelines - overall advice from essay helper websites or the college about how to approach writing essays for this college (writing style, what they're looking for, general tips that apply to all essays, etc.)
    5. Number the prompts sequentially (1, 2, 3, etc.)
    6. Focus only on essay prompts - ignore other application requirements like test scores, transcripts, etc.
    7. Distinguish between:
       - General guidelines: Broad advice about writing for this college (goes in general_essay_guidelines)
       - Prompt-specific guidelines: Complete, detailed instructions for individual prompts - include ALL paragraphs and sentences that relate to that specific prompt (goes in prompt_specific_guidelines for each prompt)
    """

    webpage_content: str = dspy.InputField(
        desc="The raw content extracted from the college's essay prompt webpage"
    )
    structured_prompts: CollegeEssayPrompts = dspy.OutputField(
        desc="Structured essay prompts data"
    )


class EssayPromptCrawler:
    """College essay prompt web crawler and extractor"""

    def __init__(self):
        """Initialize the crawler with OpenAI configuration"""
        self.openai_api_key = os.getenv("OPENAI_API_KEY")

        if not self.openai_api_key:
            raise ValueError(
                "OPENAI_API_KEY not found. Please add OPENAI_API_KEY=your-api-key to your .env file."
            )

        # Configure dspy with OpenAI
        dspy.configure(
            lm=dspy.LM(
                model="openai/gpt-4o-mini",  # Cost-effective model for text extraction
                max_tokens=4000,  # Standard token limit
                temperature=0.1,  # Low temperature for consistent extraction
                api_key=self.openai_api_key,
            )
        )

        # Initialize the extractor
        self.extractor = dspy.Predict(ExtractEssayPrompts)

    async def crawl_page(self, url: str) -> str:
        """
        Crawl a single webpage and extract content

        Args:
            url: The URL to crawl

        Returns:
            Extracted text content from the webpage
        """
        print(f"🕷️  Crawling: {url}")

        async with AsyncWebCrawler(verbose=True) as crawler:
            try:
                result = await crawler.arun(
                    url=url,
                    # Remove JavaScript and focus on main content
                    js_code=None,
                    # Wait for page to load
                    wait_for=2,
                    # Extract only text content
                    content_filter="text",
                    # Remove navigation and footer content
                    excluded_tags=[
                        "nav",
                        "footer",
                        "header",
                        "aside",
                        "script",
                        "style",
                    ],
                    # CSS selector to focus on main content if available
                    css_selector="main, .content, .main-content, article, .essay-prompts, .supplemental-essays",
                )

                if result.success:
                    print(f"✅ Successfully crawled {url}")
                    print(f"📄 Content length: {len(result.cleaned_html)} characters")
                    return result.cleaned_html
                else:
                    print(f"❌ Failed to crawl {url}: {result.error_message}")
                    return ""

            except Exception as e:
                print(f"❌ Exception while crawling {url}: {e}")
                return ""

    def extract_prompts(
        self, webpage_content: str, source_url: str
    ) -> Optional[CollegeEssayPrompts]:
        """
        Extract structured essay prompts from webpage content

        Args:
            webpage_content: Raw HTML/text content from webpage
            source_url: Original URL for reference

        Returns:
            Structured essay prompts or None if extraction fails
        """
        if not webpage_content.strip():
            print("❌ No content to extract from")
            return None

        try:
            print("🤖 Extracting essay prompts using OpenAI...")

            # Extract structured data using dspy
            result = self.extractor(webpage_content=webpage_content)

            # Add source URL to the result
            structured_prompts = result.structured_prompts
            structured_prompts.source_url = source_url

            print(f"✅ Successfully extracted essay prompts")
            print(f"📝 Found {len(structured_prompts.prompts)} essay prompts")
            if structured_prompts.academic_year:
                print(f"📅 Academic Year: {structured_prompts.academic_year}")

            return structured_prompts

        except Exception as e:
            print(f"❌ Failed to extract prompts: {e}")
            return None

    async def crawl_and_extract(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Complete workflow: crawl webpage and extract structured essay prompts

        Args:
            url: URL of the college essay prompt page

        Returns:
            Structured essay prompts as dictionary or None if failed
        """
        print(f"\n🎯 Starting essay prompt extraction for: {url}")

        # Step 1: Crawl the webpage
        content = await self.crawl_page(url)

        if not content:
            print("❌ No content retrieved from webpage")
            return None

        # Step 2: Extract structured prompts
        prompts = self.extract_prompts(content, url)

        if not prompts:
            print("❌ Failed to extract structured prompts")
            return None

        # Convert to dictionary for JSON serialization
        return prompts.model_dump()

    def save_results(self, results: Dict[str, Any], output_file: str = None) -> str:
        """
        Save extracted prompts to JSON file

        Args:
            results: Structured essay prompts dictionary
            output_file: Output filename (auto-generated if None)

        Returns:
            Path to saved file
        """
        if output_file is None:
            # Generate filename from URL domain and academic year
            domain = urlparse(results.get("source_url", "")).netloc.replace(".", "_")
            academic_year = (
                results.get("academic_year", "unknown")
                .replace("-", "_")
                .replace("/", "_")
            )
            output_file = f"{domain}_{academic_year}_essay_prompts.json"

        print(f"💾 Saving results to: {output_file}")

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"✅ Results saved successfully")
        return output_file


def print_summary(results: Dict[str, Any]):
    """Print a formatted summary of extracted prompts"""
    print(f"\n📋 Essay Prompt Summary")
    print(f"=" * 50)
    print(f"Academic Year: {results.get('academic_year', 'Not specified')}")
    print(f"Source: {results['source_url']}")

    if results.get("general_essay_guidelines"):
        print(f"\n📝 General Essay Guidelines:")
        print(f"   {results['general_essay_guidelines']}")

    print(f"\n📝 Essay Prompts ({len(results['prompts'])} total):")
    for prompt in results["prompts"]:
        print(f"\n   Prompt {prompt['prompt_number']}:")
        print(
            f"   Text: {prompt['prompt_text'][:100]}..."
            if len(prompt["prompt_text"]) > 100
            else f"   Text: {prompt['prompt_text']}"
        )
        if prompt.get("word_limit"):
            print(f"   Word Limit: {prompt['word_limit']}")
        if prompt.get("prompt_specific_guidelines"):
            print(f"   Prompt Guidelines: {prompt['prompt_specific_guidelines']}")
        if prompt.get("additional_notes"):
            print(f"   Notes: {prompt['additional_notes']}")


async def main():
    """Main function with example usage"""
    print("🎓 College Essay Prompt Crawler")
    print("=" * 50)

    # Initialize crawler
    try:
        crawler = EssayPromptCrawler()
        print("✅ Crawler initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize crawler: {e}")
        return

    # Example URLs (replace with actual college essay prompt pages)
    example_urls = [
        "https://www.collegevine.com/schools/agnes-scott-college/essay-prompts",
    ]

    # Use example URLs directly
    print("📝 Processing example URLs")
    urls_to_process = example_urls

    # Process each URL
    all_results = []

    for url in urls_to_process:
        try:
            result = await crawler.crawl_and_extract(url)

            if result:
                all_results.append(result)

                # Print summary
                print_summary(result)

                # Save individual result
                output_file = crawler.save_results(result)
                print(f"📁 Saved to: {output_file}")

            else:
                print(f"❌ Failed to process: {url}")

        except Exception as e:
            print(f"❌ Error processing {url}: {e}")

        print("\n" + "=" * 50)

    # Save combined results if multiple URLs processed
    if len(all_results) > 1:
        combined_file = "combined_essay_prompts.json"
        print(f"💾 Saving combined results to: {combined_file}")

        with open(combined_file, "w", encoding="utf-8") as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)

        print(f"✅ Combined results saved")

    print(
        f"\n🎉 Processing complete! Extracted prompts from {len(all_results)} college(s)"
    )


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())
