import { trimData } from '@/app/utils/trim-data';

describe('trimData', () => {
  it('should trim leading and trailing spaces from string values', () => {
    const input = {
      name: '  John Doe  ',
      email: '  johndoe@example.com  ',
      username: '  jdoe  ',
    };

    const expectedOutput = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'jdoe',
    };

    const result = trimData(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should not modify values that are already trimmed', () => {
    const input = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'jdoe',
    };

    const result = trimData(input);

    expect(result).toEqual(input);
  });

  it('should handle an empty object', () => {
    const input = {};
    const result = trimData(input);
    expect(result).toEqual({});
  });

  it('should return a new object and not mutate the input object', () => {
    const input = {
      name: '  Jane Doe  ',
    };

    const result = trimData(input);

    expect(input).toEqual({ name: '  Jane Doe  ' });
    expect(result).toEqual({ name: 'Jane Doe' });
  });
});
