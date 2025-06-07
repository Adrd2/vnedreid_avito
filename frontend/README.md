# AutoCheck AI

AutoCheck AI is a web application that allows users to automatically evaluate car damages from photos using AI. The application provides a detailed analysis of the car damages and estimates repair costs.

## Features

- Upload car photos from different angles
- AI-powered damage detection
- Detailed damage reports with highlighted areas
- Repair cost estimation based on region
- PDF export of reports
- Responsive design for all devices
- Smooth animations between pages
- Real-time upload progress tracking

## Tech Stack

- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5
- React Router 7.6.2
- TanStack Query (React Query) 5.80.6
- Axios for API calls
- Tailwind CSS for styling
- Framer Motion for animations
- React Dropzone for file uploads

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd vnedraid-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Configuration

The application can be configured using the `src/config/config.ts` file. This file contains settings for:

- API base URL
- Environment (development, production)
- Debug mode

You can modify these settings based on your environment needs. For production, update the `prodConfig` object in this file.

## API Documentation

The API documentation is available in OpenAPI format in the `openapi.yaml` file in the root directory. This documentation describes all endpoints, request/response formats, and data models used by the application.

1. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
vnedraid-frontend/
├── public/              # Public assets
├── src/
│   ├── api/             # API services and documentation
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable components
│   ├── config/          # Configuration files
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── .eslintrc.js         # ESLint configuration
├── index.html           # HTML template
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

For production builds, update the API URL to your production backend.

## API Documentation

The API documentation is available in the OpenAPI format in `src/api/openapi.json`. This file can be used to generate API clients or to explore the API using tools like Swagger UI.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Locally preview the production build
- `npm run lint` - Run ESLint to check code quality

## Deployment

To deploy the application:

1. Build the application
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your web server or hosting service

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project was created as part of a frontend development challenge
- Design inspiration from modern automotive industry websites
