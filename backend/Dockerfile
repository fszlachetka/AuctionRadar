FROM openjdk:17
LABEL maintainer="olgierd.zygmunt2003@gmail.com"

# Ustaw katalog roboczy
WORKDIR /app

# Najpierw kopiujemy plik z sumą kontrolną, żeby Docker wiedział, że JAR się zmienił
# Jeśli zmieni się zawartość jar-a, checksum też się zmieni i warstwa COPY zostanie odświeżona
ADD target/backend-1.0.1.jar backend.jar
RUN sha1sum backend.jar > backend.jar.sha1

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/backend.jar"]