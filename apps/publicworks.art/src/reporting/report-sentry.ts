import * as Sentry from "@sentry/browser";

export const reportSentryException = (err: any, msg?: string) => {
  Sentry.captureException(err, {
    tags: {
      from: "manual-reporting",
      message: msg,
    },
  });
};
