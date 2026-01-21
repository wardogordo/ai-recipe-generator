# AI Recipe Generator

## Project Overview
A React application that generates recipe ideas using AI. Users input ingredients and receive AI-generated recipes powered by AWS Bedrock (Claude Sonnet).

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Backend**: AWS Amplify Gen 2
- **AI**: AWS Bedrock with Claude Sonnet 4.5
- **Auth**: AWS Cognito (email verification)

## Project Structure
```
src/
  App.tsx          # Main app component with form and auth
  App.css          # Styling
  main.tsx         # Entry point
amplify/
  backend.ts       # Amplify backend definition, Bedrock data source
  auth/resource.ts # Cognito auth configuration
  data/resource.ts # GraphQL schema with askBedrock query
  data/bedrock.js  # Bedrock request/response handlers
```

## Commands
```bash
npm run dev       # Start dev server
npm run build     # TypeScript check + Vite build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Amplify Sandbox
```bash
npx ampx sandbox  # Start Amplify sandbox for local development
```

## Architecture
1. User authenticates via Cognito (email + verification code)
2. User submits ingredients via form
3. Frontend calls `askBedrock` GraphQL query
4. Amplify routes to Bedrock HTTP data source
5. `bedrock.js` formats request for Claude Sonnet API
6. AI response displayed to user

## Key Files
- `amplify_outputs.json` - Generated Amplify config (do not edit manually)
- `amplify/backend.ts` - Bedrock IAM permissions configured here
- `amplify/data/bedrock.js` - Modify prompt template here
