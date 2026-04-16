# 🔌 Port Configuration

## Blueprint Generator Ports

- **Backend API**: `http://localhost:3000`
- **Frontend UI**: `http://localhost:8080`

## Why Port 8080?

Port 8000 conflicts with other projects (like unicraft).
Port 8080 is used to avoid conflicts.

## Quick Access

After running `./start.sh`, access:

- 🌐 **Main Application**: http://localhost:8080
- 🔌 **API Endpoint**: http://localhost:3000/api/generate-blueprint
- 🏥 **Health Check**: http://localhost:3000/api/health

## Changing Ports

If you need to use different ports, edit these files:

### Backend Port (default: 3000)
- File: `backend/server.js`
- Change: `const PORT = 3000;` to your preferred port

### Frontend Port (default: 8080)
- File: `start.sh`
- Find and replace all instances of `8080` with your preferred port

Don't forget to also update:
- `stop.sh` (port cleanup)
- `verify.sh` (port checks)
- `README.md` (documentation)
