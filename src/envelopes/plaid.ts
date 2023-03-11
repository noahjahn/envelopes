import { AbstractResourceHandler } from './resource-handler';

type PlaidLinkTokenBody = {
  expiration: string;
  link_token: string;
  request_id: string;
};

type PlaidItemAccessTokenRequestBody = {
  publicToken: string;
  bankName: string;
};

export default class PlaidHandler extends AbstractResourceHandler {
  constructor(baseUrl: string) {
    super(baseUrl, 'plaid');
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
