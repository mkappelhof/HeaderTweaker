import { describe, expect, it } from 'vitest';
import { getDomain } from './get-domain.helper';

describe('getDomain', () => {
  it('returns the domain and tld without subdomains', () => {
    expect(getDomain('https://www.headertweaker.com')).toBe('headertweaker.com');
    expect(getDomain('https://headertweaker.com/path?query=1')).toBe('headertweaker.com');
    expect(getDomain('https://app.staging.headertweaker.com')).toBe('headertweaker.com');
  });

  it('supports multi-level tlds', () => {
    expect(getDomain('https://www.headertweaker.com.au')).toBe('headertweaker.com.au');
    expect(getDomain('https://headertweaker.com.au')).toBe('headertweaker.com.au');
    expect(getDomain('https://app.headertweaker.co.uk')).toBe('headertweaker.co.uk');
  });

  it('ignores the port', () => {
    expect(getDomain('https://www.headertweaker.com:8080/path')).toBe('headertweaker.com');
  });

  it('falls back to the hostname for localhost and ip addresses', () => {
    expect(getDomain('http://localhost:3000/')).toBe('localhost');
    expect(getDomain('http://127.0.0.1:5173/')).toBe('127.0.0.1');
  });

  it('returns undefined for missing or invalid urls', () => {
    expect(getDomain(undefined)).toBeUndefined();
    expect(getDomain('')).toBeUndefined();
    expect(getDomain('not a url')).toBeUndefined();
  });
});
