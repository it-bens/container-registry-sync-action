export class Repository {
  constructor(
    public readonly organisation: string,
    public readonly name: string
  ) {}

  public repository(): string {
    return `${this.organisation}/${this.name}`
  }
}
