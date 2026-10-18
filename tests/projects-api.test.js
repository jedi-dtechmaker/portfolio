import assert from 'node:assert/strict';
import test from 'node:test';
import handler, { mapVercelProjects } from '../api/projects.js';
import netlifyHandler from '../netlify/functions/projects.js';

const readyProject = (repo, repoId, url) => ({
  link: { type: 'github', repo, repoId },
  latestDeployments: [{ target: 'production', readyState: 'READY', aliasFinal: url }]
});

test('maps only ready production sites linked to the portfolio owner', () => {
  const result = mapVercelProjects([
    readyProject('jedi-dtechmaker/New-App', 123, 'new-app.vercel.app'),
    readyProject('another-user/New-App', 456, 'other.vercel.app'),
    {
      link: { type: 'github', repo: 'jedi-dtechmaker/Unready', repoId: 789 },
      latestDeployments: [{ target: 'production', readyState: 'ERROR', url: 'broken.vercel.app' }]
    },
    {
      link: { type: 'github', repo: 'jedi-dtechmaker/Preview', repoId: 987 },
      latestDeployments: [{ target: 'preview', readyState: 'READY', url: 'preview.vercel.app' }]
    }
  ]);

  assert.deepEqual(result, {
    byRepoId: { '123': 'https://new-app.vercel.app/' },
    byRepoName: { 'new-app': 'https://new-app.vercel.app/' }
  });
});

test('server function paginates Vercel projects without exposing the token', async () => {
  const originalToken = process.env.VERCEL_TOKEN;
  const originalFetch = globalThis.fetch;
  const requests = [];
  process.env.VERCEL_TOKEN = 'test-secret';
  globalThis.fetch = async (url, options) => {
    requests.push({ url: String(url), authorization: options.headers.Authorization });
    return {
      ok: true,
      json: async () => requests.length === 1
        ? { projects: [readyProject('jedi-dtechmaker/First', 1, 'first.vercel.app')], pagination: { next: 42 } }
        : { projects: [readyProject('jedi-dtechmaker/Second', 2, 'second.vercel.app')], pagination: {} }
    };
  };
  const response = {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };

  try {
    await handler({ method: 'GET' }, response);
    assert.equal(response.statusCode, 200);
    assert.equal(requests.length, 2);
    assert.match(requests[1].url, /from=42/);
    assert.equal(requests[0].authorization, 'Bearer test-secret');
    assert.equal(response.body.byRepoName.first, 'https://first.vercel.app/');
    assert.equal(response.body.byRepoName.second, 'https://second.vercel.app/');
    assert.doesNotMatch(JSON.stringify(response.body), /test-secret/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.VERCEL_TOKEN;
    else process.env.VERCEL_TOKEN = originalToken;
  }
});

test('server function returns an empty lookup when no token is configured', async () => {
  const originalToken = process.env.VERCEL_TOKEN;
  delete process.env.VERCEL_TOKEN;
  const response = {
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };

  try {
    await handler({ method: 'GET' }, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { byRepoId: {}, byRepoName: {} });
  } finally {
    if (originalToken !== undefined) process.env.VERCEL_TOKEN = originalToken;
  }
});

test('Netlify function serves the same JSON response without a token', async () => {
  const originalToken = process.env.VERCEL_TOKEN;
  delete process.env.VERCEL_TOKEN;

  try {
    const response = await netlifyHandler(new Request('https://example.com/api/projects'));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/json');
    assert.deepEqual(await response.json(), { byRepoId: {}, byRepoName: {} });
  } finally {
    if (originalToken !== undefined) process.env.VERCEL_TOKEN = originalToken;
  }
});
