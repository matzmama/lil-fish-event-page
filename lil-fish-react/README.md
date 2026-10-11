# Lil Fish Community Center

A polished event venue website built with React and Vite. Lil Fish Community Center is a fictional community venue experience designed to showcase seasonal events, venue rentals, vendor applications, and a configurable event quote calculator.

This project was built as a portfolio piece with the goal of feeling like a real client-ready site rather than a static brochure. It includes multi-page routing, themed UI states, image-led event content, form validation, demo-safe quote submission, and an optional Flask API integration.

## Highlights

- Multi-page React experience with routes for Home, About, Events, Gallery, and Contact.
- Seasonal theme toggle that changes the visual treatment across the app.
- Event discovery flow with featured events, event cards, rental packages, and custom package CTAs.
- Contact experience with two user paths:
  - Festival and market vendor request form.
  - Private event quote calculator for weddings, reunions, graduations, anniversaries, and custom events.
- Config-driven pricing from `src/data/quoteConfig.json`.
- Quote estimate breakdown with optional add-ons, refundable deposit logic, catering, security, and bridal suite calculations.
- Demo-safe submission flow that works without a backend.
- Optional Flask + SQLite backend for saving quote requests.
- Responsive styling, accessible labels, keyboard-friendly interactions, and production build validation.

## Tech Stack

- React 19
- Vite
- React Router
- React Icons
- ESLint
- Optional backend: Flask, Flask-CORS, Flask-SQLAlchemy, SQLite

## Project Structure

```text
lil-fish-react/
  src/
    Pages/              Page-level React views
    components/         Reusable UI and feature components
    data/               Quote configuration JSON
    utils/              Pricing utility logic
    assets/             Venue, event, and package imagery
  scripts/              Pricing import helper
  business-rules/       Supporting project/business notes

lil-fish-backend/
  app.py                Flask API for quote CRUD
  models.py             SQLAlchemy models
  requirements.txt      Backend dependencies
```

## Getting Started

Install frontend dependencies:

```bash
cd lil-fish-react
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Quote Submission Modes

The quote form supports two modes.

### Demo Mode

By default, the frontend does not require a running API. When a visitor submits a quote request without an API URL configured, the app confirms that the demo request was prepared instead of failing.

This keeps the project easy to review as a portfolio piece.

### Backend Mode

To send quote requests to the Flask API, set:

```bash
VITE_QUOTES_API_URL=http://localhost:5000
```

Then start the backend from the project root:

```bash
cd lil-fish-backend
pip install -r requirements.txt
python app.py
```

The backend exposes:

- `GET /api/health`
- `GET /api/quotes`
- `GET /api/quotes/<id>`
- `POST /api/quotes`
- `PUT /api/quotes/<id>`
- `DELETE /api/quotes/<id>`

Note: the Flask CORS configuration currently allows `http://localhost:5173`. If Vite chooses a different dev port, update the CORS origin in `lil-fish-backend/app.py` or run Vite on port `5173`.

## Pricing Data

Quote pricing is driven by `src/data/quoteConfig.json`. The data includes event types, base prices, guest tiers, add-ons, deposits, and pricing methods.

The pricing data is demo content for the portfolio project. It is not intended to represent real venue pricing.

To regenerate quote configuration from the workbook workflow:

```bash
npm run import-pricing
```

## Portfolio Notes

This project demonstrates:

- Translating a venue/event concept into a complete user flow.
- Building reusable React components for cards, forms, navigation, and page sections.
- Handling conditional form paths from URL query parameters.
- Keeping business rules out of JSX by using configuration data.
- Designing for both standalone portfolio review and optional API integration.
- Validating the frontend with linting and production builds.

## Future Improvements

- Compress and resize large image assets for faster loading.
- Add automated tests for quote calculations and form validation.
- Add an admin-facing quote review dashboard.
- Move backend configuration into environment variables for production deployment.
- Add persistent vendor request storage alongside quote storage.

## Disclaimer

Lil Fish Community Center, the address, contact details, event dates, and pricing are fictional demo content created for this portfolio project.
