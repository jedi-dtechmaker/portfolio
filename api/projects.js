const GITHUB_OWNER = 'jedi-dtechmaker';

function httpsUrl(value) {
  if (!value) return null;
  const candidate = typeof value === 'string' ? value : value.domain || value.name;
  if (!candidate) return null;
  try {
    const url = new URL(candidate.startsWith('http') ? candidate : `https://${candidate}`);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function productionUrl(project) {
  const deployments = [
    ...(project.latestDeployments || []),
    project.targets?.production
  ].filter(Boolean);
  const deployment = deployments.find(item =>
    item.target === 'production' &&
    (item.readyState === 'READY' || item.state === 'READY')
  );
  if (!deployment) return null;

  const candidates = [
    deployment.aliasFinal,
    ...(deployment.alias || []),
    ...(project.alias || []),
    deployment.url
  ];
  return candidates.map(httpsUrl).find(Boolean) || null;
}

export function mapVercelProjects(projects) {
  const byRepoId = {};
  const byRepoName = {};

  for (const project of projects) {
    const link = project.link;
    if (link?.type !== 'github' || !link.repo) continue;

    const parts = link.repo.split('/');
    const owner = (parts.length > 1 ? parts[0] : link.org || '').toLowerCase();
    const repoName = parts.at(-1)?.toLowerCase();
    if (owner !== GITHUB_OWNER || !repoName) continue;

    const url = productionUrl(project);
    if (!url) continue;
    byRepoName[repoName] = url;
    if (link.repoId) byRepoId[String(link.repoId)] = url;
  }

  return { byRepoId, byRepoName };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.VERCEL_TOKEN;
  if (!token) return res.status(200).json({ byRepoId: {}, byRepoName: {} });

  try {
    const projects = [];
    let from;

    for (let page = 0; page < 10; page += 1) {
      const url = new URL('https://api.vercel.com/v10/projects');
      url.searchParams.set('limit', '100');
      if (process.env.VERCEL_TEAM_ID) url.searchParams.set('teamId', process.env.VERCEL_TEAM_ID);
      if (from) url.searchParams.set('from', String(from));

      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(`Vercel API returned ${response.status}`);
      const data = await response.json();
      projects.push(...(Array.isArray(data) ? data : data.projects || []));
      from = data.pagination?.next;
      if (!from) break;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json(mapVercelProjects(projects));
  } catch (error) {
    console.error('Vercel project sync failed:', error);
    return res.status(502).json({ error: 'Project sync unavailable' });
  }
}
