'use strict';

// Customer-uploaded logos live in Vercel Blob (see api/upload-logo.js). Cart data comes
// from the browser, so a "Logo URL" is only trusted when it points at OUR Blob store:
// https, the exact public host of the store behind BLOB_READ_WRITE_TOKEN, and a /logos/
// path. Anything else is dropped rather than emailed to the shop owner. With no token
// configured, every logo URL is rejected.
const BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com';
const MAX_URL_LENGTH = 400;

// Token format: vercel_blob_rw_<storeId>_<secret>. The public host is
// <storeid lowercased>.public.blob.vercel-storage.com (same as @vercel/blob's
// constructBlobUrl). Read at call time so the env can change between calls (tests).
function ownBlobHost() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (typeof token !== 'string' || !token) return '';
  const parts = token.split('_');
  const storeId = parts[3] || '';
  if (parts[0] !== 'vercel' || parts[1] !== 'blob' || !/^[A-Za-z0-9]+$/.test(storeId)) return '';
  return storeId.toLowerCase() + BLOB_HOST_SUFFIX;
}

// Returns the normalized URL string, or '' when the value is not an allowed Blob URL.
function sanitizeLogoUrl(value) {
  if (typeof value !== 'string' || !value || value.length > MAX_URL_LENGTH) return '';
  const host = ownBlobHost();
  if (!host) return '';
  let u;
  try { u = new URL(value); } catch { return ''; }
  if (u.protocol !== 'https:') return '';
  if (u.username || u.password || u.port) return '';
  if (u.hostname.toLowerCase() !== host) return '';
  if (!u.pathname.startsWith('/logos/')) return '';
  if (u.search || u.hash) return '';
  return u.toString();
}

function isInlineImageUrl(url) {
  try { return /\.(png|jpe?g)$/i.test(new URL(url).pathname); }
  catch { return false; }
}

module.exports = { sanitizeLogoUrl, isInlineImageUrl, ownBlobHost, BLOB_HOST_SUFFIX };
