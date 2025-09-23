### JAK TO W OGÓLE ODPALIC

Żeby odpalić całość robimy

```
mvn clean package
docker compose up --build -d
```

No ale jak pracujemy tylko nad jednym komponentem to często to nie ma sensu, można odpalać aplikacje pojedyńczo za pomocą:

```
docker compose up <nazwa aplikacji> -d
```

czyli na przykład

``` 
docker compose up frontend -d
```
żeby wyłączyć robimy:
``` 
docker compose down
```

1. Ważne żeby zainstalować sobie dockerową wytyczkę do Intellij/pycharm bo to ma mega wygodne funkcjonalnosci
2. Czasami może być tak, że mimo zmian w kodzie itp docker odpala stary obraz. Wtedy trzeba wyłączyć kontenery, usunąć stare obrazy  i włączyć na nowo
