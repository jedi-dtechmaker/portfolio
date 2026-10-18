import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ExternalLink, FolderGit2, Monitor, Code2, Search, X } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PROFILE } from '../data/portfolioData';
import { FALLBACK_DATA, LANGUAGE_COLORS } from '../services/github';

const REPO_DESCRIPTIONS = {
  'Vora-3d-Marketplace': 'Immersive 3D digital asset marketplace built with Three.js, React, and TypeScript.',
  Rivet: 'Developer workspace and web interface with a modular design.',
  'Jedi-Auto-Hustle-Agent': 'Task execution agent for scheduling and workflow automation.',
  arcflow: 'Interactive workflow interface with reactive state management.',
  'jedi-tele-mention-bot': 'Telegram mention and broadcast management bot.',
  'home-protocol': 'Web3 property management and community ownership platform.'
};

const knownHomepages = Object.fromEntries(
  FALLBACK_DATA.repos.filter(repo => repo.homepage).map(repo => [repo.name.toLowerCase(), repo.homepage])
);

function liveUrl(repo, deployments) {
  const candidate = repo.homepage || deployments.byRepoId[String(repo.id)] ||
    deployments.byRepoName[repo.name.toLowerCase()] || knownHomepages[repo.name.toLowerCase()];
  try {
    const url = new URL(candidate);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export default function Projects({ repos = [] }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [deployments, setDeployments] = useState({ byRepoId: {}, byRepoName: {} });

  useEffect(() => {
    if (import.meta.env.DEV) return;
    const controller = new AbortController();
    fetch('/api/projects', { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (data?.byRepoId && data?.byRepoName) setDeployments(data);
      })
      .catch(error => {
        if (error.name !== 'AbortError') console.warn('Vercel projects unavailable:', error);
      });
    return () => controller.abort();
  }, []);

  const projects = repos
    .filter(repo => repo.name?.toLowerCase() !== 'portfolio')
    .map(repo => ({ ...repo, liveUrl: liveUrl(repo, deployments) }));
  const liveCount = projects.filter(repo => repo.liveUrl).length;
  const search = query.trim().toLowerCase();
  const visible = projects.filter(repo => {
    const matchesFilter = filter === 'live' ? Boolean(repo.liveUrl)
      : filter === 'source' ? !repo.liveUrl : true;
    const searchable = [repo.name, repo.description, repo.language, ...(repo.topics || [])]
      .filter(Boolean).join(' ').toLowerCase();
    return matchesFilter && searchable.includes(search);
  }).sort((a, b) => Number(Boolean(b.liveUrl)) - Number(Boolean(a.liveUrl)));

  return (
    <section id="projects" className="section projects-page">
      <div className="container">
        <div className="projects-page-heading">
          <div>
            <div className="whoami-tag">~ /projects</div>
            <h1 className="section-title"><span className="section-prefix">#</span> projects</h1>
            <p className="projects-page-intro">Explore the live interfaces and code behind my work.</p>
          </div>
          <span className="section-subtitle">{liveCount} live builds / {projects.length} projects</span>
        </div>

        <div className="projects-toolbar">
          <div className="projects-filter-bar" aria-label="Project filter">
            {[
              ['all', `all (${projects.length})`],
              ['live', `live sites (${liveCount})`],
              ['source', `source only (${projects.length - liveCount})`]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`filter-btn ${filter === value ? 'active' : ''}`}
                aria-pressed={filter === value}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="projects-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
            />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" title="Clear search"><X size={15} /></button>}
          </div>
        </div>

        <div className="projects-showcase-grid">
          {visible.map(repo => (
            <article key={repo.id} className="showcase-item">
              <div className="showcase-preview">
                {repo.liveUrl ? (
                  <>
                    <div className="showcase-browser-bar" aria-hidden="true">
                      <span className="showcase-browser-dots"><i /><i /><i /></span>
                      <span className="showcase-browser-url">{new URL(repo.liveUrl).hostname}</span>
                      <ArrowUpRight size={14} />
                    </div>
                    <div className="showcase-screen">
                      <div className="showcase-preview-fallback"><Monitor size={28} /><span>live preview</span></div>
                      <iframe
                        src={repo.liveUrl}
                        title={`${repo.name} live frontend preview`}
                        loading="lazy"
                        tabIndex={-1}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <a className="showcase-preview-link" href={repo.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${repo.name} live site`} />
                  </>
                ) : (
                  <div className="showcase-source-preview">
                    <Code2 size={32} />
                    <span>source code</span>
                  </div>
                )}
              </div>

              <div className="showcase-details">
                <div className="showcase-title-row">
                  <h2>{repo.name}</h2>
                  <span className="showcase-language">
                    <span className="lang-dot" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#98c379' }} />
                    {repo.language || 'Codebase'}
                  </span>
                </div>
                <p>{repo.description || REPO_DESCRIPTIONS[repo.name] || 'Open source software and engineering project.'}</p>
                <div className="showcase-actions">
                  {repo.liveUrl && (
                    <a href={repo.liveUrl} target="_blank" rel="noopener noreferrer" className="showcase-action-primary">
                      <ExternalLink size={16} /> Visit site
                    </a>
                  )}
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="showcase-action-secondary">
                    <GithubIcon size={16} /> View code
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && <p className="projects-empty">No projects match your search.</p>}

        <a className="projects-github-link" href={`https://github.com/${PROFILE.handle}?tab=repositories`} target="_blank" rel="noopener noreferrer">
          <FolderGit2 size={17} /> All repositories on GitHub <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}
