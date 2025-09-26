urls = {
    "https://lodz.sr.gov.pl/ogloszenia-komornicze": [["kancelaria"], ("licytacj",)],
}

prompt_template = """
Wyciągnij najważniejsze dane z ogłoszenia o licytacji. Wypisz tylko dane. Odpowiedz tylko kodem Python dict z następującymi kluczami. Jeśli jakiejś danej nie ma w ogłoszeniu, wpisz None.
Jeśli nie jest to ogłoszenie o licytacji nieruchomości, zwróć wszystkie pola jako None.
- rozmiar (w metrach kwadratowych(nie wliczajac piwnicy), float)
- pokoje (int)
- ulica (string, bez poczatku "ul." lub "ulica")
- miasto (string)
- kod_pocztowy (string)
- cena (cena wywoławcza w PLN, int, zaokrąglij w dół do pełnych złotych)
- nr_ksiegi_wieczystej (string, sam numer księgi wieczystej, bez przedrostka)
- wadium (int)
- pietro (int)
- termin_ogledzin (string, format: dd-mm-yyyy, termin licytacji)
- piwnica (bool)
- inne (string, dodatkowe informacje, jeśli są dostępne, w przeciwnym razie null)
- nr_dzialki (string)
- prawo (string)
"""