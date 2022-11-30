import NotFoundError from './NotFoundError';
import UndefinedError from './UndefinedError';

describe('DatabaseErrors', () => {
  describe('NotFoundError', () => {
    it('Throws an Error', () => {
      expect(() => {
        throw new NotFoundError('Test');
      }).toThrowError();
    });
    it('Sets the name and message', () => {
      const error = new NotFoundError('Test');
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe('Test');
    });
  });

  describe('UndefinedError', () => {
    it('Throws an Error', () => {
      expect(() => {
        throw new UndefinedError('Test');
      }).toThrowError();
    });
    it('Sets the name and message', () => {
      const error = new UndefinedError('Test');
      expect(error.name).toBe('UndefinedError');
      expect(error.message).toBe('Test');
    });
  });
});
