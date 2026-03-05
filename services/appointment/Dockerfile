ARG TZ=America/Lima

FROM eclipse-temurin:25-jdk-ubi10-minimal AS build

ARG TZ

ENV TZ=${TZ}

# Workspace packages
WORKDIR /app

# Maven and dependencies
COPY .mvn/ .mvn/
COPY --chmod=0755 mvnw ./

COPY pom.xml ./
COPY shared/java/pom.xml ./shared/java/pom.xml
COPY services/appointment/pom.xml ./services/appointment/pom.xml
COPY services/ehr/pom.xml ./services/ehr/pom.xml
COPY services/insurance/pom.xml ./services/insurance/pom.xml

RUN ./mvnw -B dependency:go-offline

# Build
COPY shared/java/src shared/java/src
COPY services/appointment/src services/appointment/src

RUN ./mvnw -pl services/appointment -am package -DskipTests -B


FROM gcr.io/distroless/java25 AS runtime

# Add wget for ready endpoint healthcheck
COPY --from=busybox /lib/* /lib/
COPY --from=busybox /lib64/* /lib64/
COPY --from=busybox /bin/wget /bin/

WORKDIR /app

ARG TZ

ENV TZ=${TZ}

COPY --chown=185 --from=build /app/services/appointment/target/quarkus-app/lib/ lib/
COPY --chown=185 --from=build /app/services/appointment/target/quarkus-app/*.jar .
COPY --chown=185 --from=build /app/services/appointment/target/quarkus-app/app/ app/
COPY --chown=185 --from=build /app/services/appointment/target/quarkus-app/quarkus/ quarkus/

EXPOSE 8080
USER 185

ENTRYPOINT [ "java", "-XX:AOTCache=app.aot", "-jar", "quarkus-run.jar", "-Dquarkus.http.host=0.0.0.0", "-Djava.util.logging.manager=org.jboss.logmanager.LogManager", "-XX:+UnlockExperimentalVMOptions", "-XX:+EnableJVMCI"]

HEALTHCHECK --interval=120s --timeout=5s --start-period=5s \
    CMD ["/bin/wget", "--spider", "--timeout=5", "http://localhost:8080/_health"]
