import React, { useState } from 'react';
import { ExternalLink, Star, GitFork, Folder } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PROFILE } from '../data/portfolioData';
import { LANGUAGE_COLORS } from '../services/github';

// Custom descriptions for projects that might have empty GitHub descriptions
const REPO_DESCRIPTIONS = {
  "Vora-3d-Marketplace": "Next-generation immersive 3D digital asset marketplace built with Three.js, React, and TypeScript.",
  "Rivet": "High-performance developer workspace and web interface with modular design.",
  "Jedi-Auto-Hustle-Agent": "Autonomous multi-step task execution agent built in Python for scheduling and intelligent workflow automation.",
  "arcflow": "State-driven interactive workflow orchestrator and reactive interface.",
  "jedi-tele-mention-bot": "Telegram automated mention and broadcast management bot with real-time logging.",
  "home-protocol": "Decentralized protocol and Web3 architecture for property management and community ownership.",
  "Ton-Gecko": "Dynamic Web3 platform on TON blockchain with interactive assets and decentralized functionality.",
  "Pride-DAO": "Decentralized autonomous organization platform focused on community governance and voting in Web3.",
  "event-manager": "Full-stack event scheduling and notification engine.",
  "chat-automator": "Automated conversational agent with scriptable response pipelines."
};

export default function Projects({ repos = [] }) {
  const [filter, setFilter] = useState('all');

  // Filter repos based on selected category
  const filteredRepos = repos.filter(repo => {
    if (filter === 'all') return true;
    if (filter === 'featured') return PROFILE.featuredRepos.includes(repo.name);
    if (filter === 'typescript') return repo.language === 'TypeScript';
    if (filter === 'javascript') return repo.language === 'JavaScript';
    if (filter === 'python') return repo.language === 'Python';
    return true;
  });

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <div>
            <div className="whoami-tag">~ artifacts</div>
            <h2 className="section-title">
              <span className="section-prefix">#</span>
              <span>featured repositories & builds</span>
            </h2>
          </div>
          <span className="section-subtitle">
            {filteredRepos.length} repositories displayed
          </span>
        </div>

        {/* Filter Bar */}
        <div className="projects-filter-bar">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            all ({repos.length})
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`filter-btn ${filter === 'featured' ? 'active' : ''}`}
          >
            ★ featured
          </button>
          <button
            onClick={() => setFilter('typescript')}
            className={`filter-btn ${filter === 'typescript' ? 'active' : ''}`}
          >
            TypeScript
          </button>
          <button
            onClick={() => setFilter('javascript')}
            className={`filter-btn ${filter === 'javascript' ? 'active' : ''}`}
          >
            JavaScript
          </button>
          <button
            onClick={() => setFilter('python')}
            className={`filter-btn ${filter === 'python' ? 'active' : ''}`}
          >
            Python
          </button>
        </div>

        {/* Repositories Grid */}
        <div className="projects-grid">
          {filteredRepos.map(repo => {
            const description = repo.description || REPO_DESCRIPTIONS[repo.name] || 'Open source software and engineering project.';
            const langColor = LANGUAGE_COLORS[repo.language] || '#98c379';

            return (
              <div key={repo.id} className="project-card">
                <div>
                  <div className="project-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Folder size={17} color="var(--accent-green)" />
                      <h3 className="project-name">{repo.name}</h3>
                    </div>
                    <div className="project-links">
                      {repo.homepage && (
                        <a 
                          href={repo.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="project-icon-link"
                          title="Live Demo"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <a 
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="project-icon-link"
                        title="GitHub Repository"
                      >
                        <GithubIcon size={16} />
                      </a>
                    </div>
                  </div>

                  <p className="project-desc" style={{ marginTop: '0.85rem' }}>
                    {description}
                  </p>
                </div>

                <div className="project-footer">
                  <div className="project-lang">
                    {repo.language ? (
                      <>
                        <span 
                          className="lang-dot" 
                          style={{ backgroundColor: langColor }} 
                        />
                        <span>{repo.language}</span>
                      </>
                    ) : (
                      <span>Codebase</span>
                    )}
                  </div>

                  <div className="project-meta">
                    <span className="meta-item" title="Stars">
                      <Star size={13} />
                      <span>{repo.stargazers_count || 0}</span>
                    </span>
                    <span className="meta-item" title="Forks">
                      <GitFork size={13} />
                      <span>{repo.forks_count || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Repositories on GitHub CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <a
            href={`https://github.com/${PROFILE.handle}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.65rem', 
              padding: '0.65rem 1.4rem',
              fontSize: '0.85rem'
            }}
          >
            <GithubIcon size={18} />
            <span>view all repositories on github</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
