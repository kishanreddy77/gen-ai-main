#!/bin/bash

##############################################
# Quick Setup Verification
##############################################

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Blueprint Generator - Setup Verification${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}\n"

ERRORS=0

# Check Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js: $(node -v)"
else
    echo -e "${RED}✗${NC} Node.js: Not installed"
    ((ERRORS++))
fi

# Check npm
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm: $(npm -v)"
else
    echo -e "${RED}✗${NC} npm: Not installed"
    ((ERRORS++))
fi

# Check start.sh
if [ -f "start.sh" ]; then
    if [ -x "start.sh" ]; then
        echo -e "${GREEN}✓${NC} start.sh: Exists and executable"
    else
        echo -e "${YELLOW}⚠${NC} start.sh: Exists but not executable (run: chmod +x start.sh)"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} start.sh: Missing"
    ((ERRORS++))
fi

# Check stop.sh
if [ -f "stop.sh" ]; then
    if [ -x "stop.sh" ]; then
        echo -e "${GREEN}✓${NC} stop.sh: Exists and executable"
    else
        echo -e "${YELLOW}⚠${NC} stop.sh: Exists but not executable (run: chmod +x stop.sh)"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} stop.sh: Missing"
    ((ERRORS++))
fi

# Check backend directory
if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC} backend/: Directory exists"

    if [ -f "backend/server.js" ]; then
        echo -e "${GREEN}✓${NC} backend/server.js: Exists"
    else
        echo -e "${RED}✗${NC} backend/server.js: Missing"
        ((ERRORS++))
    fi

    if [ -f "backend/package.json" ]; then
        echo -e "${GREEN}✓${NC} backend/package.json: Exists"
    else
        echo -e "${RED}✗${NC} backend/package.json: Missing"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} backend/: Directory missing"
    ((ERRORS++))
fi

# Check frontend directory
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓${NC} frontend/: Directory exists"

    if [ -f "frontend/index.html" ]; then
        echo -e "${GREEN}✓${NC} frontend/index.html: Exists"
    else
        echo -e "${RED}✗${NC} frontend/index.html: Missing"
        ((ERRORS++))
    fi

    if [ -f "frontend/app.js" ]; then
        echo -e "${GREEN}✓${NC} frontend/app.js: Exists"
    else
        echo -e "${RED}✗${NC} frontend/app.js: Missing"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} frontend/: Directory missing"
    ((ERRORS++))
fi

# Check ports
if command -v lsof &> /dev/null; then
    if lsof -ti:3000 &> /dev/null; then
        echo -e "${YELLOW}⚠${NC} Port 3000: In use (run ./stop.sh to clear)"
    else
        echo -e "${GREEN}✓${NC} Port 3000: Available"
    fi

    if lsof -ti:8080 &> /dev/null; then
        echo -e "${YELLOW}⚠${NC} Port 8080: In use (run ./stop.sh to clear)"
    else
        echo -e "${GREEN}✓${NC} Port 8080: Available"
    fi
fi

# Check npm cache permissions
NPM_CACHE_DIR=$(npm config get cache 2>/dev/null)
if [ -d "$NPM_CACHE_DIR" ]; then
    if touch "$NPM_CACHE_DIR/.test-write" 2>/dev/null; then
        rm -f "$NPM_CACHE_DIR/.test-write"
        echo -e "${GREEN}✓${NC} npm cache: Permissions OK"
    else
        echo -e "${YELLOW}⚠${NC} npm cache: Permission issues (start.sh will fix this)"
    fi
fi

echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to start.${NC}"
    echo -e "\n${GREEN}Run: ./start.sh${NC}"
else
    echo -e "${RED}✗ Found $ERRORS issue(s). Please fix them first.${NC}"
    exit 1
fi

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}\n"
