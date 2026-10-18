import vercelProjects from '../../api/projects.js';

export default async function handler(request) {
  let status = 200;
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const response = {
    setHeader(name, value) { headers.set(name, value); return this; },
    status(code) { status = code; return this; },
    json(body) { return new Response(JSON.stringify(body), { status, headers }); }
  };

  return vercelProjects({ method: request.method }, response);
}
