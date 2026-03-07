#build
FROM maven:3.9-eclipse-temurin-21-alpine
WORKDIR /app

#copy pom.xml and then download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

#run
FROM eclipse-temurin-21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 1989

ENTRYPOINT ["java", "-jar", "app.jar"]
