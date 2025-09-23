urls = {
    "https://lodz.sr.gov.pl/ogloszenia-komornicze": [["kancelaria"], ("licytacj",)],
}

prompt_template = """
Wyciągnij najważniejsze dane z ogłoszenia o licytacji. Wypisz tylko dane. Odpowiedz tylko kodem Python dict z następującymi kluczami. Jeśli jakiejś danej nie ma w ogłoszeniu, wpisz None.
- rozmiar (w metrach kwadratowych, float)
- pokoje (int)
- ulica (string)
- miasto (string)
- kod pocztowy (string)
- wywolawcza (cena wywoławcza w PLN, float)
- nr_ksiegi_wieczystej (string)
- wadium (int)
- pietro (int)
- termin ogledzin (string, format: dd-mm-yyyy)
- piwnica (bool)
- inne (string, dodatkowe informacje, jeśli są dostępne, w przeciwnym razie null)
- nr_dzialki (string)
- prawo (string)
"""