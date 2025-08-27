#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AI Eye Clinic 问诊系统启动脚本 ===${NC}"
echo ""

# Get the local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)

if [ -z "$LOCAL_IP" ]; then
    # Alternative method for getting IP
    LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null)
fi

if [ -z "$LOCAL_IP" ]; then
    # Fallback method
    LOCAL_IP=$(ip route get 1 | awk '{print $7; exit}' 2>/dev/null)
fi

echo -e "${GREEN}检测到本机IP地址: $LOCAL_IP${NC}"
echo ""

echo -e "${YELLOW}启动说明:${NC}"
echo "1. 后端服务器将在 http://$LOCAL_IP:8001 运行"
echo "2. 前端开发服务器将在 http://$LOCAL_IP:3001 运行"
echo "3. 内网中的其他设备可以通过以下地址访问:"
echo -e "   ${GREEN}http://$LOCAL_IP:3001${NC}"
echo ""

echo -e "${BLUE}正在启动后端服务器...${NC}"
cd backend
python3 main.py &
BACKEND_PID=$!

sleep 3

echo -e "${BLUE}正在启动前端开发服务器...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}服务器启动完成！${NC}"
echo ""
echo -e "${YELLOW}访问地址:${NC}"
echo "• 本机访问: http://localhost:3001"
echo "• 内网其他设备访问: http://$LOCAL_IP:3001"
echo ""
echo -e "${YELLOW}停止服务器:${NC}"
echo "按 Ctrl+C 停止所有服务器"

# Function to clean up background processes
cleanup() {
    echo ""
    echo -e "${YELLOW}正在停止服务器...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait
