#!/bin/bash

##############################################
# Automated Software Project Blueprint Generator
# Startup Script
##############################################

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Automated Software Project Blueprint Generator      ║"
echo "║                   Startup Script                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"

# Check and fix npm cache permissions
echo -e "\n${YELLOW}Checking npm cache permissions...${NC}"
NPM_CACHE_DIR=$(npm config get cache)

# Function to fix npm permissions
fix_npm_permissions() {
    echo -e "${YELLOW}⚠ npm cache has permission issues${NC}"
    echo -e "${BLUE}Fixing permissions with sudo...${NC}"
    echo -e "${BLUE}Running: sudo chown -R $(whoami) \"$NPM_CACHE_DIR\"${NC}"
    echo ""

    if sudo chown -R $(whoami) "$NPM_CACHE_DIR"; then
        echo -e "${GREEN}✓ npm cache permissions fixed${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to fix npm cache permissions${NC}"
        echo -e "${YELLOW}Please run manually: sudo chown -R \$(whoami) \"$NPM_CACHE_DIR\"${NC}"
        return 1
    fi
}

# Test npm cache by doing a verify (lightweight check)
if npm cache verify 2>&1 | grep -q "EACCES\|permission denied\|Permission denied"; then
    fix_npm_permissions || exit 1
else
    # Check if cache directory exists and has root-owned files
    if [ -d "$NPM_CACHE_DIR" ]; then
        ROOT_FILES=$(find "$NPM_CACHE_DIR" -user root 2>/dev/null | head -1)
        if [ ! -z "$ROOT_FILES" ]; then
            echo -e "${YELLOW}⚠ Found root-owned files in npm cache${NC}"
            fix_npm_permissions || exit 1
        else
            echo -e "${GREEN}✓ npm cache permissions OK${NC}"
        fi
    fi
fi

# Navigate to backend directory and install dependencies
echo -e "\n${YELLOW}[2/5] Setting up backend dependencies...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"

    if npm install; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        echo -e "${YELLOW}Common fixes:${NC}"
        echo -e "${YELLOW}  1. Run: sudo chown -R \$(whoami) ~/.npm${NC}"
        echo -e "${YELLOW}  2. Run: npm cache clean --force${NC}"
        echo -e "${YELLOW}  3. Delete node_modules and try again${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Start backend server in background
echo -e "\n${YELLOW}[3/5] Starting backend server...${NC}"
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend server started (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}  Running on http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Failed to start backend server${NC}"
    exit 1
fi

# Navigate to frontend directory
cd ../frontend

# Check if Python is available (for simple HTTP server)
echo -e "\n${YELLOW}[4/5] Starting frontend server...${NC}"

if command -v python3 &> /dev/null; then
    echo -e "${BLUE}Using Python 3 HTTP server...${NC}"
    python3 -m http.server 8080 &
    FRONTEND_PID=$!
    FRONTEND_CMD="python3"
elif command -v python &> /dev/null; then
    echo -e "${BLUE}Using Python HTTP server...${NC}"
    python -m http.server 8080 &
    FRONTEND_PID=$!
    FRONTEND_CMD="python"
else
    echo -e "${YELLOW}⚠ Python not found. Trying Node.js http-server...${NC}"

    # Check if http-server is installed globally
    if ! command -v http-server &> /dev/null; then
        echo -e "${BLUE}Installing http-server globally...${NC}"
        npm install -g http-server
    fi

    http-server -p 8080 &
    FRONTEND_PID=$!
    FRONTEND_CMD="http-server"
fi

# Wait for frontend to start
sleep 2

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Frontend server started (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}  Running on http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Failed to start frontend server${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Save PIDs to file for cleanup
cd ..
echo "$BACKEND_PID" > .server.pid
echo "$FRONTEND_PID" >> .server.pid

# Success message
echo -e "\n${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Application started successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"

echo -e "\n${BLUE}[5/5] Access your application:${NC}"
echo -e ""
echo -e "  ${GREEN}🌐 Frontend:${NC} http://localhost:8080"
echo -e "  ${GREEN}🔌 Backend API:${NC} http://localhost:3000"
echo -e "  ${GREEN}🏥 Health Check:${NC} http://localhost:3000/api/health"
echo -e ""

# Auto-open browser (optional)
echo -e "${YELLOW}Opening browser in 3 seconds...${NC}"
sleep 3

# Open browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:8080"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:8080" 2>/dev/null
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    start "http://localhost:8080"
fi

echo -e ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo -e "${YELLOW}Or run: ./stop.sh${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e ""

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"

    if [ -f .server.pid ]; then
        while read pid; do
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${BLUE}Stopping process $pid...${NC}"
                kill $pid 2>/dev/null
            fi
        done < .server.pid
        rm .server.pid
    fi

    # Also kill by port (backup method)
    if command -v lsof &> /dev/null; then
        lsof -ti:3000 | xargs kill -9 2>/dev/null
        lsof -ti:8080 | xargs kill -9 2>/dev/null
    fi

    echo -e "${GREEN}✓ All servers stopped${NC}"
    echo -e "${BLUE}Thank you for using Blueprint Generator!${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

# Keep script running and monitor servers
while true; do
    # Check if backend is still running
    if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${RED}⚠ Backend server stopped unexpectedly!${NC}"
        cleanup
    fi

    # Check if frontend is still running
    if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${RED}⚠ Frontend server stopped unexpectedly!${NC}"
        cleanup
    fi

    sleep 5
done
