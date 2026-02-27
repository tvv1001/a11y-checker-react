# Development Setup Guide

This guide helps contributors get the WCAG Accessibility Checker up and running locally for development.

## Prerequisites

Make sure you have the following installed:

- **Node.js 18.x or higher**: [Download Node.js](https://nodejs.org/)

  ```bash
  node --version  # Should be v18.0.0 or higher
  ```

- **pnpm 9.x or higher**: [Install pnpm](https://pnpm.io/installation)

  ```bash
  npm install -g pnpm
  pnpm --version  # Should be 9.0.0 or higher
  ```

- **Git**: [Download Git](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/a11y-checker-react.git
cd a11y-checker-react
```

## Step 2: Install Dependencies

```bash
pnpm install
```

This will install all required packages listed in `package.json`.

## Step 3: Install Playwright Browsers

The accessibility scanner uses Playwright to automate browser testing. You must install the browser binaries:

```bash
npx playwright install chromium
```

This downloads approximately 200-300 MB of browser binaries. This is a one-time setup.

## Step 4: Verify Setup

Run the development server:

```bash
pnpm dev
```

You should see output like:

```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

Open `http://localhost:3000` in your browser. You should see the accessibility checker interface.

## Step 5: Test the Setup

1. **Navigate to the app**: Open `http://localhost:3000`
2. **Scan a website**: Try scanning `https://example.com`
3. **Check the console**: You should see real-time scanning output
4. **Verify results**: The results page should show accessibility violations

If everything works, your setup is complete! 🎉

## Available Commands

### Development

```bash
pnpm dev
```

Starts the development server with hot-reload. Visit `http://localhost:3000`.

### Building

```bash
pnpm build
```

Creates an optimized production build.

### Production Server

```bash
pnpm start
```

Runs the production-built app (requires `pnpm build` first).

### Linting

```bash
pnpm lint
```

Checks code quality and formatting with ESLint.

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use:

```bash
pnpm dev -- -p 3001
```

This starts the dev server on port 3001 instead.

### Playwright Installation Issues

If you encounter issues installing Playwright:

```bash
# Try installing with verbose output
npx playwright install chromium --verbose

# On M1/M2 Macs, ensure you're using native binary
npx playwright install chromium --with-deps
```

### Module Not Found Errors

Ensure all dependencies are installed:

```bash
pnpm install
npm install -g pnpm  # Update pnpm if needed
rm -rf node_modules pnpm-lock.yaml
pnpm install          # Fresh install
```

### TypeScript Errors

If you see TypeScript errors:

```bash
# Restart dev server
pnpm dev

# Or force type check
npx tsc --noEmit
```

## Project Structure Reference

```
app/
├── api/
│   ├── scan/route.ts          # Main scanning endpoint
│   └── scan/stream/route.ts   # Streaming results endpoint
├── layout.tsx                  # Root layout
└── page.tsx                    # Main UI component

lib/
├── axe-config.ts              # Accessibility rules configuration
├── types.ts                    # TypeScript type definitions
└── wcag-mapping.ts            # WCAG standard mappings

public/                         # Static files (favicon, etc.)
```

## Understanding the Codebase

### Key Technologies

- **Next.js 16 (App Router)**: Server and client-side framework
- **React 19**: UI components
- **Playwright**: Browser automation for website scanning
- **axe-core**: Accessibility rule engine
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first styling

### How It Works

1. User enters a URL on the main page
2. Request sent to `/api/scan` endpoint
3. Playwright opens the URL in a headless browser
4. axe-core scans the page for WCAG violations
5. Results streamed back via `/api/scan/stream`
6. UI displays violations with detailed information

## Making Your First Contribution

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** in the appropriate directory

3. **Lint your code**:

   ```bash
   pnpm lint
   ```

4. **Test locally**:

   ```bash
   pnpm dev
   ```

5. **Commit and push**:

   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

6. **Create a Pull Request** on GitHub

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

## Getting Help

- **Documentation**: Check [README.md](../README.md)
- **Issues**: Search [existing issues](https://github.com/your-username/a11y-checker-react/issues)
- **Discussions**: Start a [discussion](https://github.com/your-username/a11y-checker-react/discussions)

## IDE Setup (Recommended)

### VS Code Extensions

For the best development experience with VS Code, install:

- **ESLint**: `dbaeumer.vscode-eslint`
- **Prettier**: `esbenp.prettier-vscode` (optional)
- **Thunder Client** or **REST Client**: For testing API endpoints
- **Playwright Inspector**: For debugging Playwright scripts

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "search.exclude": {
    "**/.next": true,
    "**/node_modules": true
  }
}
```

## Next Steps

1. **Read [CONTRIBUTING.md](../CONTRIBUTING.md)** for contribution guidelines
2. **Review existing issues** for something to work on
3. **Check [README.md](../README.md)** to understand the project better
4. **Start building!** 🚀

Happy coding! 💻
