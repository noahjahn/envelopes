import { AbstractResourceHandler, ResourceHandler } from './resource-handler';

export type Bank = {
  uuid?: string;
  name: string;
  updateRequired?: boolean;
  updateRequiredReason?: string | null;
};

export default class BanksHandler
  extends AbstractResourceHandler
  implements ResourceHandler
{
  constructor(baseUrl: string) {
    super(baseUrl, 'banks');
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

  public async create(bank: Bank): Promise<Bank> {
    // TODO: implement
    return bank;
  }

  public async update(uuid: string, bank: Bank): Promise<Bank> {
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
