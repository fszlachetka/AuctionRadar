from abc import ABC, abstractmethod
from ScrapData.scrape_utils import extract_text_from_links, extract_data_with_gpt
from ScrapData.Property_Data import PropertyData

class Scraper(ABC):
    def __init__(self, urls_arg=None):
        self.urls_arg = urls_arg

    @abstractmethod
    def download_final_links(self):
        pass

    def scrape_properties(self):
        final_links = self.download_final_links()
        texts = extract_text_from_links(final_links)
        extracted_data = extract_data_with_gpt(texts)
        return extracted_data
