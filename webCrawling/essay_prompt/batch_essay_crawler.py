#!/usr/bin/env python3
"""
Batch Essay Prompt Crawler

Uses the university URL mapping to batch process essay prompts from multiple universities
using a selected source (CollegeEssayAdvisors, EssayGuy, CollegeVineEssays, or CollegeVineGuide).
"""

import asyncio
import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

# Import the essay crawler class
from essay_prompt import EssayPromptCrawler


class BatchEssayCrawler:
    """Batch processor for university essay prompts"""

    def __init__(self):
        """Initialize the batch crawler"""
        self.crawler = None  # Will initialize with proper token limit later
        self.university_mapping = {}
        self.source_options = {
            "1": "CollegeEssayAdvisors",
            "2": "EssayGuy",
            "3": "CollegeVineEssays",
            "4": "CollegeVineGuide",
        }

    def initialize_crawler_for_source(self, source: str):
        """
        Initialize the crawler with appropriate token limits based on source.

        Args:
            source: Selected URL source name
        """
        # CollegeVineGuide typically has longer content, so use more tokens
        if source == "CollegeVineGuide":
            max_tokens = 12000
            print(f"🔧 Using extended token limit ({max_tokens}) for {source}")
        else:
            max_tokens = 4000
            print(f"🔧 Using standard token limit ({max_tokens}) for {source}")

        # Import here to avoid circular import
        import os

        import dspy
        from essay_prompt import EssayPromptCrawler

        # Get API key
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise ValueError(
                "OPENAI_API_KEY not found. Please add OPENAI_API_KEY=your-api-key to your .env file."
            )

        # Configure dspy with appropriate token limit
        dspy.configure(
            lm=dspy.LM(
                model="openai/gpt-4o-mini",
                max_tokens=max_tokens,
                temperature=0.1,
                api_key=openai_api_key,
            )
        )

        # Create a custom crawler that doesn't reinitialize DSPy
        self.crawler = self._create_custom_crawler()
    
    def _create_custom_crawler(self):
        """
        Create a custom crawler that uses the already configured DSPy settings.
        """
        import dspy
        from essay_prompt import ExtractEssayPrompts
        from crawl4ai import AsyncWebCrawler
        from urllib.parse import urlparse
        import os
        
        class CustomEssayPromptCrawler:
            """Custom crawler that doesn't reinitialize DSPy"""
            
            def __init__(self):
                # Don't reinitialize DSPy - use existing configuration
                self.extractor = dspy.Predict(ExtractEssayPrompts)
            
            async def crawl_page(self, url: str) -> str:
                print(f"🕷️  Crawling: {url}")
                
                async with AsyncWebCrawler(verbose=True) as crawler:
                    try:
                        result = await crawler.arun(
                            url=url,
                            js_code=None,
                            wait_for=2,
                            content_filter="text",
                            excluded_tags=[
                                "nav", "footer", "header", "aside", "script", "style"
                            ],
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
            
            def extract_prompts(self, webpage_content: str, source_url: str):
                if not webpage_content.strip():
                    print("❌ No content to extract from")
                    return None
                
                try:
                    print("🤖 Extracting essay prompts using OpenAI...")
                    
                    result = self.extractor(webpage_content=webpage_content)
                    
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
            
            async def crawl_and_extract(self, url: str):
                print(f"\n🎯 Starting essay prompt extraction for: {url}")
                
                content = await self.crawl_page(url)
                
                if not content:
                    print("❌ No content retrieved from webpage")
                    return None
                
                prompts = self.extract_prompts(content, url)
                
                if not prompts:
                    print("❌ Failed to extract structured prompts")
                    return None
                
                return prompts.model_dump()
        
        return CustomEssayPromptCrawler()

    def load_university_mapping(
        self, mapping_file: str = "university_url_mapping.json"
    ) -> bool:
        """
        Load the university URL mapping from JSON file.

        Args:
            mapping_file: Path to the university mapping JSON file

        Returns:
            True if loaded successfully, False otherwise
        """
        try:
            if not os.path.exists(mapping_file):
                print(f"❌ Mapping file not found: {mapping_file}")
                print(
                    "Please run 'create_university_url_mapping.py' first to generate the mapping file."
                )
                return False

            with open(mapping_file, "r", encoding="utf-8") as f:
                self.university_mapping = json.load(f)

            print(
                f"✅ Loaded university mapping with {len(self.university_mapping)} universities"
            )
            return True

        except Exception as e:
            print(f"❌ Error loading mapping file: {e}")
            return False

    def get_source_selection(self) -> Optional[str]:
        """
        Get user's source selection for URL processing.

        Returns:
            Selected source name or None if cancelled
        """
        print("\n🔗 Select URL source to process:")
        print("=" * 40)
        for option, source in self.source_options.items():
            print(f"{option}. {source}")
        print("0. Cancel")

        while True:
            choice = input("\nEnter your choice (1-4, or 0 to cancel): ").strip()

            if choice == "0":
                print("❌ Operation cancelled")
                return None
            elif choice in self.source_options:
                selected_source = self.source_options[choice]
                print(f"✅ Selected source: {selected_source}")
                return selected_source
            else:
                print("❌ Invalid choice. Please enter 1-4, or 0 to cancel.")

    def get_universities_with_urls(self, source: str) -> List[tuple]:
        """
        Get list of universities that have URLs for the selected source.

        Args:
            source: Selected URL source name

        Returns:
            List of (university_name, url) tuples
        """
        universities_with_urls = []

        for university, url_sources in self.university_mapping.items():
            url = url_sources.get(source)
            if url and url.strip():  # Check if URL exists and is not empty
                universities_with_urls.append((university, url))

        print(f"📊 Found {len(universities_with_urls)} universities with {source} URLs")
        return universities_with_urls

    async def process_university_batch(
        self, universities: List[tuple], source: str, max_concurrent: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Process a batch of universities concurrently.

        Args:
            universities: List of (university_name, url) tuples
            source: Selected URL source name
            max_concurrent: Maximum number of concurrent requests

        Returns:
            List of successfully processed results
        """
        print(f"\n🚀 Starting batch processing of {len(universities)} universities")
        print(f"⚙️ Max concurrent requests: {max_concurrent}")
        print(f"📊 Source: {source}")

        results = []
        errors = []

        # Process in batches to avoid overwhelming servers
        for i in range(0, len(universities), max_concurrent):
            batch = universities[i : i + max_concurrent]
            batch_start = i + 1
            batch_end = min(i + max_concurrent, len(universities))

            print(
                f"\n📦 Processing batch {batch_start}-{batch_end} of {len(universities)}"
            )

            # Create tasks for concurrent processing
            tasks = []
            for university_name, url in batch:
                task = self.process_single_university(university_name, url, source)
                tasks.append(task)

            # Execute batch concurrently
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results
            for j, result in enumerate(batch_results):
                university_name, url = batch[j]

                if isinstance(result, Exception):
                    error_info = {
                        "university": university_name,
                        "url": url,
                        "error": str(result),
                        "source": source,
                    }
                    errors.append(error_info)
                    print(f"❌ {university_name}: {result}")
                elif result:
                    results.append(result)
                    print(f"✅ {university_name}: Success")
                else:
                    error_info = {
                        "university": university_name,
                        "url": url,
                        "error": "Failed to extract prompts",
                        "source": source,
                    }
                    errors.append(error_info)
                    print(f"❌ {university_name}: Failed to extract prompts")

            # Add delay between batches to be respectful to servers
            if i + max_concurrent < len(universities):
                print("⏳ Waiting 10 seconds before next batch...")
                await asyncio.sleep(10)

        print(f"\n📊 Batch processing complete!")
        print(f"✅ Successful: {len(results)}")
        print(f"❌ Failed: {len(errors)}")

        # Save errors if any
        if errors:
            error_file = f"{source}_errors.json"
            with open(error_file, "w", encoding="utf-8") as f:
                json.dump(errors, f, indent=2, ensure_ascii=False)
            print(f"💾 Error log saved to: {error_file}")

        return results

    async def process_single_university(
        self, university_name: str, url: str, source: str
    ) -> Optional[Dict[str, Any]]:
        """
        Process a single university's essay prompts.

        Args:
            university_name: Name of the university
            url: URL to crawl
            source: URL source name

        Returns:
            Processed essay prompt data with university info, or None if failed
        """
        try:
            # Use the crawler to extract prompts
            result = await self.crawler.crawl_and_extract(url)

            if result:
                # Add university information to the result
                result["university_name"] = university_name
                result["url_source"] = source
                result["processed_at"] = datetime.now().isoformat()

                return result

            return None

        except Exception as e:
            raise Exception(f"Error processing {university_name}: {e}")

    def save_results(self, results: List[Dict[str, Any]], source: str) -> str:
        """
        Save batch processing results to JSON file.

        Args:
            results: List of processed essay prompt data
            source: Selected URL source name

        Returns:
            Path to saved file
        """
        output_file = f"{source}_Essays.json"

        print(f"\n💾 Saving {len(results)} results to: {output_file}")

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"✅ Results saved successfully")
        return output_file

    def print_summary(self, results: List[Dict[str, Any]], source: str):
        """
        Print a summary of the batch processing results.

        Args:
            results: List of processed results
            source: Selected URL source name
        """
        print(f"\n📋 Batch Processing Summary")
        print(f"=" * 50)
        print(f"Source: {source}")
        print(f"Total universities processed: {len(results)}")

        # Count universities with prompts
        universities_with_prompts = sum(
            1 for result in results if result.get("prompts")
        )
        print(f"Universities with prompts found: {universities_with_prompts}")

        # Count total prompts
        total_prompts = sum(len(result.get("prompts", [])) for result in results)
        print(f"Total essay prompts extracted: {total_prompts}")

        # Academic years found
        academic_years = set()
        for result in results:
            if result.get("academic_year"):
                academic_years.add(result["academic_year"])

        if academic_years:
            print(f"Academic years found: {', '.join(sorted(academic_years))}")

        # Show sample results
        print(f"\n📝 Sample Results:")
        for i, result in enumerate(results[:3]):
            university = result.get("university_name", "Unknown")
            prompt_count = len(result.get("prompts", []))
            academic_year = result.get("academic_year", "Unknown")
            print(f"  {i+1}. {university}: {prompt_count} prompts ({academic_year})")


async def main():
    """Main function for batch essay prompt processing"""
    print("🎓 Batch Essay Prompt Crawler")
    print("=" * 50)

    # Initialize batch crawler
    try:
        batch_crawler = BatchEssayCrawler()
        print("✅ Batch crawler initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize batch crawler: {e}")
        return

    # Load university mapping
    if not batch_crawler.load_university_mapping():
        return

    # Get source selection from user
    selected_source = batch_crawler.get_source_selection()
    if not selected_source:
        return

    # Initialize crawler with appropriate settings for selected source
    try:
        batch_crawler.initialize_crawler_for_source(selected_source)
        print("✅ Crawler configured for selected source")
    except Exception as e:
        print(f"❌ Failed to configure crawler: {e}")
        return

    # Get universities with URLs for selected source
    universities = batch_crawler.get_universities_with_urls(selected_source)

    if not universities:
        print(f"❌ No universities found with {selected_source} URLs")
        return

    # Ask for confirmation
    print(
        f"\n⚠️  About to process {len(universities)} universities from {selected_source}"
    )
    confirm = input("Continue? (y/N): ").strip().lower()

    if confirm != "y":
        print("❌ Operation cancelled")
        return

    # Process universities in batch
    try:
        results = await batch_crawler.process_university_batch(
            universities,
            selected_source,
            max_concurrent=3,  # Adjust based on server tolerance
        )

        if results:
            # Save results
            output_file = batch_crawler.save_results(results, selected_source)

            # Print summary
            batch_crawler.print_summary(results, selected_source)

            print(f"\n🎉 Batch processing complete!")
            print(f"📁 Output file: {output_file}")

        else:
            print("❌ No results were successfully processed")

    except Exception as e:
        print(f"❌ Batch processing failed: {e}")


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())
