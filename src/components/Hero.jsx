import React, { useState } from 'react';
import { 
  Mail, 
  FileText, 
  Calendar, 
  Play, 
  ExternalLink,
  Send
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, XIcon } from './Icons';
import { PROFILE } from '../data/portfolioData';
import InteractiveAvatar from './InteractiveAvatar';

export default function Hero({ onOpenContact, onOpenResume }) {
  const [activeTab, setActiveTab] = useState('avatar'); // 'avatar' | 'coding'
  const [isStampToggled, setIsStampToggled] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { cmd: 'cat current_focus.txt', out: 'Architecting high-scale full-stack apps & AI workflow agents.' },
    { cmd: 'uptime', out: 'coding for 5+ years without kernel panic' }
  ]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim().toLowerCase();
    let out = '';
    if (cmd === 'help') {
      out = 'Available: whoami, bio, experience, education, skills, repos, cv, clear';
    } else if (cmd === 'whoami') {
      out = `${PROFILE.fullName} (@${PROFILE.handle}) – ${PROFILE.role}`;
    } else if (cmd === 'bio') {
      out = PROFILE.bio;
    } else if (cmd === 'experience') {
      out = 'Women Techmakers Owerri (Creative Lead) | Aliconects | Katext Power | Heartrova | Codeant Hub';
    } else if (cmd === 'education') {
      out = 'HND & ND in Computer Science - Federal Polytechnic Nekede, Owerri';
    } else if (cmd === 'skills') {
      out = PROFILE.skills.map(s => s.name).join(', ');
    } else if (cmd === 'repos') {
      out = 'Vora-3d-Marketplace, Rivet, Jedi-Auto-Hustle-Agent, arcflow, home-protocol, jedi-tele-mention-bot';
    } else if (cmd === 'cv' || cmd === 'resume') {
      out = 'Launching CV modal and downloading link...';
      onOpenResume();
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      out = `command not found: ${cmd}. Type 'help' for options.`;
    }

    setTerminalLogs(prev => [...prev, { cmd: terminalInput, out }]);
    setTerminalInput('');
  };

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-grid">
        
        {/* Left Column: Avatar Portrait and Mode Switches */}
        <div className="hero-portrait-col">
          <div className="hero-avatar-area">
            {/* The ONLY Open To Work Stamp Badge - exactly at the top-right of the avatar */}
            <div 
              className={`hero-stamp-badge ${isStampToggled ? 'stamp-flat' : ''}`}
              onClick={() => setIsStampToggled(!isStampToggled)}
              title="Click to toggle stamp angle"
            >
              <div className="stamp-inner">
                <span>{PROFILE.status}</span>
              </div>
            </div>

            {activeTab === 'avatar' && (
              <div className="hero-avatar-card">
                <div className="avatar-header">
                  <span className="avatar-tag">// AVATAR: JEDI_01</span>
                  <span className="avatar-status-pill">
                    <span className="live-dot" style={{ width: 5, height: 5 }}></span>
                    ONLINE
                  </span>
                </div>
                <div className="avatar-img-wrapper">
                  <InteractiveAvatar imageSrc="/jedi-hero.jpg" />
                  <div className="avatar-corner corner-tl"></div>
                  <div className="avatar-corner corner-tr"></div>
                  <div className="avatar-corner corner-bl"></div>
                  <div className="avatar-corner corner-br"></div>
                </div>
              </div>
            )}

            {activeTab === 'coding' && (
              <div className="coding-terminal">
                <div className="term-header">
                  <div className="term-dots">
                    <span className="term-dot dot-red"></span>
                    <span className="term-dot dot-yellow"></span>
                    <span className="term-dot dot-green"></span>
                  </div>
                  <span>bash - jedi@terminal</span>
                </div>
                <div className="term-body">
                  {terminalLogs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '0.4rem' }}>
                      <div>
                        <span className="term-prompt">jedi@arch:~$ </span>
                        <span>{log.cmd}</span>
                      </div>
                      <div className="term-output">{log.out}</div>
                    </div>
                  ))}
                  <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '0.4rem' }}>
                    <span className="term-prompt" style={{ marginRight: '0.4rem' }}>jedi@arch:~$ </span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="type 'help'..."
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        width: '100%'
                      }}
                    />
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Mode Switch Tabs under the avatar matching heyamit.dev */}
          <div className="portrait-tabs">
            <button
              onClick={() => setActiveTab('avatar')}
              className={`tab-btn ${activeTab === 'avatar' ? 'active' : ''}`}
            >
              tl;dr
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`tab-btn ${activeTab === 'coding' ? 'active' : ''}`}
            >
              coding
            </button>
          </div>
        </div>

        {/* Right Column: Bio and details */}
        <div className="hero-content-col">
          <div className="hero-header-row">
            <div>
              <div className="whoami-tag">~ whoami</div>
              <h1 className="hero-name">{PROFILE.name}</h1>
            </div>
            {/* Note: ONLY 1 stamp badge exists on the site, attached to the avatar above */}
          </div>

          <p className="hero-bio">
            {PROFILE.bio}
          </p>

          {/* Currently building line */}
          <div className="current-build-row">
            <Play size={12} fill="currentColor" className="build-arrow" />
            <span>{PROFILE.currentBuild.label} </span>
            <a 
              href={PROFILE.currentBuild.link}
              target="_blank"
              rel="noreferrer"
              className="build-project"
            >
              {PROFILE.currentBuild.project}
            </a>
            <span>– {PROFILE.currentBuild.summary}</span>
          </div>

          {/* Skills Tag Pills */}
          <div className="skills-wrap">
            {PROFILE.skills.map((skill, idx) => (
              <span
                key={idx}
                className="skill-pill"
                style={{ color: skill.color }}
              >
                {skill.name}
              </span>
            ))}
          </div>

          {/* Social Icons row */}
          <div className="socials-row">
            <a 
              href={PROFILE.socials.github} 
              target="_blank" 
              rel="noreferrer"
              className="social-icon-link"
              title="GitHub Profile"
            >
              <GithubIcon size={20} />
            </a>
            <a 
              href={PROFILE.socials.twitter} 
              target="_blank" 
              rel="noreferrer"
              className="social-icon-link"
              title="Twitter / X"
            >
              <XIcon size={19} />
            </a>
            <a 
              href={PROFILE.socials.linkedin} 
              target="_blank" 
              rel="noreferrer"
              className="social-icon-link"
              title="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a 
              href={`mailto:${PROFILE.socials.email}`}
              className="social-icon-link"
              title="Direct Email"
            >
              <Mail size={20} />
            </a>
            <a 
              href={PROFILE.socials.telegram}
              target="_blank"
              rel="noreferrer"
              className="social-icon-link"
              title="Telegram"
            >
              <Send size={19} />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button 
              onClick={onOpenResume}
              className="btn btn-secondary"
            >
              <FileText size={16} />
              <span>resume</span>
            </button>
            <button 
              onClick={onOpenContact}
              className="btn btn-primary"
            >
              <Calendar size={16} />
              <span>book a call</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
