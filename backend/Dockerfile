# ─────────────────────────────────────────────────────────────────────────────
# TrackWise Backend — Multi-Stage Production Dockerfile
# Stage 1: Build Spring Boot JAR with Maven & OpenJDK 21
# Stage 2: Minimal Runtime with Eclipse Temurin Java 21 JRE Alpine
# ─────────────────────────────────────────────────────────────────────────────

# --- STAGE 1: Build Phase ---
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy Maven wrapper & pom.xml first to optimize layer caching
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Download dependencies in offline mode
RUN ./mvnw dependency:go-offline -B || true

# Copy backend source code
COPY src src

# Package production executable JAR without running tests (tests run in CI)
RUN ./mvnw clean package -DskipTests

# --- STAGE 2: Runtime Phase ---
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Add non-root system user for security
RUN addgroup -S trackwise && adduser -S trackwise -G trackwise

# Copy compiled JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Set container ownership
RUN chown -R trackwise:trackwise /app

# Switch to non-root user
USER trackwise

# Default environment variables
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080

EXPOSE 8080

# Spring Boot actuator healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Execute application
ENTRYPOINT ["java", "-jar", "-Djava.security.egd=file:/dev/./urandom", "app.jar"]
