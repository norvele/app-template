type Params =
  | {
      message: string;
      code?: string;
    }
  | {
      message?: string;
      code: string;
    };

export class ServiceError extends Error {
  initialError: Error | undefined;
  code: string | undefined;

  constructor(params: Params, initialError?: Error) {
    super(params.message);
    this.initialError = initialError;
    this.code = params.code;
  }
}
