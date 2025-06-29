import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "ical-party",
    instrumentationConfig: {
      fetch: {
        // By default the context is only propagated for the deployment URLs, all other URLs should be enabled explicitly in the list by string prefix or regex.
        propagateContextUrls: [/.*/],
      },
    },
  });
}
