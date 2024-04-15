<img src="https://github.com/RickV85/sendtemps/blob/main/public/icon-192x192.png?raw=true" alt="SendTemps logo">

# SendTemps

## Deployment

[Click here to view the deployed application](https://sendtemps.vercel.app)

## Introduction
I am the sole contributor to this project which began as a very basic application in June 2023. I built it completely out of self interest as a tool to plan my own personal outdoor adventures. After months of constant use, I decided that it would be worthwhile to improve the application for users similar to myself and use it as an opportunity to learn some interesting new technology.

## Overview
SendTemps is a full-stack Next.js 14 application designed for Colorado Front Range outdoor sport enthusiasts. It delivers precise NOAA forecasts for both popular and user-created backcountry locations. This project integrates Google OAuth and NextAuth for seamless user account creation and authentication, Google Maps API for user-friendly custom location creation, and a robust Node.js-PostgreSQL backend with comprehensive CRUD operations, complemented by user-focused error handling.

## Key Features
- **Real-time NOAA Weather Forecasts:** Offers pinpoint weather data for the Colorado backcountry, tailored for outdoor enthusiasts, surpassing popular weather apps focused on forecasts for urban and suburban locations.
- **Seamless User Account Management:** Integrates Google OAuth and NextAuth for a secure, streamlined sign-in experience with persistent sessions, enabling easy access to location customization features.
- **Interactive Mapping:** Features a point-and-click Google Maps interface for easy creation of backcountry locations, with an auto-updating, user-friendly UI.
- **Robust Location Management:** Employs a Vercel PostgreSQL database for durable storage of custom locations, supporting full CRUD operations through Next.js APIs for dynamic user interaction.
- **AI-Powered Recommendations:** Using prompt engineering, integrated AI to analyze forecasts and recommend optimal days to engage in the sports that the user selected location is associated with.
- **Optimized User Experience:** Implements intelligent error handling and automatic retry mechanisms for NOAA forecast API requests, ensuring smooth and informative user interactions.
- **Standalone Display:** Designed for optimal performance on mobile devices, with capabilities for home screen addition, paving the way for full Progressive Web App functionality in the future.
- **Hourly Forecast Display:** New as of 2.26.24 - Provides detailed hourly weather forecasts for more precise activity planning.

## Future Improvements
- **Expanded Location Categories:** Introduce an "Other" category to accommodate custom location creation that is not limited to Climbing, Mountain Biking, or Skiing.
- **Multiple Sport Association:** Enable users to associate multiple sports with a single location for enhanced flexibility.
- **Customizable Default Views:** Allow users to personalize the locations around the Front Range that are loaded by default. This would allow a user to further personalize the application, increasing engagement by reducing irrelevant information.
- **Enhanced Search Functionality:** Implement text-based search with autocomplete to streamline location finding. This would be especially useful if a user has many locations and the current select inputs become too cumbersome.

## Technical Challenges
- Google OAuth / NextAuth
  - A primary goal for this app was to create user authentication using best practices while making account creation and sign in as easy as possible, so Google OAuth was the obvious choice. Creating this feature proved to be quite challenging due to my lack of experience with NextAuth, JSON Web Tokens, and cookies. Through persistence and research, I was able to meet my goal, providing the great authentication UX I was hoping for. This experience deepened my understanding of user security and privacy.
- TypeScript
  - I chose TypeScript over JavaScript to continue refining my skills as I understand that most enterprise level applications use it over JavaScript for maintainability. This project is my largest TypeScript project to date, so I encountered many new issues that I had not yet before, learning as I worked through TS errors. I now feel much more comfortable with TypeScript and this experience will help me write more robust code moving forward.
- Full-stack Development
  - My vision of this application absolutely required backend development which I was not formally taught in my time at the Turing School of Software & Design. I have created a number of Next.js frontend's but I had yet to take advantage of its API features and was very excited to do so. This was challenging in many ways, including the lack of documentation on this proprietary system, but I became much more familiar with Next's unique API features, creating PostgreSQL queries, and other Node.js development skills. Through this experience, I feel that I have become a much more versatile developer and I feel more prepared for a full-stack developer position.

## Tech Stack
- Next.js
- React.js
- TypeScript
- Node.js
- PostgreSQL
- Google OAuth
- NextAuth
- Google Maps API
- OpenAI API
- Vercel Storage
- Cypress E2E Testing

## Installation

1. Clone the repository to your local machine.
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser. The app auto-updates as you edit the project.

