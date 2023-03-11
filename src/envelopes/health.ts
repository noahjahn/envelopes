type HealthReportBody = {
  displayName: string;
  health: {
    healthy: boolean;
  };
};

type HealthLucidReportBody = HealthReportBody & {
  health: {
    message: string;
  };
  meta: Array<object | undefined>;
};

export type Health = {
  healthy: boolean;
  report: {
    env: HealthReportBody;
    appKey: HealthReportBody;
    lucid: HealthLucidReportBody;
  };
};

export class HealthCheckError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    if (!message) {
      message = 'An error occurred checking the health of the envelopes server';
    }
    super(message, options);
  }
}

export default class HealthHandler {
  public static async check(baseUrl: string): Promise<Health> {
    try {
      const response: Response = await fetch(
        new URL('health', baseUrl).toString(),
        {
          credentials: 'include',
        },
      );

      return response.json();
    } catch {
      throw new HealthCheckError();
    }
  }
}
