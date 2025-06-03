import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./locales";

const SENTRY_TRACING_ORIGIN = `https://${window.location.hostname}`;
const SENTRY_URL = import.meta.env.REACT_APP_SENTRY_URL;

Sentry.init({
  dsn: SENTRY_URL,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", SENTRY_TRACING_ORIGIN],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
