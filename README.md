# TicTacToe Multiplayer Game

A modern multiplayer Tic-Tac-Toe game built with Next.js and Nakama server, featuring real-time gameplay and matchmaking.

---

## 🚀 Play the Game

👉 **[Click here to play now!](http://13.233.119.233:3000/)**

🔹 Live Demo: **http://13.233.119.233:3000/**  
Challenge your friends or get matched instantly with another player online!

---

## Features

- Real-time multiplayer gameplay
- Automatic matchmaking
- Turn-based gameplay with timer
- Beautiful UI with dark mode
- Responsive design for all devices

## Local Development Setup

### Prerequisites

- Node.js 16+ and pnpm (or npm/yarn)
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AlexshamalanR/lila-tictactoe.git
cd lila-tictactoe
```

### 2. Client Setup

```bash
# Navigate to client directory
cd client

# Copy environment file
cp .env.example .env.local

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The client will be available at `http://localhost:3000`

### 3. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the Nakama server using Docker
docker-compose up
```

The Nakama server will start with the following ports:

- Game Server API: `7350`
- gRPC API: `7349`
- Admin Console: `http://localhost:7351`

Default admin credentials (configurable in `/data/my-config.yml`):

- Username: `admin`
- Password: `password`

## Production Deployment

### Server Deployment

1. Prepare your server (Ubuntu/Debian recommended)

```bash
# Install Docker and Docker Compose
sudo apt update
sudo apt install docker.io docker-compose
```

2. Deploy Nakama Server

```bash
# Navigate to server directory
cd server

# Create and edit production configuration
cp data/my-config.yml data/production.yml
nano data/production.yml  # Edit configuration as needed

# Start server in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Client Deployment

1. Set up production environment

```bash
# Navigate to client directory
cd client

# Create and edit production environment
cp .env.example .env.production
nano .env.production  # Update with your production server details
```

2. Build and deploy

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

Alternatively, you can deploy the client to platforms like Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

## Playing the Game

1. Open the game in your browser
2. Click "Play Now" to start
3. Click "Find Match" to enter matchmaking
4. Wait for an opponent to join
5. Play your turn when highlighted
6. Game ends when someone wins or it's a draw

## Common Issues & Troubleshooting

### Server Issues

- Ensure Docker is running and ports 7349-7351 are available
- Check server logs: `docker-compose logs -f`
- Verify database connection in admin console

### Client Issues

- Clear browser cache if UI is not updating
- Check console for any connection errors
- Verify environment variables are set correctly

## License

This project is licensed under the MIT License - see the LICENSE file for details.
