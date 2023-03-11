import AuthHandler from './auth';
import BalanceHandler from './balance';
import BanksHandler from './banks';
import EnvelopesHandler from './envelopes';
import HealthHandler from './health';
import OAuthHandler from './oauth';
import PlaidHandler from './plaid';
import ProfileHandler from './profile';

export default class Envelopes {
  public baseUrl: string;

  private _oauthHandler: OAuthHandler | undefined;

  private _authHandler: AuthHandler | undefined;

  private _profileHandler: ProfileHandler | undefined;

  private _plaidHandler: PlaidHandler | undefined;

  private _banksHandler: BanksHandler | undefined;

  private _balanceHandler: BalanceHandler | undefined;

  private _envelopesHandler: EnvelopesHandler | undefined;

  constructor(baseUrl: string) {
    if (baseUrl === '') {
      throw new Error('baseUrl is required to have a value');
    }
    this.baseUrl = baseUrl;
  }

  get auth() {
    if (this._authHandler === undefined) {
      this._authHandler = new AuthHandler(this.baseUrl);
    }
    return this._authHandler;
  }

  get banks() {
    if (this._banksHandler === undefined) {
      this._banksHandler = new BanksHandler(this.baseUrl);
    }
    return this._banksHandler;
  }

  get balance() {
    if (this._balanceHandler === undefined) {
      this._balanceHandler = new BalanceHandler(this.baseUrl);
    }
    return this._balanceHandler;
  }

  get envelopes() {
    if (this._envelopesHandler === undefined) {
      this._envelopesHandler = new EnvelopesHandler(this.baseUrl);
    }
    return this._envelopesHandler;
  }

  public health() {
    return HealthHandler.check(this.baseUrl);
  }

  public oauth(provider: string) {
    if (this._oauthHandler === undefined) {
      this._oauthHandler = new OAuthHandler(this.baseUrl, provider);
    }
    return this._oauthHandler;
  }

  get plaid() {
    if (this._plaidHandler === undefined) {
      this._plaidHandler = new PlaidHandler(this.baseUrl);
    }
    return this._plaidHandler;
  }

  get profile() {
    if (this._profileHandler === undefined) {
      this._profileHandler = new ProfileHandler(this.baseUrl);
    }
    return this._profileHandler;
  }
}
