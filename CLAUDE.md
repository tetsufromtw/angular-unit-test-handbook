# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 application for unit testing practice. The project uses Angular CLI and follows modern Angular conventions with standalone components, SCSS styling, and Jasmine/Karma for testing.

## Development Commands

### Core Commands
- `npm start` or `ng serve` - Start development server at http://localhost:4200
- `npm run build` or `ng build` - Build the application for production
- `npm test` or `ng test` - Run unit tests with Karma and Jasmine
- `npm run watch` or `ng build --watch --configuration development` - Build in watch mode for development

### Angular CLI Commands
- `ng generate component component-name` - Generate new component
- `ng generate --help` - See all available schematics (components, directives, pipes, etc.)

## Project Architecture

### File Structure
- **src/app/**: Main application directory
  - `app.ts` - Root component (App class) using standalone components
  - `app.config.ts` - Application configuration with providers
  - `app.routes.ts` - Routing configuration (currently empty)
  - `app.html` - Root component template with Angular branding
  - `app.scss` - Root component styles
  - `app.spec.ts` - Root component unit tests
- **src/main.ts** - Application bootstrap entry point
- **public/** - Static assets (favicon.ico)

### Key Technologies
- **Angular 20** with standalone components architecture
- **TypeScript** with strict mode enabled
- **SCSS** for styling (configured as default)
- **Jasmine/Karma** for unit testing
- **Angular Router** (configured but no routes defined yet)

### Configuration
- **TypeScript**: Strict mode enabled with additional strict options
- **Angular Compiler**: Strict templates and injection parameters
- **SCSS**: Default stylesheet format
- **Testing**: Jasmine types configured in tsconfig.spec.json

## Testing Strategy

The project uses Jasmine and Karma for unit testing:
- Test files use `.spec.ts` extension
- Tests are configured to run in the browser environment
- Current test validates component creation and title rendering

## Development Notes

- This is a fresh Angular CLI project focused on unit testing practice
- Uses modern standalone component architecture (no NgModule)
- Default component prefix is 'app'
- Strict TypeScript configuration for better code quality
- Template includes placeholder content that can be replaced for actual development