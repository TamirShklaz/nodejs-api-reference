export class InvalidBodyError extends Error {
  status: number;
  details: string;

  constructor(message: string, details: string) {
    super(message);
    this.name = "InvalidBodyError";
    this.status = 400;
    this.details = details;
  }
}
