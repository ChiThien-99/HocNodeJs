// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as SentryNode from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
SentryNode.init({
  dsn: "https://c452ae28ac1b6d587fac9e46bf4412a4@o4511743489540096.ingest.us.sentry.io/4511748138991616",
  integrations: [nodeProfilingIntegration()],

  // Send structured logs to Sentry
  enableLogs: true,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is evaluated only once per SDK.init call
  profileSessionSampleRate: 1.0,
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: "trace",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    userInfo: false,
    httpBodies: [],
  },
});

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
SentryNode.startSpan(
  {
    name: "My Span",
  },
  () => {
    // The code executed here will be profiled
  },
);
import * as SentryBrowser from "@sentry/browser";

SentryBrowser.init({
  dsn: "https://89e39a930eb765b292bd72b18917188a@o4511743489540096.ingest.us.sentry.io/4511748271833088",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/configuration/options/#dataCollection
    userInfo: false,
    httpBodies: []
  }
});
console.log("Sentry đã chạy thành công");
