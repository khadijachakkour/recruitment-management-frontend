This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Tests

### End-to-End (E2E) Selenium Tests

This project uses Selenium to automate end-to-end tests for key user journeys (admin, recruiter, candidate, etc.) on the Next.js frontend.

#### Running Selenium Tests Locally

1. **Start the Next.js frontend:**
   ```powershell
   npm run dev
   # or
   yarn dev
   ```
2. **Install Selenium dependencies:**
   ```powershell
   npm install selenium-webdriver
   # (and ensure Chrome/Chromedriver is installed)
   ```
3. **Run a test script:**
   ```powershell
   node tests/selenium/admin-test.js
   # or
   node tests/selenium/recruteur-test.js
   # or
   node tests/selenium/candidat-test.js
   ```

- Screenshots and logs are saved in the `tests/selenium/` folder for debugging.
- Update selectors in test scripts if the frontend changes.

#### Test Coverage

- Admin: Registration, login, multi-step company profile, dashboard navigation, user management, logout.
- Recruiter/Candidate: (Extend as needed in `tests/selenium/`.)

#### Best Practices

- Use unique, accessible selectors (e.g., `data-testid`, headings) for reliable automation.
- Add assertions after each navigation step to verify expected content.
- Clean up test data (accounts, profiles) if possible after each run.
- Document new test cases in this section.

### CI/CD Integration (GitHub Actions)

- The workflow `.github/workflows/ci-tests.yml` runs all Selenium tests on every push/PR.
- Steps:
  1. Install Node.js and dependencies
  2. Start the Next.js frontend in the background
  3. (Optional) Start backend API if needed
  4. Wait for the frontend to be ready
  5. Run all Selenium tests in `tests/selenium/`
  6. Report success/failure in the PR/checks

#### Extending the Pipeline

- To add backend/API startup, edit `.github/workflows/ci-tests.yml` and add the necessary steps before running tests.
- To add new test scripts, place them in `tests/selenium/` and ensure they are called in the workflow.

#### Troubleshooting

- If tests fail due to selectors, update the test scripts to match the latest frontend.
- For hydration or rendering errors, check the Next.js console output and logs.
- For CI failures, review the GitHub Actions logs for details.
