# TrackWise Environment Variables Reference

Complete reference matrix of environment variables required for running and deploying TrackWise.

---

## 1. Frontend Environment Variables

| Variable Name | Description | Default (Dev) | Production Value | Required? |
| --- | --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Base REST API URL prefix | `http://localhost:8080/api/v1` | `/api/v1` or `https://backend.domain/api/v1` | **Yes** |
| `VITE_APP_NAME` | Application display title | `TrackWise` | `TrackWise` | No |
| `VITE_DEFAULT_CURRENCY` | Default currency ISO code | `INR` | `INR` | No |
| `VITE_ENABLE_ANALYTICS` | Enable client-side telemetry | `false` | `true` | No |

---

## 2. Backend Environment Variables

| Variable Name | Description | Default (Dev) | Production Target | Required in Prod? |
| --- | --- | --- | --- | --- |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile (`dev`, `prod`, `postgres`) | `dev` | `prod` | **Yes** |
| `SERVER_PORT` | HTTP server listening port | `8080` | `8080` or `$PORT` | No |
| `DB_URL` | PostgreSQL JDBC Connection URL | `jdbc:h2:mem:trackwisedb` | `jdbc:postgresql://host:5432/dbname` | **Yes (in prod)** |
| `DB_USERNAME` | Database username | `sa` | `trackwise_user` | **Yes (in prod)** |
| `DB_PASSWORD` | Database password | `""` | `<secret_password>` | **Yes (in prod)** |
| `DB_POOL_SIZE` | HikariCP max connection pool size | `10` | `10` to `20` | No |
| `JWT_SECRET` | 64-character secret key for JWT signing | *Dev default key* | `<secure_random_hex_string>` | **Yes (in prod)** |
| `JWT_EXPIRATION_MS` | JWT validity duration in milliseconds | `86400000` (24h) | `86400000` | No |

---

## 3. Generating a Secure JWT Secret

Run the following OpenSSL command in terminal to generate a 64-character hex key:

```bash
openssl rand -hex 32
```
