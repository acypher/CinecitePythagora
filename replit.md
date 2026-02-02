# Cinecite - Movie & TV Show Ratings Aggregator

## Overview

Cinecite is a movie and TV show ratings aggregator that allows users to search for entertainment content and view consolidated ratings from multiple review sources (Rotten Tomatoes, Metacritic, IMDb). The application displays comprehensive information including plot summaries, cast details, streaming availability, and genre information in a clean, responsive interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with hot module replacement
- **Theme System**: Custom ThemeProvider supporting light/dark/system modes with CSS variables

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/` (shadcn/ui)
- Feature-specific components in `client/src/components/`
- Custom hooks in `client/src/hooks/`

### Backend Architecture
- **Framework**: Express.js 5 with TypeScript
- **API Design**: RESTful endpoints under `/api/` prefix
- **Development Server**: Vite dev server integration for HMR
- **Production**: Static file serving from built assets

The server uses a simple modular structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Data storage interface (currently in-memory)
- `server/mockData.ts` - Mock movie/TV data for development

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` using Zod for validation
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Current State**: Using in-memory storage with mock data; database integration ready

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- Schema definitions with Zod validation
- Type exports for MovieResult, Rating, CastMember, StreamingInfo

### Build System
- Development: `npm run dev` - Uses tsx to run TypeScript directly with Vite HMR
- Production: `npm run build` - Vite builds frontend, esbuild bundles server
- Database: `npm run db:push` - Drizzle Kit for schema migrations

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Drizzle ORM**: Database toolkit with type-safe queries
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### UI Components
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible UI component primitives
- **Lucide React**: Icon library
- **react-icons**: Additional icons (Rotten Tomatoes, Metacritic)

### Frontend Libraries
- **TanStack React Query**: Data fetching and caching
- **react-hook-form**: Form handling with @hookform/resolvers
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility
- **embla-carousel-react**: Carousel functionality
- **date-fns**: Date formatting utilities
- **vaul**: Drawer component
- **cmdk**: Command palette
- **recharts**: Charting library

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **TypeScript**: Type checking across the codebase
- **Tailwind CSS**: Utility-first CSS framework