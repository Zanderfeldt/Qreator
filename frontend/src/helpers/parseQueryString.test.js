import parseQueryString from './parseQueryString'; 

describe('parseQueryString', () => {
  it('should return an empty object for URLs without query strings', () => {
    const url = 'https://example.com';
    const result = parseQueryString(url);
    expect(result).toEqual({});
  });

  it('should correctly parse a simple query string', () => {
    const url = 'https://example.com?key1=value1&key2=value2';
    const result = parseQueryString(url);
    expect(result).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should correctly handle URL-encoded values', () => {
    const url = 'https://example.com?key=value%20with%20spaces';
    const result = parseQueryString(url);
    expect(result).toEqual({ key: 'value with spaces' });
  });

  it('should handle multiple key-value pairs', () => {
    const url = 'https://example.com?key1=value1&key2=value2&key3=value3';
    const result = parseQueryString(url);
    expect(result).toEqual({ key1: 'value1', key2: 'value2', key3: 'value3' });
  });
});
