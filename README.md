# Panic Proof ✌️

AI-powered multimodal disaster preparedness and emergency response — now with offline Local LLM support and Expo Development Build.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Highlights](#architecture-highlights)
- [Getting Started](#getting-started)
- [Development Build (Expo Dev Client)](#development-build-expo-dev-client)
- [Offline AI (Local LLM)](#offline-ai-local-llm)
- [Screenshots](#screenshots)
- [Acknowledgments](#acknowledgments)

## Overview

Panic Proof helps people prepare for and respond to disasters with an AI assistant, location-aware alerts, and gamified checklists. The app works online with Google Gemini and offline using a local model via ExecuTorch.

## Features

- AI Assistant: Structured, actionable checklists for emergency prep
- Smart Alerts: Location-based disaster updates and guidance
- Gamified Checklists: Progress, points, and achievements
- Locations & Contacts: Save places, routes, and emergency contacts
- Resource Library: Curated content for major disaster types
- Profiles: Household needs and personalized plans

## Tech Stack

- React Native + Expo (SDK 52)
- Expo Router, Expo Modules, Expo Dev Client
- TypeScript, Zustand (state + persistence)
- Supabase (Postgres, RLS, real-time), Clerk (Auth)
- AI: Google Gemini (online) + ExecuTorch (offline local LLM)

## Architecture Highlights

- Development Build first-class: We use Expo Dev Client for native modules (image-picker, location, secure-store, executorch).
- LLM Provider Abstraction: `online | local | auto` with a small service layer and a zustand store to switch providers.
- Model Lifecycle: Download → verify → persist metadata → load for inference. Stored under app documents directory (`llm/`).
- Consistent Chat Pipeline: Online and offline providers produce identical structured JSON for checklists.

## Getting Started

Prerequisites

- Node.js 18+
- Xcode (iOS) and/or Android Studio
- CocoaPods (macOS): `sudo gem install cocoapods`
- Accounts: Supabase, Clerk, Google AI Studio

Install

1. Clone and install

```bash
git clone https://github.com/jamiul-islam/panic-proof.git
cd panic-proof
npm install
# or
bun install
```

1. Environment variables (create `.env.local`)

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key
```

1. Supabase setup

- Apply schema and enable RLS as per project docs. Ensure JWT from Clerk maps to your user row.

## Development Build (Expo Dev Client)

```bash
npx expo prebuild
```

First run builds a native dev client with required modules. Afterwards, you iterate with fast refresh via `expo start`.

iOS (Simulator)

```bash
npm run run:ios
# or
bun run run:ios
```

Android (Emulator)

```bash
npm run run:android
# or
bun run run:android
```

Start the bundler (reuse for both platforms)

```bash
npm start
# or
bun start
```

Notes

- We use `app.config.js` (no `app.json`) to avoid config drift.
- Hermes/new architecture enabled by default via Expo SDK 52.
- If native dependencies change, rebuild the dev client with the same commands above.

## Offline AI (Local LLM)

The app supports full offline inference using ExecuTorch.

What’s included

- Provider toggle (Online/Offline) via the profile modal
- Model download with resumable progress and cancel
- Metadata persistence (`metadata.json`) and verification on launch
- Consistent structured JSON responses across providers

How to use

1) Open Profile → Offline AI Support
2) Select “Offline” and download the model when prompted
3) After “Ready,” start a chat — checklists are generated locally

Storage & Simulator notes

- Models are stored under the app documents directory at `llm/` with a `metadata.json` file.
- On iOS Simulator, you can inspect/remove files via Xcode → Devices and Simulators → select the app → Download Container.
- Reinstalling the app or clearing data removes the model and metadata.

Fallbacks & errors

- If verification fails or inference errors occur, the app guides you to retry or switch back to Online.

## Screenshots

<table>
  <tr>
    <td><img src="/assets/images/app-screenshots/1. splash.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/2. home-screen.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/3. alert-screen.png" alt="App Screenshot" width="200"/></td>
  </tr>
  <tr>
    <td><img src="/assets/images/app-screenshots/4. prepare-screen.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/5. gamified-prepare-screen.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/6. resources-screen.png" alt="App Screenshot" width="200"/></td>
  </tr>
</table>

## Acknowledgments

### Academic Institution
- **University of London** - Final Project supervision and guidance
- **Computer Science Program** - Technical framework and requirements

### Technologies & Services
- **Expo Team** - For the exceptional React Native development platform
- **Supabase** - For providing enterprise-grade PostgreSQL with real-time capabilities
- **Clerk** - For robust authentication and user management services
- **Google AI** - For Gemini API enabling intelligent emergency assistance
- **Zustand Team** - For lightweight and efficient state management
- **React Native ExecuTorch team** - For blazingly fast local llm support

### Open Source Community
- **React Native Community** - For continuous improvements and extensive ecosystem
- **TypeScript Team** - For enhanced developer experience and type safety
- **Emergency Management Professionals** - Whose guidelines informed our preparedness recommendations

### Special Recognition
This project demonstrates practical application of:
- Full-stack mobile development with modern tools
- AI integration for social good and emergency preparedness
- Secure database architecture with real-time capabilities
- User experience design for critical emergency applications

---

**Built with ❤️ for a safer, more prepared world.**

*A University of London Computer Science Final Project by [Jamiul Islam](https://github.com/jamiul-islam)*
