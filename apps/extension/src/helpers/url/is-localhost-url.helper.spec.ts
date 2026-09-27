import { describe, expect, it } from 'vitest';
import { isLocalhostUrl } from './is-localhost-url.helper';

describe('isLocalhostUrl', () => {
  it('matches localhost and its subdomains', () => {
    expect(isLocalhostUrl('http://localhost/')).toBe(true);
    expect(isLocalhostUrl('http://localhost:3000/path')).toBe(true);
    expect(isLocalhostUrl('https://app.localhost:8080/path')).toBe(true);
  });

  it('matches loopback addresses', () => {
    expect(isLocalhostUrl('http://127.0.0.1:5173/')).toBe(true);
    expect(isLocalhostUrl('http://[::1]:8080/')).toBe(true);
  });

  it('does not match non-localhost hosts', () => {
    expect(isLocalhostUrl('https://example.com/')).toBe(false);
    expect(isLocalhostUrl('https://notlocalhost.com/')).toBe(false);
    expect(isLocalhostUrl('https://localhost.example.com/')).toBe(false);
  });

  it('returns false for invalid urls', () => {
    expect(isLocalhostUrl('not a url')).toBe(false);
    expect(isLocalhostUrl('')).toBe(false);
  });
});
