from ScrapData.Scraper import Scraper
from ScrapData.scrape_utils import fetch_urls, download_final_links as utils_download_final_links

class PropertyScraper(Scraper):
    def download_final_links(self):
        urls = fetch_urls() if self.urls_arg is None else fetch_urls(self.urls_arg)
        return utils_download_final_links(urls)