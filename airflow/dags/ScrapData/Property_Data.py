from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class PropertyData:
    #mieszkanie_id: int
    rozmiar: float
    pokoje: int
    ulica: str
    miasto: str
    kod_pocztowy: str
    wywolawcza: int
    nr_ksiegi_wieczystej: str
    wadium: int
    pietro: int
    termin_ogledzin: datetime
    piwnica: Optional[int]
    inne: Optional[str]
    nr_dzialki: Optional[str]
    prawo: Optional[str]
