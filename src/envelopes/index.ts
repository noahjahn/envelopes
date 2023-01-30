class OAuth {
  protected provider: string;

  protected baseUrl: string;

  constructor(provider: string, baseUrl: string) {
    this.provider = provider;
    this.baseUrl = baseUrl;
  }

  public getRedirectURL(): string {
    return new URL(`oauth/${this.provider}/redirect`, this.baseUrl).toString();
  }
}

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

type HealthBody = {
  healthy: boolean;
  report: {
    env: HealthReportBody;
    appKey: HealthReportBody;
    lucid: HealthLucidReportBody;
  };
};

class Health {
  public static async check(baseUrl: string): Promise<HealthBody> {
    const response: Response = await fetch(
      new URL('health', baseUrl).toString(),
      {
        credentials: 'include',
      },
    );

    return response.json();
  }
}

class User {
  protected baseUrl: string;

  private resourceUrl = 'user';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async isLoggedIn(): Promise<boolean> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/logged-in`, this.baseUrl).toString(),
      {
        credentials: 'include',
      },
    );

    if (response.status === 401) {
      return false;
    }

    return Boolean(response.json());
  }
}

export default class Envelopes {
  protected baseUrl: string;

  protected oauthService: OAuth | undefined;

  protected userService: User | undefined;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public oauth(provider: string) {
    if (this.oauthService === undefined) {
      this.oauthService = new OAuth(provider, this.baseUrl);
    }
    return this.oauthService;
  }

  public health() {
    return Health.check(this.baseUrl);
  }

  public user() {
    if (this.userService === undefined) {
      this.userService = new User(this.baseUrl);
    }
    return this.userService;
  }
}
