# Contributing to WCAG Accessibility Checker

Thank you for your interest in contributing to the WCAG Accessibility Checker! We appreciate any contributions, whether they're bug reports, feature requests, documentation improvements, or code changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Issues](#submitting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

Please be respectful and constructive in all interactions. We're committed to creating a welcoming, inclusive environment for everyone. Any form of harassment or discrimination will not be tolerated.

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 9.x or higher (we use pnpm as our package manager)
- **Git**: For version control

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/a11y-checker-react.git
   cd a11y-checker-react
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/a11y-checker-react.git
   ```

## Project Structure

```
a11y-checker-react/
├── app/                    # Next.js App Router directory
│   ├── api/               # API endpoints
│   │   ├── scan/          # Main scan endpoint
│   │   └── scan/stream/   # Streaming scan endpoint
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── lib/                   # Shared utilities
│   ├── axe-config.ts      # axe-core configuration
│   ├── types.ts           # TypeScript type definitions
│   └── wcag-mapping.ts    # WCAG compliance mappings
├── public/                # Static assets
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

### Key Files

- **`app/api/scan/route.ts`**: Main API endpoint for scanning URLs
- **`app/api/scan/stream/route.ts`**: Streaming endpoint for real-time results
- **`lib/axe-config.ts`**: Configures axe-core accessibility rules
- **`lib/wcag-mapping.ts`**: Maps violations to WCAG standards and success criteria
- **`lib/types.ts`**: Type definitions for scan results and API responses

## Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Install Playwright Browsers

The project uses Playwright to automate browser scanning. Install the required browsers:

```bash
npx playwright install chromium
```

### 3. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### 4. Running Linting

```bash
pnpm lint
```

## Making Changes

### Create a Feature Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:

- `feature/add-login` for new features
- `fix/button-bug` for bug fixes
- `docs/update-readme` for documentation
- `refactor/optimize-scan` for refactoring

### Development Workflow

1. **Make your changes** in your feature branch
2. **Test locally** by running `pnpm dev` and testing manually
3. **Lint your code** with `pnpm lint` to ensure formatting
4. **Commit early and often** with clear commit messages
5. **Keep commits focused** on a single logical change

## Coding Standards

### TypeScript

- Use **strict mode** (enabled in `tsconfig.json`)
- Provide explicit types for function parameters and returns
- Avoid using `any` type; use `unknown` with proper type narrowing if necessary
- Use meaningful variable and function names

### React & Next.js

- Use **functional components** with hooks
- Place components in the `app/` directory following Next.js conventions
- Use the **App Router** (not Pages Router)
- Keep components focused and reusable
- Add JSDoc comments for complex components

### Accessibility

Since this is an accessibility tool, **please ensure your code follows WCAG 2.1 AA standards**:

- Use semantic HTML elements (`button`, `nav`, `main`, `section`, etc.)
- Provide proper ARIA labels where needed
- Maintain keyboard navigation support
- Ensure proper color contrast (minimum 4.5:1 for normal text)
- Test with screen readers when adding UI components

### Styling

- Use **Tailwind CSS** utility classes
- Follow existing color and spacing conventions
- Avoid inline styles unless absolutely necessary
- Use CSS variables in `globals.css` for theme values

### Code Organization

```typescript
// 1. Imports
import { useState } from 'react';

// 2. Type definitions
interface MyComponentProps {
  title: string;
  onClose: () => void;
}

// 3. Component definition
export default function MyComponent({ title, onClose }: MyComponentProps) {
  // 4. Hooks
  const [isOpen, setIsOpen] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // 6. Render
  return (
    <div onClick={handleClick}>
      {title}
    </div>
  );
}
```

## Testing

### Manual Testing

1. **Run the dev server**: `pnpm dev`
2. **Test in browser**: Open `http://localhost:3000`
3. **Test various URLs**: Try scanning different websites
4. **Check console output**: Monitor browser dev tools for errors
5. **Test accessibility**: Use keyboard navigation and screen readers

### Adding New Features

When adding new scanning capabilities:

1. Update `lib/axe-config.ts` if modifying accessibility rules
2. Update `lib/wcag-mapping.ts` for WCAG standard mappings
3. Update `lib/types.ts` for new data structures
4. Test with sample URLs covering various accessibility issues
5. Update documentation in `README.md`

## Submitting Issues

### Bug Reports

Please include:

- **Clear title**: Describe the bug concisely
- **Steps to reproduce**: How to reliably reproduce the issue
- **Expected behavior**: What should happen
- **Actual behavior**: What currently happens
- **Environment**: Node version, OS, pnpm version
- **Screenshots/logs**: If applicable

### Feature Requests

Please include:

- **Clear title**: Brief feature description
- **Use case**: Why this feature would be useful
- **Proposed solution**: How you envision it working
- **Alternatives**: Other approaches you've considered

## Submitting Pull Requests

### Before You Start

1. **Check existing issues/PRs** to avoid duplicating work
2. **Create an issue first** for major features (get feedback early)
3. **Keep PRs focused** on a single feature or fix
4. **Update tests and docs** alongside code changes

### PR Checklist

Before submitting:

- [ ] Code follows project's coding standards
- [ ] All lint checks pass (`pnpm lint`)
- [ ] Changes are tested manually
- [ ] TypeScript compiles without errors
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive
- [ ] No console warnings or errors in dev mode
- [ ] Accessibility standards are maintained

### Creating a Pull Request

1. **Push your branch** to your fork

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a PR** on GitHub with:
   - Clear title describing the change
   - Description explaining what and why
   - Reference related issues: `Closes #123`
   - Screenshots for UI changes
   - Any breaking changes clearly noted

3. **Respond to feedback** promptly and professionally

### PR Review Process

- At least one maintainer will review your PR
- We may request changes or ask clarifying questions
- Please be responsive to feedback
- Once approved, a maintainer will merge your PR

## Commit Message Guidelines

Use clear, descriptive commit messages:

### Format

```
[type]: [subject]

[body]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Build, dependency, or tooling changes

### Examples

```
feat: add support for WCAG 2.2 AA scanning

Implement axe-core 4.11+ rules for WCAG 2.2 AA compliance
and update success criteria mappings accordingly.

fix: prevent duplicate results in stream endpoint

Closes #42

docs: update API documentation for scan parameters

refactor: extract report generation to separate module

chore: upgrade Next.js to 16.1.6
```

## Development Tips

### Debugging

- **Use Next.js dev tools**: The dev server includes great debugging tools
- **Check browser console**: Open DevTools (`F12`) for client-side errors
- **Server-side logs**: Check terminal for API endpoint errors
- **Use debugger**: Add `debugger;` statements and use `node --inspect`

### Performance

- The page scan can take 10-30 seconds depending on page size
- Monitor Playwright's performance when adding new rules
- Test with smaller and larger websites

### Common Tasks

**Update axe-core rules**:

1. Modify `lib/axe-config.ts`
2. Update `lib/types.ts` if result structure changes
3. Test with various websites
4. Update `README.md` with any new capability

**Add a new WCAG standard mapping**:

1. Update `lib/wcag-mapping.ts`
2. Update type definitions in `lib/types.ts`
3. Test in UI to ensure proper display
4. Update documentation

## Questions?

- **Documentation**: Check [README.md](./README.md)
- **Issues**: Search existing [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: Open a discussion if you have questions

## Thank You!

Your contributions help make web accessibility more accessible to everyone. We really appreciate your help! 🙏

---

**Happy contributing! 🎉**
