'use strict';

const { handleUpload } = require('@vercel/blob/client');

const ALLOWED_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
// Letters, digits, dot, dash, underscore only, after the logos/ prefix.
const SAFE_PATHNAME = /^logos\/[A-Za-z0-9._-]{1,120}$/;

// Vercel Blob client-upload token endpoint. The browser (js/logo-upload.js) calls this
// to get a short-lived token, then uploads the file straight to Blob, so the file never
// passes through this function and the 4.5 MB body limit does not apply.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('upload-logo: BLOB_READ_WRITE_TOKEN is not set (create a Blob store in the Vercel project).');
    return res.status(503).json({
      error: 'Logo upload is not available right now. Please add your order without the file and email it to us after checkout.'
    });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!SAFE_PATHNAME.test(pathname)) {
          throw new Error('Invalid file name.');
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true
        };
      }
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error('upload-logo failed:', err);
    return res.status(400).json({ error: (err && err.message) || 'Upload could not be started.' });
  }
};

