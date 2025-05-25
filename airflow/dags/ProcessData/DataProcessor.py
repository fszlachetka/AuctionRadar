# plugins/property_scraper/processor.py
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)


class DataProcessor:
    def process_data(self, raw_properties: List[Dict]):
        """Processes raw property data"""
        processed_data = []
        for prop in raw_properties:
            try:
                processed_prop = self._process_single_property(prop)
                processed_data.append(processed_prop)
            except Exception as e:
                logger.warning(f"Failed to process property {prop}: {str(e)}")
        return processed_data

    def _process_single_property(self, prop: Dict):
        """Processes single property record"""
        pass