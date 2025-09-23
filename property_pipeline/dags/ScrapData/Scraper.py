from property_pipeline.dags.ScrapData.scrape_utils import fetch_urls, download_final_links, extract_text_from_links, extract_data_with_gpt
from property_pipeline.dags.ScrapData.Property_Data import PropertyData

class PropertyScraper:
    def __init__(self, urls_arg=None):
        self.urls_arg = urls_arg

    def scrape_properties(self):
        all_urls = fetch_urls()
        final_links = download_final_links(all_urls)
        texts = extract_text_from_links(final_links)
        extracted_data = extract_data_with_gpt(texts)
        properties = []
        for item in extracted_data:
            try:
                property_obj = PropertyData(**item)
                properties.append(property_obj)
            except Exception as e:
                print(f"Error while data scraping: {e}")
        return properties
