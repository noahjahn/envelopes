import { AbstractResourceHandler } from './resource-handler';

export type Balance = {
  current: number;
  available: number;
};

export default class BalanceHandler extends AbstractResourceHandler {
  constructor(baseUrl: string) {
    super(baseUrl, 'balance');
  }

  public async get(): Promise<Balance> {
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
