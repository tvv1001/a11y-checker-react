# WCAG Accessibility Checker

A modern web application built with Next.js 16, React 19, Playwright, and axe-core to check web accessibility compliance against WCAG standards (2.0 A through 2.2 AA).

## Features

- **URL Scanning**: Enter any URL to scan for WCAG compliance issues
- **Real-time Console Logs**: View the scanning process in real-time
- **Detailed Results**: See violations, passed checks, and incomplete tests
- **Issue Details**: View affected elements and recommended fixes for each violation
- **Beautiful UI**: Modern, gradient-based design with responsive layout
- **Impact Levels**: Issues categorized by severity (critical, serious, moderate, minor)

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Testing**: Playwright, @axe-core/playwright
- **Styling**: Tailwind CSS with custom CSS variables
- **TypeScript**: Full type safety

## Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
npx playwright install chromium
```

## Usage

### Development

```bash
pnpm dev
```

The app will be available at http://localhost:3000

### Production

```bash
pnpm build
pnpm start
```

## How to Use

1. Enter a URL in the input field (e.g., https://example.com)
2. Click "Scan Page" or press Enter
3. Watch the console output as the scan progresses
4. Review the results:
   - **Violations**: Issues found that need to be fixed
   - **Passed**: Tests that passed successfully
   - **Incomplete**: Tests that require manual review

## API Endpoints

### `GET /api/scan`

Scans a URL for accessibility issues.

**Query Parameters:**

- `url` (required): The URL to scan
- `session` (optional): Session ID for log tracking
- `wcag` (optional): WCAG preset (default: 'wcag22aa')
  - Options: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`

**Response:**

```json
{
  "violations": [...],
  "passes": [...],
  "incomplete": [...],
  "summary": {
    "violation_count": 0,
    "pass_count": 45,
    "incomplete_count": 0
  },
  "logs": [...]
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── scan/
│   │       └── route.ts       # API endpoint for scanning
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── lib/
│   ├── axe-config.ts          # Axe-core configuration
│   └── types.ts               # TypeScript types
└── package.json
```

## Configuration

### WCAG Presets

The app supports multiple WCAG compliance levels:

- `wcag2a`: WCAG 2.0 Level A
- `wcag2aa`: WCAG 2.0 Level AA
- `wcag21a`: WCAG 2.1 Level A
- `wcag21aa`: WCAG 2.1 Level AA
- `wcag22aa`: WCAG 2.2 Level AA (default)

## Notes

- The scanner requires the target website to be publicly accessible
- Only HTTP and HTTPS protocols are supported
- Scanning timeout is set to 45 seconds per page
- The maximum API execution time is 60 seconds

## Acknowledgments

This project was inspired by [wcag-checker-app](https://github.com/tvv1001/wcag-checker-app) and rebuilt with modern technologies.

## License

MIT
