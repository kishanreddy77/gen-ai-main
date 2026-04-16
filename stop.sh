#!/bin/bash

##############################################
# Automated Software Project Blueprint Generator
# Stop Script
##############################################

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║          Stopping Blueprint Generator...              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if PID file exists
if [ -f .server.pid ]; then
    echo -e "${YELLOW}Stopping servers from PID file...${NC}"

    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${BLUE}Stopping process $pid...${NC}"
            kill $pid 2>/dev/null
            sleep 1

            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${YELLOW}Force stopping process $pid...${NC}"
                kill -9 $pid 2>/dev/null
            fi
        else
            echo -e "${YELLOW}Process $pid already stopped${NC}"
        fi
    done < .server.pid

    rm .server.pid
    echo -e "${GREEN}✓ PID file cleaned up${NC}"
else
    echo -e "${YELLOW}No PID file found${NC}"
fi

# Kill processes by port (backup method)
echo -e "\n${YELLOW}Checking for processes on ports 3000 and 8080...${NC}"

if command -v lsof &> /dev/null; then
    # Kill backend (port 3000)
    BACKEND_PIDS=$(lsof -ti:3000 2>/dev/null)
    if [ ! -z "$BACKEND_PIDS" ]; then
        echo -e "${BLUE}Killing backend process(es) on port 3000...${NC}"
        echo "$BACKEND_PIDS" | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✓ Backend stopped${NC}"
    else
        echo -e "${GREEN}✓ No backend process found on port 3000${NC}"
    fi

    # Kill frontend (port 8080)
    FRONTEND_PIDS=$(lsof -ti:8080 2>/dev/null)
    if [ ! -z "$FRONTEND_PIDS" ]; then
        echo -e "${BLUE}Killing frontend process(es) on port 8080...${NC}"
        echo "$FRONTEND_PIDS" | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    else
        echo -e "${GREEN}✓ No frontend process found on port 8080${NC}"
    fi
elif command -v netstat &> /dev/null; then
    echo -e "${YELLOW}Using netstat to find processes...${NC}"
    # Alternative method using netstat (for systems without lsof)
    pkill -f "node server.js" 2>/dev/null
    pkill -f "http.server" 2>/dev/null
    pkill -f "http-server" 2>/dev/null
    echo -e "${GREEN}✓ Attempted to stop all related processes${NC}"
else
    echo -e "${YELLOW}⚠ Cannot verify port status (lsof/netstat not available)${NC}"
    echo -e "${YELLOW}Attempting to kill by process name...${NC}"
    pkill -f "node server.js" 2>/dev/null
    pkill -f "http.server" 2>/dev/null
    pkill -f "http-server" 2>/dev/null
fi

echo -e "\n${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All servers stopped successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e ""
echo -e "${BLUE}To start again, run: ./start.sh${NC}"
echo -e ""
