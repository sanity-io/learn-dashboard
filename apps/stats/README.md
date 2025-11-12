# Fathom API Proxy Server

A Hono-powered server that acts as a proxy to the Fathom Analytics API, built with Bun for optimal performance.

## Features

- **Health Check**: `GET /` - Server status and uptime
- **Site Stats**: `GET /stats/:siteId` - Get basic site information
- **CORS Enabled**: Cross-origin requests supported
- **TypeScript**: Full type safety with Bun types

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Fathom Analytics API key

### Installation

```bash
cd apps/stats
bun install
```

### Running the Server

```bash
# Development mode
bun run --watch index.ts

# Production mode
bun run index.ts
```

The server will start on port 3001 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Health Check

```bash
GET /
```

### Get Site Stats

```bash
GET /stats/:siteId
Authorization: Bearer YOUR_API_KEY
```

### Get Analytics Data

```bash
GET /analytics/:siteId
```

## Security

- CORS is enabled for cross-origin requests

## Development

This server is built with:

- **Hono**: Fast, lightweight web framework
- **Bun**: JavaScript runtime with built-in bundler
- **TypeScript**: Type-safe development
- **Fathom API**: Analytics data source
