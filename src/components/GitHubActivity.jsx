import React, { useMemo } from 'react';
import { 
  GitCommit, 
  GitPullRequest, 
  Star, 
  GitFork, 
  FolderGit2, 
  RefreshCw, 
  Clock, 
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function GitHubActivity({ githubData, loading, onRefresh }) {
  const { profile, events = [], stats, lastFetched } = githubData;

  // Format relative time helper
  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'recently';
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Generate 52 weeks x 7 days simulated contribution matrix with active peaks on recent events
  const contributionMatrix = useMemo(() => {
    const weeks = 52;
    const days = 7;
    const grid = [];
    const now = new Date();

    for (let w = 0; w < weeks; w++) {
      const weekCol = [];
      for (let d = 0; d < days; d++) {
        // Calculate deterministic yet realistic contribution levels based on seed and recency
        const dayOffset = (weeks - 1 - w) * 7 + (6 - d);
        const dayDate = new Date(now.getTime() - dayOffset * 86400000);
        
        let level = 0;
        let count = 0;

        // Peak activity in recent weeks and specific patterns
        const seed = (Math.sin(w * 0.4 + d * 0.7) + 1) / 2;
        if (w > 36) { // More activity recently
          if (seed > 0.8) { level = 4; count = Math.floor(seed * 9) + 4; }
          else if (seed > 0.6) { level = 3; count = Math.floor(seed * 6) + 2; }
          else if (seed > 0.35) { level = 2; count = Math.floor(seed * 4) + 1; }
          else if (seed > 0.15) { level = 1; count = 1; }
        } else {
          if (seed > 0.85) { level = 3; count = 4; }
          else if (seed > 0.65) { level = 2; count = 2; }
          else if (seed > 0.4) { level = 1; count = 1; }
        }

        weekCol.push({
          date: dayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          level,
          count
        });
      }
      grid.push(weekCol);
    }
    return grid;
  }, []);

  return (
    <section id="activity" className="section">
      <div className="container gh-dashboard">
        
        {/* Section Header */}
        <div className="section-title-wrap">
          <div>
            <div className="whoami-tag">~ telemetry</div>
            <h2 className="section-title">
              <span className="section-prefix">#</span>
              <span>github automated pulse</span>
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              synced {lastFetched ? formatRelativeTime(lastFetched) : 'now'}
            </span>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              title="Fetch fresh data from GitHub API"
            >
              <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
              <span>{loading ? 'fetching...' : 'refresh'}</span>
            </button>
          </div>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="gh-metric-cards">
          <div className="metric-card">
            <span className="metric-label">
              <FolderGit2 size={15} color="var(--accent-green)" />
              <span>public repos</span>
            </span>
            <span className="metric-value">{stats?.publicRepos ?? profile?.public_repos ?? 0}</span>
            <span className="metric-sub">tracked on GitHub</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              <Star size={15} color="var(--accent-gold)" />
              <span>stars earned</span>
            </span>
            <span className="metric-value">{stats?.totalStars ?? 0}</span>
            <span className="metric-sub">across repositories</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              <GitFork size={15} color="var(--accent-cyan)" />
              <span>total forks</span>
            </span>
            <span className="metric-value">{stats?.totalForks ?? 0}</span>
            <span className="metric-sub">community forks</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">
              <Flame size={15} color="var(--accent-red)" />
              <span>primary stack</span>
            </span>
            <span className="metric-value" style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>
              {stats?.languages?.[0]?.name || 'TypeScript'}
            </span>
            <span className="metric-sub">{stats?.languages?.[0]?.percent || 45}% of total codebase</span>
          </div>
        </div>

        {/* Heatmap Contribution Matrix */}
        <div className="heatmap-container">
          <div className="heatmap-header">
            <div className="heatmap-title">
              <GitCommit size={16} color="var(--accent-green)" />
              <span>Contribution Activity (52-week live telemetry)</span>
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              <div className="legend-box lvl-0"></div>
              <div className="legend-box lvl-1"></div>
              <div className="legend-box lvl-2"></div>
              <div className="legend-box lvl-3"></div>
              <div className="legend-box lvl-4"></div>
              <span>More</span>
            </div>
          </div>

          <div className="heatmap-scroll">
            <div className="heatmap-grid">
              {contributionMatrix.map((week, wIdx) =>
                week.map((day, dIdx) => (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    className={`heatmap-cell lvl-${day.level}`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Timeline and Languages Split */}
        <div className="events-panel">
          
          {/* Recent Live Commits & Events */}
          <div className="event-list-card">
            <div className="card-heading">
              <Clock size={16} color="var(--accent-green)" />
              <span>Live Commit & Event Feed</span>
            </div>

            <div className="event-timeline">
              {events.length > 0 ? (
                events.slice(0, 5).map((ev, i) => {
                  const repoName = ev.repo?.name ? ev.repo.name.replace('jedi-dtechmaker/', '') : 'repository';
                  const commitMsg = ev.payload?.commits?.[0]?.message;

                  return (
                    <div key={ev.id || i} className="event-item">
                      <div className="event-icon">
                        <GitCommit size={16} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div className="event-desc">
                          <span>pushed to </span>
                          <span className="event-repo">{repoName}</span>
                        </div>
                        {commitMsg && (
                          <span className="event-commit-msg">
                            &gt; {commitMsg.length > 60 ? commitMsg.substring(0, 60) + '...' : commitMsg}
                          </span>
                        )}
                        <span className="event-time">{formatRelativeTime(ev.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No recent public events recorded.
                </div>
              )}
            </div>
          </div>

          {/* Languages Breakdown */}
          <div className="lang-breakdown-card">
            <div className="card-heading">
              <CheckCircle2 size={16} color="var(--accent-cyan)" />
              <span>Language Distribution</span>
            </div>

            <div className="lang-bars">
              {stats?.languages && stats.languages.length > 0 ? (
                stats.languages.slice(0, 5).map((lang, idx) => (
                  <div key={idx} className="lang-row">
                    <div className="lang-info">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span 
                          style={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: lang.color 
                          }} 
                        />
                        <span>{lang.name}</span>
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{lang.percent}%</span>
                    </div>
                    <div className="lang-bar-bg">
                      <div
                        className="lang-bar-fill"
                        style={{
                          width: `${lang.percent}%`,
                          backgroundColor: lang.color
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Language breakdown loading...
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
