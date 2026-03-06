#build
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
#cache dependencies as a separate layer
RUN mvn dependency:go-offline dependency:resolve-plugins -B
COPY src ./src
RUN mvn clean package -DskipTests

#runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]
