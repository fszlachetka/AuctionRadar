# plugins/property_scraper/models.py
from dataclasses import dataclass
from typing import Optional

@dataclass
class PropertyData:
    rozmiar: str
    pokoje: str
    ulica: str
    miasto: str
    nr_ksiegi_wieczystej: str
    wadium: str
    pietro: str
    piwnica: str
    prawo: str
    nr_dzialki: str
    termin_ogledzin: str
    inne: str
