class OAuth {
  protected provider: string;

  protected baseUrl: string;

  constructor(provider: string, baseUrl: string) {
    this.provider = provider;
    this.baseUrl = baseUrl;
  }

  public getRedirectURL(): string {
    return (new URL(
      `oauth/${this.provider}/redirect`,
      this.baseUrl,
    )).toString();
  }
}

export default class Envelopes {
  protected baseUrl: string;

  protected oauthService: OAuth | undefined;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public oauth(provider: string) {
    this.oauthService = new OAuth(provider, this.baseUrl);
    return this.oauthService;
  }
}
