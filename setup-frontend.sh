#!/bin/bash

################################################################################
# ValliGuard AI - Frontend Setup & Launch Script
# 
# This script sets up and runs the React frontend application
# Usage: ./setup-frontend.sh [command]
# Commands: setup, start, build, clean
################################################################################

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/Frontend" && pwd)"
NODE_VERSION_REQUIRED="18.0.0"
NPM_VERSION_REQUIRED="9.0.0"
FRONTEND_PORT="3000"
BACKEND_URL="http://localhost:8000"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        ValliGuard AI - Frontend Setup & Launch            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

################################################################################
# Function: Check Prerequisites
################################################################################
check_prerequisites() {
    echo -e "\n${YELLOW}[1/5] Checking prerequisites...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js not found. Please install Node.js >= ${NODE_VERSION_REQUIRED}${NC}"
        echo -e "${YELLOW}  Download from: https://nodejs.org/${NC}"
        exit 1
    fi
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}✗ npm not found. Please install npm >= ${NPM_VERSION_REQUIRED}${NC}"
        exit 1
    fi
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"
}

################################################################################
# Function: Setup Frontend
################################################################################
setup_frontend() {
    echo -e "\n${YELLOW}[2/5] Setting up frontend...${NC}"
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        echo -e "${RED}✗ Frontend directory not found at ${FRONTEND_DIR}${NC}"
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}  Installing dependencies...${NC}"
        npm install
        echo -e "${GREEN}✓ Dependencies installed${NC}"
    else
        echo -e "${GREEN}✓ Dependencies already installed${NC}"
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}  Creating .env file...${NC}"
        cat > .env << EOF
# Frontend Environment Variables
REACT_APP_API_BASE_URL=${BACKEND_URL}
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=false
EOF
        echo -e "${GREEN}✓ .env file created${NC}"
    else
        echo -e "${GREEN}✓ .env file already exists${NC}"
    fi
}

################################################################################
# Function: Start Development Server
################################################################################
start_dev_server() {
    echo -e "\n${YELLOW}[3/5] Starting development server...${NC}"
    
    cd "$FRONTEND_DIR"
    
    echo -e "${YELLOW}  Checking backend connection...${NC}"
    if ! curl -s "${BACKEND_URL}/health" > /dev/null 2>&1; then
        echo -e "${RED}⚠ Warning: Backend not responding at ${BACKEND_URL}${NC}"
        echo -e "${YELLOW}  Make sure backend is running on port 8000${NC}"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✓ Backend is running${NC}"
    fi
    
    echo -e "\n${GREEN}✓ Starting React development server on port ${FRONTEND_PORT}...${NC}"
    echo -e "${BLUE}  Open http://localhost:${FRONTEND_PORT} in your browser${NC}\n"
    
    npm start
}

################################################################################
# Function: Build Production
################################################################################
build_production() {
    echo -e "\n${YELLOW}[3/5] Building production bundle...${NC}"
    
    cd "$FRONTEND_DIR"
    
    echo -e "${YELLOW}  Creating optimized build...${NC}"
    npm run build
    
    echo -e "\n${GREEN}✓ Production build created in dist/${NC}"
    echo -e "${BLUE}  Build statistics:${NC}"
    du -sh dist/
}

################################################################################
# Function: Clean Dependencies
################################################################################
clean_dependencies() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    
    cd "$FRONTEND_DIR"
    
    if [ -d "node_modules" ]; then
        echo -e "${YELLOW}  Removing node_modules...${NC}"
        rm -rf node_modules
        echo -e "${GREEN}✓ Removed node_modules${NC}"
    fi
    
    if [ -f "package-lock.json" ]; then
        echo -e "${YELLOW}  Removing package-lock.json...${NC}"
        rm -f package-lock.json
        echo -e "${GREEN}✓ Removed package-lock.json${NC}"
    fi
    
    echo -e "${GREEN}✓ Clean completed${NC}"
}

################################################################################
# Function: Display Usage
################################################################################
show_usage() {
    cat << EOF

${BLUE}Usage: ./setup-frontend.sh [command]${NC}

${BLUE}Commands:${NC}
  setup       Setup frontend (install dependencies, create .env)
  start       Start development server (default)
  build       Build production bundle
  clean       Remove node_modules and package-lock.json
  help        Show this help message

${BLUE}Examples:${NC}
  ./setup-frontend.sh              # Setup + Start dev server
  ./setup-frontend.sh setup        # Only setup
  ./setup-frontend.sh build        # Build for production
  ./setup-frontend.sh clean        # Clean dependencies

${BLUE}Environment:${NC}
  Frontend Port: ${FRONTEND_PORT}
  Backend URL: ${BACKEND_URL}
  Frontend Dir: ${FRONTEND_DIR}

EOF
}

################################################################################
# Main Script
################################################################################

# Determine command
COMMAND=${1:-"start"}

case "$COMMAND" in
    setup)
        check_prerequisites
        setup_frontend
        echo -e "\n${GREEN}✓ Frontend setup completed successfully!${NC}"
        echo -e "${YELLOW}  Run './setup-frontend.sh start' to start the development server${NC}"
        ;;
    start)
        check_prerequisites
        setup_frontend
        start_dev_server
        ;;
    build)
        check_prerequisites
        setup_frontend
        build_production
        ;;
    clean)
        clean_dependencies
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        show_usage
        exit 1
        ;;
esac

echo -e "\n${GREEN}✓ All tasks completed successfully!${NC}\n"
