import pandas as pd
import logging
from typing import List, Dict
from Property_Data import PropertyData

logger = logging.getLogger(__name__)

class PropertyScraper:

    def scrape_properties(self) -> List[Dict]:
        """Main method to scrape property data"""
        try:
            raw_data = self._fetch_raw_data()
            return self._transform_data(raw_data)
        except Exception as e:
            logger.error(f"Scraping failed: {str(e)}")
            raise

    def _fetch_raw_data(self):
        """Private method to fetch raw data"""
        pass

    def _transform_data(self, raw_data) -> List[PropertyData]:
        """
        Transforms raw data into structured PropertyData objects

        Args:
            raw_data: Property as dictionary
        """
        transformed_data = []

        for record in raw_data:
            try:
                required_fields = ['rozmiar', 'pokoje', 'ulica', 'miasto',
                                   'nr_ksiegi_wieczystej', 'wadium', 'termin_ogledzin']
                if not all(field in record for field in required_fields):
                    raise ValueError("Missing required fields in raw data")

                # Create PropertyData object
                property_data = PropertyData(
                    rozmiar=record['rozmiar'],
                    pokoje=record['pokoje'],
                    ulica=record['ulica'],
                    miasto=record.get('miasto', ''),
                    nr_ksiegi_wieczystej=record['nr_ksiegi_wieczystej'],
                    wadium=record['wadium'],
                    pietro=record.get('pietro', ''),
                    piwnica=record.get('piwnica', ''),
                    prawo=record.get('prawo', ''),
                    nr_dzialki=record.get('nr_dzialki', ''),
                    termin_ogledzin=record.get('termin_ogledzin', ''),
                    inne=record.get('inne', '')
                )
                transformed_data.append(property_data)

            except Exception as e:
                self.logger.warning(f"Skipping invalid record: {record}. Error: {str(e)}")
                continue

        return transformed_data

    def _print_records_debug(self, records: List[PropertyData]) -> None:
        """Temporary debug method to print formatted records"""
        if not records:
            logger.info("No records to display")
            return

        logger.info("=== DEBUG: SCRAPED PROPERTIES ===")
        for i, record in enumerate(records, 1):
            logger.info(f"\nPROPERTY #{i}:\n{format(vars(record))}")
        logger.info(f"=== TOTAL: {len(records)} RECORDS ===")