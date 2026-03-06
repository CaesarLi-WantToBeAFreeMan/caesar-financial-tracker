FROM maven:3.9-eclipse-temurin-21-alpine
WORKDIR /app
COPY pom.xml .
COPY src ./src
EXPOSE 10000
ENTRYPOINT ["mvn", "clean", "compile", "spring-boot:run"]
