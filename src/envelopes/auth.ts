import { AbstractResourceHandler } from './resource-handler';

export default class AuthHandler extends AbstractResourceHandler {
  constructor(baseUrl: string) {
    super(baseUrl, 'auth');
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
