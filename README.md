# Rugby Fixtures App

A Next.js application for tracking and managing rugby fixtures with an intuitive interface and responsive design.

**Live Demo:** [https://nextjs-dashboard-app-eta-mocha.vercel.app/](https://nextjs-dashboard-app-eta-mocha.vercel.app/)

## Features

- **Browse Fixtures**: View a list of all rugby fixtures with responsive design for desktop and mobile
- **Search Functionality**: Search for specific teams to filter fixtures
- **Fixture Details**: View detailed information about each fixture
- **Upload CSV Data**: Import rugby fixtures data from CSV files
- **Delete Fixtures**: Remove fixtures from the database
- **Pagination**: Navigate through multiple pages of fixtures

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose
- **Form Handling**: React with server actions
- **Data Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) with React Testing Library
- **UI Components**: Custom components with responsive design
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://fonts.google.com/specimen/Inter), a clean and modern sans-serif font designed for computer screens.

## Project Structure

```
src/
  app/                  # Next.js App Router
    fixtures/           # Fixtures list and detail pages
    lib/                # Server-side utilities
      actions/          # Server actions for data operations
      models/           # Data models and schemas
      utils/            # Helper utilities
    ui/                 # UI components
      fixtures/         # Fixture-related components
      navigation/       # Navigation components
      upload/           # Upload-related components
    upload/             # Upload page
```

## Data Model

The application uses the following data model for fixtures:

- `fixture_mid`: Unique identifier for the fixture
- `season`: Year of the fixture season
- `competition_name`: Name of the competition
- `fixture_datetime`: Date and time of the fixture
- `fixture_round`: Round number of the fixture
- `home_team`: Name of the home team
- `away_team`: Name of the away team

## Testing

This project uses [Vitest](https://vitest.dev/) for unit testing. Run the tests with:

```bash
npm test
# or
npm run test:watch   # Run in watch mode
```

Tests are located in `__tests__` directories adjacent to the files they test. For example, components in `src/ui/fixtures/` have their tests in `src/ui/fixtures/__tests__/`.

To create a new test file, follow the naming convention: `[filename].test.tsx`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
