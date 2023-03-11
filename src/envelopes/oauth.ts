import { AbstractResourceHandler } from './resource-handler';

export default class OAuthHandler extends AbstractResourceHandler {
  protected provider: string;

  constructor(baseUrl: string, provider: string) {
    super(baseUrl, 'oauth');
    this.provider = provider;
  }

  public getRedirectURL(): string {
    return new URL(
      `${this.resourceUrl}/${this.provider}/redirect`,
      this.baseUrl,
    ).toString();
  }
}
