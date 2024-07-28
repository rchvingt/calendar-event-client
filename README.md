# Frontend Repository for Full Stack Calendar Event Project

## Description

This repository contains the frontend code for the full stack calendar event application built with [Next.js](https://nextjs.org/),[Material UI](https://mui.com/) and [FullCalendar](https://fullcalendar.io/).

## Related Repositories

This frontend interacts with the backend API provided by the following repository:

- [Backend Repository](https://github.com/rchvingt/nodejs-express-mysql.git) - The backend of this project is built with Express and MySQL.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

API routes can be accessed on [http://localhost:3000/api/calendars](http://localhost:3000/api/calendars). This endpoint can be edited in `pages/index.ts`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Demo

The project is now live and can be accessed at the following URL:

[Calendar Event](https://calendar-event-client.vercel.app)

## Features

This project includes a simple calendar event feature allowing users to create, update, and manage events seamlessly. Key functionalities include:

    •	Event Creation: Users can create events with specific date and time start, date and time end and assign the event to person.
    •	Event Update: Events can be updated with new details.
    •	Event Clash Check: Before saving or updating events, the system checks for potential time conflicts with existing events, ensuring no overlap.
    •   Calendar view: monthly, weekly, daily
    •   Input keyboard to filter events base on title event
    •   Filter events by person, user can select multiple people
