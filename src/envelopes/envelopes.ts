import { AbstractResourceHandler, ResourceHandler } from './resource-handler';

// INFO uuid? means uuid is optional
export type Envelope = {
  uuid?: string;
  name: string;
  planned: number;
  starting: number;
  actual: number;
};

export default class EnvelopesHandler
  extends AbstractResourceHandler
  implements ResourceHandler
{
  constructor(baseUrl: string) {
    super(baseUrl, 'envelopes');
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
