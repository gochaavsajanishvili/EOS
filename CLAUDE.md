# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EOS (Entrepreneurial Operating System) Platform for Zuma - a business management platform implementing the EOS methodology with features for vision tracking, rocks management, meetings, and data visualization.

The codebase contains three implementations:
- **EOS-v0.1.js**: React.js version with Firebase/Firestore backend
- **EOS-v0.5.html**: HTML/Vanilla JS with light theme
- **EOS-v1.html**: HTML/Vanilla JS with dark theme (latest version)

## Development Commands

This is a static web application with no build system:
- **Run locally**: Open HTML files directly in browser or use VS Code Live Server (configured for port 5501)
- **No npm scripts**: No package.json or build commands
- **Dependencies**: All loaded via CDN (Tailwind CSS, Chart.js, Font Awesome)

## Architecture

### HTML Versions (v0.5, v1.0)
- Single-file applications with embedded JavaScript
- Central `App` object manages all state and functionality
- Data persistence via localStorage
- Direct DOM manipulation for UI updates
- Key modules: Dashboard, VTO, Departments, People, Data, Issues, Rocks, Level10Meetings

### React Version (v0.1)
- Single-file React application
- Firebase/Firestore for data persistence and authentication
- Component-based architecture with hooks
- Requires Firebase configuration via global variables

## Key Implementation Details

- **Data Storage**: localStorage for HTML versions, Firestore for React version
- **Routing**: Hash-based navigation (`#dashboard`, `#vto`, etc.)
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome (v0.5) or custom SVGs (v1.0)
- **Authentication**: Firebase Auth in React version only
- **Mock Data**: Available via `loadMockData()` function in HTML versions

## Important Notes

- No test framework - manual testing only
- No linting/formatting configuration
- Firebase credentials should be configured via environment variables (not committed)
- VS Code Live Server recommended for development