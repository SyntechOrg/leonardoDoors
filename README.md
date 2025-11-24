# Leonardo — Next.js migration

This repository was migrated from a Vite React app to Next.js. The important changes:

- Next.js app entry: `pages/_app.jsx`, `pages/index.jsx`.
- Global styles are in `src/index.css` (Tailwind) and PostCSS is configured in `postcss.config.js`.

To run locally:

1. Install dependencies:

	npm install

2. Run development server:

	npm run dev

3. Build for production:

	npm run build

4. Start production server:

	npm run start

Notes:
- Some routing was migrated from `react-router-dom` to Next.js file-system routing. Components using client navigation were updated to use `next/link` and `next/router`.
- Static assets remain in the `public/` folder and are served by Next.js.
