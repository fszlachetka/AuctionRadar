import pytest
from ScrapData.PropertyScraper import PropertyScraper
from ScrapData.Scraper import Scraper

def test_get_instance_of():
    scraper = PropertyScraper()
    assert isinstance(scraper, PropertyScraper)
    assert isinstance(scraper, Scraper)

def test_returned_data():
    urls = {
        "https://lodz.sr.gov.pl/ogloszenia-komornicze": [["kancelaria"], ("licytacj",)],
    }
    scraper = PropertyScraper(urls_arg=urls)
    result = scraper.scrape_properties()
    assert isinstance(result, list)
    for item in result:
        assert isinstance(item, dict)
        assert 'url' in item
        assert 'data' in item
