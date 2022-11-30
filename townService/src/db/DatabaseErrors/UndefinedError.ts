/**
 * Represents error that occurs when the database returns Undefined and a value is needed to be returned
 */
export default class UndefinedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UndefinedError';
  }
}
