/**
 * Represents error that occurs when the database returns Null and a value is needed to be returned
 */
export default class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
