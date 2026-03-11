# VPS Deployment Guide

## Prerequisites

- Docker and Docker Compose installed on your VPS
- GitHub repo with this code
- `.env` file with your production values (never commit real `.env`; use `.env.example` as reference)

## 1. Push to GitHub

```bash
git add .
git commit -m "Add Docker setup for deployment"
git push origin main
```

## 2. On the VPS

### Install Docker (if not already)

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker && sudo systemctl start docker
```

### Clone and configure

```bash
git clone https://github.com/YOUR_USERNAME/iexportbackend.git
cd iexportbackend
```

Create `.env` from the example and fill in production values:

```bash
cp .env.example .env
nano .env   # or vim / your editor
```

**Important:** Set `BASE_URL` to your VPS URL (e.g. `https://api.yourdomain.com`) and keep `MONGO_URI`, `JWT_SECRET`, etc. for production.

### Build and run

```bash
docker compose build
docker compose up -d
```

### Check logs

```bash
docker compose logs -f app
```

### Stop

```bash
docker compose down
```

## 3. Updates (after code changes)

```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```

## 4. Optional: Run MongoDB on the VPS

To use MongoDB in Docker instead of Atlas:

1. In `docker-compose.yml`, uncomment the `mongo` service and `mongo_data` volume.
2. Uncomment `depends_on: - mongo` under the `app` service.
3. In `.env`, set:
   ```env
   MONGO_URI=mongodb://mongo:27017/iexport
   ```
4. Run: `docker compose up -d`

## 5. Reverse proxy (Nginx) and HTTPS

Expose the app behind Nginx and use Let's Encrypt for HTTPS. Example Nginx config:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:5020;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then use certbot: `sudo certbot --nginx -d api.yourdomain.com`.
