# Simple Input App

A full-stack web application that allows users to submit text inputs and view a list of all submissions.

## Technologies Used

- **Backend**: Node.js with Hono.js
- **Frontend**: React with Vite
- **API Layer**: tRPC for type-safe API calls
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Container**: Docker for PostgreSQL database

## Features

- Type-safe backend and frontend communication using tRPC
- Input validation (non-empty, max 255 characters)
- Clean and modern UI
- Real-time updates of the submissions list
- Environment-based configuration
- Docker containerized database for easy setup

## Project Structure

```
simple-input-app/
├── packages/
│   ├── client/         # React frontend
│   │   ├── .env        # Development environment variables
│   │   └── .env.production # Production environment variables
│   ├── server/         # Node.js backend
│   │   └── .env        # Server environment variables
│   └── shared/         # Shared types and utilities
├── docker-compose.yml  # Docker setup for PostgreSQL
└── README.md
```

## Environment Variables

### Client (.env, .env.production)

- `VITE_API_URL`: The URL of the tRPC API endpoint

### Server (.env)

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: The port the server will listen on (default: 3001)
- `HOST`: The host address to bind to (default: 0.0.0.0)

## Getting Started

### Prerequisites

- Node.js (v16+)
- Docker and Docker Compose (for running PostgreSQL)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd simple-input-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the PostgreSQL database with Docker:

   ```
   npm run db:up
   ```

4. Run Prisma migrations:

   ```
   npm run prisma:migrate
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Quick Setup (Database + Migrations + Start App)

For a one-command setup:

```
npm run db:setup && npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Enter text in the input field and click "Submit".
3. Your submission will be saved in the database and displayed in the list below.

## Deployment

For production deployment:

1. Build the application:

   ```
   npm run build
   ```

2. Set up the environment variables for production

   ```
   # In server environment
   export DATABASE_URL="your-production-db"
   export PORT=3001
   export HOST=0.0.0.0

   # In client build
   # Create/update .env.production with VITE_API_URL
   ```

3. Start the production server:
   ```
   npm run start
   ```

## Docker Commands

- Start the database: `npm run db:up`
- Stop the database: `npm run db:down`
- Reset and setup the database: `npm run db:setup`

## License

This project is licensed under the ISC License.
