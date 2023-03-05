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

export class HealthCheckError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    if (!message) {
      message = 'An error occurred checking the health of the envelopes server';
    }
    super(message, options);
  }
}

class Health {
  public static async check(baseUrl: string): Promise<HealthBody> {
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
  bankName: string;
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
      throw new Error('An error occurred fetching plaid link token');
    }
    return response.json();
  }

  public async createItemAccessToken(
    plaidItemAccessTokenRequestBody: PlaidItemAccessTokenRequestBody,
  ): Promise<boolean> {
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

  public async updateItemAccessToken(
    uuid: string,
  ): Promise<PlaidLinkTokenBody> {
    const response: Response = await fetch(
      new URL(
        `${this.resourceUrl}/item/access-token/${uuid}`,
        this.baseUrl,
      ).toString(),
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred updating the item access token');
    }
    return response.json();
  }

  public async resolveUpdateRequired(uuid: string): Promise<boolean> {
    const response: Response = await fetch(
      new URL(
        `${this.resourceUrl}/item/access-token/resolve/${uuid}`,
        this.baseUrl,
      ).toString(),
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(
        'An error occurred resolving the item access token update',
      );
    }
    return true;
  }
}

export type Bank = {
  uuid: string;
  name: string;
  updateRequired: boolean;
  updateRequiredReason: string | null;
};

export type BankWithoutUuid = {
  name: string;
};

class Banks {
  protected baseUrl: string;

  private resourceUrl = 'banks';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async list(): Promise<Array<Bank>> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}`, this.baseUrl).toString(),
      {
        credentials: 'include',
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred listing banks');
    }
    return response.json();
  }

  public async update(
    uuid: string,
    bank: Bank | BankWithoutUuid,
  ): Promise<Bank> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/${uuid}`, this.baseUrl).toString(),
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bank),
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred updating bank');
    }
    return response.json();
  }

  public async delete(uuid: string): Promise<boolean> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/${uuid}`, this.baseUrl).toString(),
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred deleting bank');
    }
    return true;
  }
}

// INFO uuid? means uuid is optional
export type Envelope = {
  uuid?: string;
  name: string;
  planned: number;
  starting: number;
  actual: number;
};

class EnvelopesService {
  protected baseUrl: string;

  private resourceUrl = 'envelopes';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async list(): Promise<Array<Envelope>> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}`, this.baseUrl).toString(),
      {
        credentials: 'include',
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred listing envelopes');
    }
    return response.json();
  }

  public async create(envelope: Envelope): Promise<Envelope> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}`, this.baseUrl).toString(),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelope),
      },
    );

    if (response.status !== 201) {
      throw new Error('An error occurred creating the envelope');
    }
    return response.json();
  }

  public async update(uuid: string, envelope: Envelope): Promise<Envelope> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/${uuid}`, this.baseUrl).toString(),
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelope),
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred updating the envelope');
    }
    return response.json();
  }

  public async delete(uuid: string): Promise<boolean> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}/${uuid}`, this.baseUrl).toString(),
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred deleting envelope');
    }
    return true;
  }
}

export type BalanceGet = {
  current: number;
  available: number;
};

class Balance {
  protected baseUrl: string;

  private resourceUrl = 'balance';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async get(): Promise<BalanceGet> {
    const response: Response = await fetch(
      new URL(`${this.resourceUrl}`, this.baseUrl).toString(),
      {
        credentials: 'include',
      },
    );

    if (response.status !== 200) {
      throw new Error('An error occurred getting balance');
    }
    return response.json();
  }
}

export default class Envelopes {
  public baseUrl: string;

  protected oauthService: OAuth | undefined;

  protected authService: Auth | undefined;

  protected profileService: Profile | undefined;

  protected plaidService: Plaid | undefined;

  protected banksService: Banks | undefined;

  protected balanceService: Balance | undefined;

  protected envelopesService: EnvelopesService | undefined;

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

  public banks() {
    if (this.banksService === undefined) {
      this.banksService = new Banks(this.baseUrl);
    }
    return this.banksService;
  }

  public balance() {
    if (this.balanceService === undefined) {
      this.balanceService = new Balance(this.baseUrl);
    }
    return this.balanceService;
  }

  public envelopes() {
    if (this.envelopesService === undefined) {
      this.envelopesService = new EnvelopesService(this.baseUrl);
    }
    return this.envelopesService;
  }
}
