# React + Vite

## Automatic projects

The Projects page reads public repositories from `jedi-dtechmaker` on GitHub. New repos appear after the 15-minute GitHub cache expires. Search covers each repo's name, description, language, and topics.

Live site URLs come from the repository's GitHub Website field. To also discover production sites directly from linked Vercel projects, set `VERCEL_TOKEN` in this portfolio's Netlify environment variables and redeploy once. If the projects belong to a Vercel team, also set `VERCEL_TEAM_ID`. The token is only used by the server-side `/api/projects` function; it is never sent to the browser. Vercel results are cached for 15 minutes. Without the token, GitHub Website links still work.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
