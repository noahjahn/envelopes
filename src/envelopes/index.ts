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

class Auth {
  protected baseUrl: string;

  private resourceUrl = 'auth';

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

    if (response.status !== 200) {
      return false;
    }

    return Boolean(response.json());
  }

  public async logout(): Promise<Response> {
    return fetch(
      new URL(`${this.resourceUrl}/logout`, this.baseUrl).toString(),
      {
        credentials: 'include',
      },
    );
  }
}

type ProfileMeBody = {
  uuid: string;
  email: string;
  name: string;
  access_token: string;
  created_at: Date;
  updated_at: Date;
};

class Profile {
  protected baseUrl: string;

  private resourceUrl = 'profile';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async me(): Promise<ProfileMeBody> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/me`, this.baseUrl).toString(),
      {
        credentials: 'include',
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred fetching profile info');
    }
    return response.json();
  }
}

type PlaidLinkTokenBody = {
  expiration: string;
  link_token: string;
  request_id: string;
};

type PlaidItemAccessTokenRequestBody = {
  publicToken: string;
};

class Plaid {
  protected baseUrl: string;

  private resourceUrl = 'plaid';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async linkToken(): Promise<PlaidLinkTokenBody> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/link/token`, this.baseUrl).toString(),
      {
        credentials: 'include',
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred fetching profile info');
    }
    return response.json();
  }

  public async createItemAccessToken(publicToken: string): Promise<boolean> {
    const plaidItemAccessTokenRequestBody: PlaidItemAccessTokenRequestBody = {
      publicToken,
    };

    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/item/access-token`, this.baseUrl).toString(),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plaidItemAccessTokenRequestBody),
      },
    );

    if (response.status !== 201) {
      throw new Error('An error occurred creating the item access token');
    }
    return true;
  }
}

export default class Envelopes {
  protected baseUrl: string;

  protected oauthService: OAuth | undefined;

  protected authService: Auth | undefined;

  protected profileService: Profile | undefined;

  protected plaidService: Plaid | undefined;

  constructor(baseUrl: string) {
    if (baseUrl === '') {
      throw new Error('baseUrl is required to have a value');
    }
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

  public auth() {
    if (this.authService === undefined) {
      this.authService = new Auth(this.baseUrl);
    }
    return this.authService;
  }

  public profile() {
    if (this.profileService === undefined) {
      this.profileService = new Profile(this.baseUrl);
    }
    return this.profileService;
  }

  public plaid() {
    if (this.plaidService === undefined) {
      this.plaidService = new Plaid(this.baseUrl);
    }
    return this.plaidService;
  }
}
