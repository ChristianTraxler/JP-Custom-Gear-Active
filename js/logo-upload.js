// Shared logo uploader for every page with a logo file input.
// Sends the chosen file straight to Vercel Blob (client upload), so it never goes
// through a serverless function and the 4.5 MB body limit does not apply.
// The token comes from /api/upload-logo. Browser global: window.LogoUpload.
//
// Usage:
//   const logo = LogoUpload.attach({ input, submitButton, onChange });
//   logo.getUrl()      -> public Blob URL once uploaded, else ''
//   logo.blockReason() -> '' when OK to submit, else a message (uploading / failed)
//   logo.reset()       -> call when the page clears the file input
(function (root) {
  'use strict';

  // Pinned to the same version as package.json. The client entry exports upload().
  const BLOB_CLIENT_URL = 'https://cdn.jsdelivr.net/npm/@vercel/blob@2.8.2/client/+esm';
  const UPLOAD_ENDPOINT = '/api/upload-logo';
  const MAX_BYTES = 10 * 1024 * 1024; // keep in sync with api/upload-logo.js
  const TYPE_BY_EXT = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    pdf: 'application/pdf'
  };
  const ALLOWED_TYPES = Object.values(TYPE_BY_EXT);

  let clientModule = null;
  function loadClient() {
    if (!clientModule) {
      clientModule = import(BLOB_CLIENT_URL).catch(err => {
        clientModule = null; // allow a retry
        throw err;
      });
    }
    return clientModule;
  }

  function extOf(name) {
    const m = /\.([A-Za-z0-9]+)$/.exec(name || '');
    return m ? m[1].toLowerCase() : '';
  }

  // Resolve the content type from the file, falling back to its extension.
  function contentTypeFor(file) {
    if (ALLOWED_TYPES.indexOf(file.type) !== -1) return file.type;
    return TYPE_BY_EXT[extOf(file.name)] || '';
  }

  // logos/<safe-name>; the server adds a random suffix and re-checks the pattern.
  function pathnameFor(file) {
    const ext = extOf(file.name);
    let base = (file.name || 'logo').replace(/\.[A-Za-z0-9]+$/, '')
      .replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'logo';
    return 'logos/' + base + (ext ? '.' + ext : '');
  }

  function validate(file) {
    if (!contentTypeFor(file)) return 'That file type is not supported. Use .png, .jpg or .pdf.';
    if (file.size > MAX_BYTES) return 'That file is too large (max 10 MB).';
    if (file.size === 0) return 'That file is empty.';
    return '';
  }

  // The token endpoint answers with a clear message when uploads are not set up yet.
  // upload() hides it, so ask the endpoint directly after a failure.
  async function explainFailure() {
    try {
      const res = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}'
      });
      if (res.status === 503 || res.status === 429) {
        const data = await res.json();
        if (data && data.error) return data.error;
      }
    } catch (e) { /* offline: fall through to the generic message */ }
    return '';
  }

  function attach(opts) {
    const input = opts.input;
    const submitButton = opts.submitButton || null;
    const onChange = typeof opts.onChange === 'function' ? opts.onChange : function () {};
    const submitLabel = submitButton ? submitButton.querySelector('.cz-submit-text') : null;
    const submitLabelText = submitLabel ? submitLabel.textContent : '';

    // status: 'idle' | 'uploading' | 'done' | 'error'
    const state = { status: 'idle', url: '', error: '', token: 0 };

    const wrap = input.closest('.cz-file-wrap') || input.parentNode;
    const statusEl = document.createElement('div');
    statusEl.className = 'cz-logo-status';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.style.display = 'none';
    wrap.parentNode.insertBefore(statusEl, wrap.nextSibling);

    function render() {
      statusEl.className = 'cz-logo-status cz-logo-status--' + state.status;
      statusEl.textContent = '';
      if (state.status === 'idle') {
        statusEl.style.display = 'none';
      } else {
        statusEl.style.display = 'block';
        const text = document.createElement('span');
        if (state.status === 'uploading') text.textContent = 'Uploading logo… please wait before adding to cart.';
        else if (state.status === 'done') text.textContent = 'Logo uploaded.';
        else text.textContent = state.error;
        statusEl.appendChild(text);
        if (state.status === 'error' && input.files && input.files[0] && !state.fatal) {
          const retry = document.createElement('button');
          retry.type = 'button';
          retry.className = 'cz-logo-retry';
          retry.textContent = 'Retry';
          retry.addEventListener('click', function () { start(input.files[0]); });
          statusEl.appendChild(document.createTextNode(' '));
          statusEl.appendChild(retry);
        }
      }
      if (submitButton) {
        const busy = state.status === 'uploading';
        submitButton.disabled = busy;
        submitButton.setAttribute('aria-disabled', busy ? 'true' : 'false');
        if (submitLabel) submitLabel.textContent = busy ? 'Uploading logo…' : submitLabelText;
      }
      onChange(api);
    }

    async function start(file) {
      const token = ++state.token;
      state.url = '';
      state.error = '';
      state.fatal = false;
      const problem = validate(file);
      if (problem) {
        state.status = 'error';
        state.error = problem;
        state.fatal = true; // retrying the same file cannot help
        render();
        return;
      }
      state.status = 'uploading';
      render();
      try {
        const client = await loadClient();
        const blob = await client.upload(pathnameFor(file), file, {
          access: 'public',
          handleUploadUrl: UPLOAD_ENDPOINT,
          contentType: contentTypeFor(file)
        });
        if (token !== state.token) return; // file was replaced or cleared meanwhile
        state.status = 'done';
        state.url = blob.url;
      } catch (err) {
        if (token !== state.token) return;
        const detail = await explainFailure();
        if (token !== state.token) return;
        state.status = 'error';
        state.error = 'Logo upload failed. ' + (detail || 'Check your connection and retry') +
          (detail ? '' : ', or remove the file.');
      }
      render();
    }

    input.addEventListener('change', function () {
      const file = input.files && input.files[0];
      if (file) start(file);
      else api.reset();
    });

    const api = {
      getUrl: function () { return state.status === 'done' ? state.url : ''; },
      isUploading: function () { return state.status === 'uploading'; },
      blockReason: function () {
        if (state.status === 'uploading') return 'Your logo is still uploading. Please wait a moment.';
        if (state.status === 'error') return 'Your logo did not upload. Retry it or remove the file before continuing.';
        return '';
      },
      reset: function () {
        state.token++; // drop any upload still in flight
        state.status = 'idle';
        state.url = '';
        state.error = '';
        render();
      }
    };

    return api;
  }

  root.LogoUpload = { attach: attach };
})(typeof window !== 'undefined' ? window : globalThis);
