## Recipe Platform – Frontend

This repository contains the frontend application for the Recipe Sharing Platform. The application is built with Vite and React and is responsible for rendering the user interface, handling client-side routing, and communicating with the backend API.

## Tech Stack

- Vite + React – Fast development and optimized builds
- TypeScript – Static typing for better maintainability
- React Router – Client-side routing
- Redux Toolkit – State management
- Tailwind CSS – Utility-first styling
- shadcn/ui – Accessible and reusable UI components
- Axios – HTTP client for API communication
- Lucide Icons – Modern, lightweight icon set

## Features

- Responsive and modern UI
- Recipe listing and detail views
- Integration with backend REST APIs
- Clean component-based architecture
- Environment-based configuration

## Environment Variables

Create a .env file in the root directory and add the following:

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

This variable defines the base URL for all backend API requests.

## Getting Started

1. Clone the Repository

   ```
   git clone https://github.com/SushantKumar29/recipe-platform-frontend.git
   cd recipe-platform-frontend
   ```

2. Install Dependencies

   ```
   npm install
   ```

3. Start the Development Server

   ```
   npm run dev
   ```

4. Test the Application

   ```
   npm run test
   ```

## Application URL

Once the server is running, the application will be available at:

```
http://localhost:5173
```

## Project Structure (Overview)

- src/ – Application source code
  - app/ – API, Redux store and hooks
  - components/ – Reusable UI components
  - lib/ – Utility functions
  - pages/ – Page-level components
  - slices/ – Redux thunks and slices
  - types/ – Type definitions

## Notes

Ensure the backend server is running before using the application.
Update VITE_API_BASE_URL if the backend URL changes.
This project uses modern ES modules and requires Node.js 18+ (recommended).
