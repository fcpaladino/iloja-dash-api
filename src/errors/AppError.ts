class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly errors: any|null;

  constructor(message: string, statusCode = 400, errors: any|null = null) {
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default AppError;
