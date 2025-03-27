# Where's Waldo Clone

A full-stack web application that recreates the classic "Where's Waldo" (or "Where's Wally") photo-tagging game experience. Players search for hidden characters within detailed images, with time tracking and leaderboards to compete for the fastest completion times.

## Features

- **Interactive Photo Tagging**: Click anywhere in the image to identify hidden characters
- **Zoom & Pan Controls**: Navigate large, detailed images with intuitive zoom and pan controls
- **Real-time Validation**: Instant feedback on character identification attempts
- **Time Tracking**: Server-side timing for accurate scoring
- **Leaderboards**: See how your times compare with other players
- **Responsive Design**: Retro-styled interface that works across devices
- **Session Management**: Heartbeat system maintains your game session

## Tech Stack

### Frontend
- **React**: UI library for building the game interface
- **Vite**: Fast build tooling for modern web development
- **Custom Hooks**: Specialized hooks for image interaction, transformation, and session management

### Backend
- **Node.js/Express**: Server for REST API endpoints
- **PostgreSQL/Prisma**: Database and ORM for data management
- **Express Validator**: Input validation for secure API endpoints
- **Express Session**: Session management for tracking game state

## Project Structure

The project is divided into two main parts:

### Frontend (`frontend-waldo/`)
Contains the React application that presents the user interface and game mechanics.

```
frontend-waldo/
├── src/
│   ├── components/     # UI components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API communication
│   └── assets/         # Images and game resources
```

### Backend (`backend-waldo/`)
Handles game logic, validation, timing, and database interactions.

```
backend-waldo/
├── controllers/        # Request handlers
├── prisma/             # Database schema and queries
├── routes/             # API routing
├── middleware/         # Request processing
├── utils/              # Helper functions
└── public/             # Static assets
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/waldo-game.git
cd waldo-game
```

2. Set up the backend:
```bash
cd backend-waldo
npm install
```

3. Configure your database:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and update the database connection string
   - Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Start the backend server:
```bash
npm start
```

5. Set up the frontend:
```bash
cd ../frontend-waldo
npm install
```

6. Start the frontend development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. Enter your username on the starting screen
2. Select a level from the available options
3. The timer starts automatically when the level loads
4. Click on the image where you think a character is hidden
5. Select the character from the dropdown menu
6. If correct, the character will be marked as found
7. Find all characters to complete the level
8. Your time will be recorded and displayed on the leaderboard

## Game Mechanics

- **Character Selection**: When you click on the image, a selection box appears. Choose a character from the dropdown menu.
- **Validation**: The server validates if the selected character is within the clicked area.
- **Navigation**: Use zoom buttons or drag the image to explore detailed scenes.
- **Timing**: Your time is tracked from the moment the level loads until all characters are found.

## Development

### Adding New Levels

To add new levels to the game:

1. Add the image file to `backend-waldo/public/images/levels/`
2. Use the database admin tools or create a migration to add the level data
3. Define character locations using x, y coordinates and width/height values

### Environment Variables

The backend requires the following environment variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/waldodb
SESSION_SECRET=your-session-secret-key
NODE_ENV=development
```

## Acknowledgements

- This project was created as part of The Odin Project curriculum.
- Special thanks to Martin Handford, the creator of the original "Where's Wally/Waldo" books.