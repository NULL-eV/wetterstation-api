# Wetterstation API

Einfache API für unsere Wetterstation.

## Inhalt

- [Installation](#installation)
- [Nutzung](#nutzung)
  - [Check Status](#check-status)
  - [HTTP Requests](#http-requests)

## Installation

```sh
# Klone das Projekt
git clone https://github.com/NULL-eV/wetterstation-api.git

# Kopiere und bearbeite .env
cp .env.example .env && nano .env

# Build und Starte Docker Container
docker compose up -d --build
```

## Nutzung

### Check Status

```sh
# Browser: http://localhost:<port>

curl http://localhost:<port>
```

### HTTP Requests

```sh
# GET
# Browser: http://localhost:<port>/api/data?api_key=<dein_api_key>

curl http://localhost:<port>/api/data -H "X-API-Key: <dein_api_key>"
```

```sh
# POST
curl -X POST http://localhost:<port>/api/data -H "X-API-Key: <dein_api_key>" -H "Content-Type: application/json" -d '{"temp": 22.5, "humd": 69.0}'
```
