# WCAG Accessibility Checker

A modern, comprehensive web accessibility scanner built with Next.js 16, React 19, Playwright, and axe-core to check WCAG compliance (2.0 A through 2.2 AA) with detailed reporting and actionable remediation guidance.

## ✨ Features

### Core Functionality

- **🔍 URL Scanning**: Analyze any public URL for WCAG accessibility compliance
- **📊 Real-time Console**: Watch the scanning process with live logging
- **📋 Comprehensive Results**: View violations, passed checks, and incomplete tests
- **🎯 WCAG Compliance Mapping**: See which WCAG conformance levels and success criteria each violation affects
- **🔬 Detailed Element Inspection**:
  - CSS selectors for precise element location
  - Failure summaries explaining what's wrong
  - HTML snippets of affected elements
  - Element-specific remediation guidance

### Rich Reporting

- **📚 Help Documentation**: Direct links to axe-core and Deque University documentation
- **⚡ Impact Levels**: Issues categorized by severity (critical, serious, moderate, minor)
- **🏷️ WCAG Tags**:
  - Conformance level badges (WCAG 2.0 A, 2.1 AA, 2.2 AA, etc.)
  - Success criteria references (1.1.1, 1.3.1, 1.4.3, etc.)
- **💡 Actionable Guidance**: "How to fix" instructions with external documentation links
- **🎨 Modern UI**:
  - Gradient-based design
  - Responsive layout
  - WCAG 1.4.3 compliant color contrast
  - Expandable violation details

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Testing Engine**: Playwright 1.58+, axe-core 4.11+
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **Language**: TypeScript 5 with full type safety
- **Package Manager**: pnpm

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (required for scanning)
npx playwright install chromium
```

## 🚀 Usage

### Development

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Production

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## 📖 How to Use

1. **Enter a URL**: Type or paste any public URL (e.g., `https://example.com`)
2. **Start Scan**: Click "Scan Page" or press Enter
3. **Monitor Progress**: Watch the real-time console output
4. **Review Results**:
   - **Violations**: Accessibility issues that need fixing
   - **Conformance Levels**: Which WCAG standards are affected
   - **Success Criteria**: Specific WCAG guidelines violated
   - **Affected Elements**: Expanded view with CSS selectors and HTML
   - **How to Fix**: Actionable remediation steps with documentation links
   - **Passed**: Tests that succeeded
   - **Incomplete**: Tests requiring manual review

## 🔌 API Endpoints

### `GET /api/scan`

Scans a URL for WCAG accessibility violations.

**Query Parameters:**

| Parameter | Type   | Required | Default    | Description                 |
| --------- | ------ | -------- | ---------- | --------------------------- |
| `url`     | string | Yes      | -          | The URL to scan             |
| `session` | string | No       | "default"  | Session ID for log tracking |
| `wcag`    | string | No       | "wcag22aa" | WCAG preset to use          |

**WCAG Presets:**

- `wcag2a` - WCAG 2.0 Level A
- `wcag2aa` - WCAG 2.0 Level AA
- `wcag21a` - WCAG 2.1 Level A
- `wcag21aa` - WCAG 2.1 Level AA
- `wcag22aa` - WCAG 2.2 Level AA (default)

**Example Request:**

```bash
curl "http://localhost:3000/api/scan?url=https://example.com&wcag=wcag22aa"
```

**Response:**

```json
{
  "violations": [
    {
      "id": "color-contrast",
      "description": "Ensures text contrast meets WCAG requirements",
      "help": "Elements must have sufficient color contrast",
      "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast",
      "impact": "serious",
      "tags": ["wcag2aa", "wcag21aa", "wcag143"],
      "nodes": [
        {
          "html": "<p>Low contrast text</p>",
          "target": ["body > main > p:nth-child(2)"],
          "failureSummary": "Fix any of the following: Element has insufficient color contrast..."
        }
      ],
      "nodeCount": 1
    }
  ],
  "passes": [...],
  "incomplete": [...],
  "summary": {
    "violation_count": 1,
    "pass_count": 45,
    "incomplete_count": 0
  },
  "logs": [
    {
      "type": "success",
      "message": "Scan completed successfully",
      "timestamp": 1735182393000
    }
  ]
}
```

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── scan/
│   │       └── route.ts           # API endpoint for WCAG scanning
│   ├── globals.css                # Global styles and CSS variables
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main scanner UI component
├── lib/
│   ├── axe-config.ts              # Axe-core configuration and processors
│   ├── types.ts                   # TypeScript type definitions
│   └── wcag-mapping.ts            # WCAG success criteria mappings
├── public/                         # Static assets
├── .gitignore                     # Git ignore patterns
├── eslint.config.mjs              # ESLint configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.mjs             # PostCSS configuration
├── pnpm-lock.yaml                 # Lockfile
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## 🔧 Configuration

### WCAG Presets

Customize which WCAG standards to test against by modifying the presets in [lib/axe-config.ts](lib/axe-config.ts).

### Styling

All color variables and styles are defined in [app/globals.css](app/globals.css) and meet WCAG 1.4.3 contrast requirements.

## 🧪 Key Technologies

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[Playwright](https://playwright.dev/)** - Browser automation for page rendering
- **[axe-core](https://github.com/dequelabs/axe-core)** - Accessibility testing engine
- **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)** - Playwright integration for axe
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript

## 🐛 Known Issues

- The scanner requires Chromium to be installed via Playwright
- Some pages with strict CSP policies may have limited scanning capabilities
- The `module is not defined` error has been mitigated with a shim in the axe-core injection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and for educational/demonstration purposes.

## 🔗 Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Deque University Axe Rules](https://dequeuniversity.com/rules/axe/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)
- [Playwright Documentation](https://playwright.dev/docs/intro)

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
