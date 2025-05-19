FROM openjdk:17
LABEL maintainer="olgierd.zygmunt2003@gmail.com"
VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=target/backend-1.0.0.jar
ADD ${JAR_FILE} app.jar
COPY target/*.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]