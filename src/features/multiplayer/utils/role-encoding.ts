/**
 * Role Encoding Utilities
 *
 * Encodes and decodes user role for URL parameter preservation.
 * Format: ROLE.TIMESTAMP.HASH
 *
 * Where:
 * - ROLE = base64("host") or base64("member")
 * - TIMESTAMP = base64(Date.now())
 * - HASH = first 8 chars of hash(ROLE + TIMESTAMP + SECRET)
 */

const SECRET = 'wordshot-multiplayer-secret-key-2024';

/**
 * Simple hash function for generating checksum
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
}

/**
 * Encodes a role into a 3-part URL-safe string
 */
export function encodeRole(role: 'host' | 'member'): string {
  const roleBase64 = btoa(role);
  const timestamp = Date.now().toString();
  const timestampBase64 = btoa(timestamp);
  const hash = simpleHash(roleBase64 + timestampBase64 + SECRET);

  return `${roleBase64}.${timestampBase64}.${hash}`;
}

/**
 * Decodes and validates a 3-part encoded role string
 * Returns the role if valid, null if invalid
 */
export function decodeRole(encoded: string): 'host' | 'member' | null {
  try {
    const parts = encoded.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [roleBase64, timestampBase64, providedHash] = parts;

    // Validate hash
    const expectedHash = simpleHash(roleBase64 + timestampBase64 + SECRET);
    if (providedHash !== expectedHash) {
      console.warn('Role hash validation failed');
      return null;
    }

    // Decode role
    const role = atob(roleBase64);
    if (role !== 'host' && role !== 'member') {
      return null;
    }

    // Optional: Check if timestamp is not too old (e.g., 24 hours)
    const timestamp = parseInt(atob(timestampBase64), 10);
    const age = Date.now() - timestamp;
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
    if (age > MAX_AGE) {
      console.warn('Role encoding expired');
      return null;
    }

    return role;
  } catch (error) {
    console.error('Failed to decode role:', error);
    return null;
  }
}

/**
 * Gets the role parameter from current URL
 */
export function getRoleFromURL(): 'host' | 'member' | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('q');
  if (!encoded) {
    return null;
  }
  return decodeRole(encoded);
}

/**
 * Adds role parameter to a URL path
 */
export function addRoleToURL(path: string, role: 'host' | 'member'): string {
  const encoded = encodeRole(role);
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}q=${encoded}`;
}
