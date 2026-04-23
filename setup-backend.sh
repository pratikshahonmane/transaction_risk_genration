#!/bin/bash

################################################################################
# ValliGuard AI - Backend Setup & Launch Script
# 
# This script sets up and runs the FastAPI backend application
# Usage: ./setup-backend.sh [command]
# Commands: setup, start, train, clean
################################################################################

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/Backend" && pwd)"
PYTHON_VERSION_REQUIRED="3.8"
BACKEND_PORT="8000"
VENV_DIR="$BACKEND_DIR/venv"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        ValliGuard AI - Backend Setup & Launch              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

################################################################################
# Function: Check Prerequisites
################################################################################
check_prerequisites() {
    echo -e "\n${YELLOW}[1/4] Checking prerequisites...${NC}"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}✗ Python3 not found. Please install Python >= ${PYTHON_VERSION_REQUIRED}${NC}"
        echo -e "${YELLOW}  Download from: https://www.python.org/${NC}"
        exit 1
    fi
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓ Python ${PYTHON_VERSION} found${NC}"
    
    # Check pip
    if ! command -v pip3 &> /dev/null; then
        echo -e "${RED}✗ pip3 not found${NC}"
        exit 1
    fi
    PIP_VERSION=$(pip3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓ pip ${PIP_VERSION} found${NC}"
}

################################################################################
# Function: Create Virtual Environment
################################################################################
create_venv() {
    echo -e "\n${YELLOW}[2/4] Setting up Python virtual environment...${NC}"
    
    if [ ! -d "$VENV_DIR" ]; then
        echo -e "${YELLOW}  Creating virtual environment...${NC}"
        python3 -m venv "$VENV_DIR"
        echo -e "${GREEN}✓ Virtual environment created${NC}"
    else
        echo -e "${GREEN}✓ Virtual environment already exists${NC}"
    fi
    
    # Activate virtual environment
    source "$VENV_DIR/bin/activate"
    echo -e "${GREEN}✓ Virtual environment activated${NC}"
}

################################################################################
# Function: Setup Backend
################################################################################
setup_backend() {
    echo -e "\n${YELLOW}[3/4] Setting up backend...${NC}"
    
    if [ ! -d "$BACKEND_DIR" ]; then
        echo -e "${RED}✗ Backend directory not found at ${BACKEND_DIR}${NC}"
        exit 1
    fi
    
    cd "$BACKEND_DIR"
    
    # Create virtual environment
    create_venv
    
    # Upgrade pip
    echo -e "${YELLOW}  Upgrading pip...${NC}"
    pip install --upgrade pip
    echo -e "${GREEN}✓ pip upgraded${NC}"
    
    # Install requirements
    if [ -f "requirements.txt" ]; then
        echo -e "${YELLOW}  Installing dependencies...${NC}"
        pip install -r requirements.txt
        echo -e "${GREEN}✓ Dependencies installed${NC}"
    else
        echo -e "${YELLOW}  Installing core dependencies...${NC}"
        pip install fastapi uvicorn scikit-learn pandas numpy python-dotenv
        echo -e "${GREEN}✓ Core dependencies installed${NC}"
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}  Creating .env file...${NC}"
        cat > .env << EOF
# Backend Environment Variables
API_PORT=8000
API_HOST=0.0.0.0
DEBUG=True
ENVIRONMENT=development
MODEL_PATH=./model_output
EOF
        echo -e "${GREEN}✓ .env file created${NC}"
    else
        echo -e "${GREEN}✓ .env file already exists${NC}"
    fi
    
    # Create model output directory
    if [ ! -d "model_output" ]; then
        echo -e "${YELLOW}  Creating model output directory...${NC}"
        mkdir -p model_output
        echo -e "${GREEN}✓ Model output directory created${NC}"
    fi
}

################################################################################
# Function: Start API Server
################################################################################
start_api_server() {
    echo -e "\n${YELLOW}[4/4] Starting API server...${NC}"
    
    cd "$BACKEND_DIR"
    
    # Activate virtual environment
    source "$VENV_DIR/bin/activate"
    
    echo -e "\n${GREEN}✓ Starting FastAPI server on port ${BACKEND_PORT}...${NC}"
    echo -e "${BLUE}  API Documentation: http://localhost:${BACKEND_PORT}/docs${NC}"
    echo -e "${BLUE}  API ReDoc: http://localhost:${BACKEND_PORT}/redoc${NC}\n"
    
    # Check if main.py exists, otherwise use app.py or predict.py
    if [ -f "main.py" ]; then
        uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload
    elif [ -f "app.py" ]; then
        uvicorn app:app --host 0.0.0.0 --port $BACKEND_PORT --reload
    else
        echo -e "${RED}✗ No FastAPI app found (main.py or app.py)${NC}"
        exit 1
    fi
}

################################################################################
# Function: Train Model
################################################################################
train_model() {
    echo -e "\n${YELLOW}Training ML model...${NC}"
    
    cd "$BACKEND_DIR"
    
    # Activate virtual environment
    source "$VENV_DIR/bin/activate"
    
    if [ -f "train_model.py" ]; then
        echo -e "${YELLOW}  Running model training...${NC}"
        python3 train_model.py
        echo -e "${GREEN}✓ Model training completed${NC}"
    else
        echo -e "${RED}✗ train_model.py not found${NC}"
        exit 1
    fi
}

################################################################################
# Function: Clean Dependencies
################################################################################
clean_dependencies() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    
    if [ -d "$VENV_DIR" ]; then
        echo -e "${YELLOW}  Removing virtual environment...${NC}"
        rm -rf "$VENV_DIR"
        echo -e "${GREEN}✓ Virtual environment removed${NC}"
    fi
    
    if [ -d "$BACKEND_DIR/__pycache__" ]; then
        echo -e "${YELLOW}  Removing __pycache__...${NC}"
        find "$BACKEND_DIR" -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
        echo -e "${GREEN}✓ Cache files removed${NC}"
    fi
    
    echo -e "${GREEN}✓ Clean completed${NC}"
}

################################################################################
# Function: Display Usage
################################################################################
show_usage() {
    cat << EOF

${BLUE}Usage: ./setup-backend.sh [command]${NC}

${BLUE}Commands:${NC}
  setup       Setup backend (create venv, install dependencies)
  start       Start API server (default)
  train       Train machine learning model
  clean       Remove virtual environment and cache
  help        Show this help message

${BLUE}Examples:${NC}
  ./setup-backend.sh              # Setup + Start API server
  ./setup-backend.sh setup        # Only setup
  ./setup-backend.sh train        # Train the ML model
  ./setup-backend.sh clean        # Clean virtual environment

${BLUE}Environment:${NC}
  API Port: ${BACKEND_PORT}
  Backend Dir: ${BACKEND_DIR}
  Python Required: >= ${PYTHON_VERSION_REQUIRED}

${BLUE}API Endpoints:${NC}
  - POST /predict                 # Single transaction prediction
  - POST /predict/batch           # Batch predictions
  - GET  /health                  # Health check
  - GET  /model/info              # Model metadata
  - GET  /docs                    # Swagger UI
  - GET  /redoc                   # ReDoc UI

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
        setup_backend
        echo -e "\n${GREEN}✓ Backend setup completed successfully!${NC}"
        echo -e "${YELLOW}  Run './setup-backend.sh start' to start the API server${NC}"
        ;;
    start)
        check_prerequisites
        setup_backend
        start_api_server
        ;;
    train)
        check_prerequisites
        create_venv
        train_model
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
