# Playwright QA Framework

![Playwright Tests](https://github.com/qustarahib-dev/playwright-qa-framework/actions/workflows/playwright.yml/badge.svg)

UI and API test automation built with Playwright and TypeScript, running in CI on GitHub Actions.

## Targets
- **UI:** [SauceDemo](https://www.saucedemo.com), an e-commerce demo app
- **API:** [Restful-Booker](https://restful-booker.herokuapp.com), a booking REST API

## Structure
- `pages/` - page objects (`LoginPage`, `InventoryPage`)
- `tests/ui/` - UI tests (login, cart)
- `tests/api/` - API tests (booking create/read/delete)
- `tests/a11y/` - accessibility checks (axe)
- `tests/mobile/` - mobile viewport tests (Pixel 7 emulation)
- `tests/db/` - API + database tests (registration verified in Postgres)
- `fixtures/` - shared fixtures (logged-in session)
- `.github/workflows/` - CI pipeline

## Running locally
```bash
npm ci
npx playwright install
npx playwright test
npx playwright show-report
```

## Test strategy
- **Automated:** critical user flows (login, add to cart) and the API booking lifecycle, since these are high-value and stable.
- **UI tests** run across Chromium, Firefox, and WebKit to catch cross-browser differences.
- **API tests** cover the full lifecycle (auth, create, read, delete, verify deleted) rather than single endpoints in isolation.
- **Page objects** keep locators in one place, so UI changes need one fix, not many.
- **Accessibility:** axe scan of the login page, failing on critical and serious WCAG violations.
- **Mobile:** login flow on an emulated Pixel 7 viewport.
- **Not automated yet:** visual checks and performance.

## CI
Every push runs the full suite on GitHub Actions and uploads the HTML report as an artifact.

## Planned next
- Shared login fixture to remove repeated setup
- Local app in Docker with database-level assertions
