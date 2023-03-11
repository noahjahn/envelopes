import { AbstractResourceHandler } from './resource-handler';

export type Profile = {
  uuid: string;
  email: string;
  name: string;
  access_token: string;
  created_at: Date;
  updated_at: Date;
};

export default class ProfileHandler extends AbstractResourceHandler {
  constructor(baseUrl: string) {
    super(baseUrl, 'profile');
  }

  public async me(): Promise<Profile> {
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
