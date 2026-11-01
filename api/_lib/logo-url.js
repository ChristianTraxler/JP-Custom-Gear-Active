'use strict';

// Customer-uploaded logos live in Vercel Blob (see api/upload-logo.js). Cart data comes
// from the browser, so a "Logo URL" is only trusted when it points at our Blob store
// host. Anything else is dropped rather than emailed to the shop owner.
const BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com';
const MAX_URL_LENGTH = 400;

// Returns the normalized URL string, or '' when the value is not an allowed Blob URL.
function sanitizeLogoUrl(value) {
  if (typeof value !== 'string' || !value || value.length > MAX_URL_LENGTH) return '';
  let u;
  try { u = new URL(value); } catch { return ''; }
  if (u.protocol !== 'https:') return '';
  if (u.username || u.password || u.port) return '';
  if (!u.hostname.toLowerCase().endsWith(BLOB_HOST_SUFFIX)) return '';
  if (u.hostname.length <= BLOB_HOST_SUFFIX.length) return '';
  if (!u.pathname.startsWith('/logos/')) return '';
  return u.toString();
}

function isInlineImageUrl(url) {
  try { return /\.(png|jpe?g)$/i.test(new URL(url).pathname); }
  catch { return false; }
}

module.exports = { sanitizeLogoUrl, isInlineImageUrl, BLOB_HOST_SUFFIX };
