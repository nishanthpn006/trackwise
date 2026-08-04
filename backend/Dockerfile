# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build the fat JAR
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /workspace

# Cache the Maven wrapper and dependencies before copying source
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./

RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B -q

# Copy source and build (tests run in CI; skip here to keep Docker builds fast)
COPY src/ src/
RUN ./mvnw package -DskipTests -B -q

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Minimal JRE runtime image
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

LABEL org.opencontainers.image.title="TrackWise Backend" \
      org.opencontainers.image.description="Personal Expense Tracker — Spring Boot 3 API" \
      org.opencontainers.image.source="https://github.com/nishanthpn006/trackwise"

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only the fat JAR from the build stage
COPY --from=builder /workspace/target/*.jar app.jar

# Transfer ownership to the non-root user
RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8080

# Health check — waits 30 s then checks every 10 s; 3 retries before unhealthy
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
