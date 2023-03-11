export interface ResourceHandler {
  list(): Promise<Array<unknown>>;
  create(resource: unknown): Promise<unknown>;
  update(uuid: string, resource: unknown): Promise<unknown>;
  delete(uuid: string): Promise<boolean>;
}

export abstract class AbstractResourceHandler {
  protected baseUrl: string;
  protected resourceUrl: string;

  constructor(baseUrl: string, resourceUrl: string) {
    this.baseUrl = baseUrl;
    this.resourceUrl = resourceUrl;
  }
}
