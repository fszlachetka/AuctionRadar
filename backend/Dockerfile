FROM openjdk:17
LABEL maintainer="olgierd.zygmunt2003@gmail.com"

WORKDIR /app

ADD target/backend-1.0.1.jar backend.jar
RUN sha1sum backend.jar > backend.jar.sha1

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/backend.jar"]