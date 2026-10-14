import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GitHubActivity from './components/GitHubActivity';
import Projects from './components/Projects';
import Gears from './components/Gears';
import ContactSection from './components/ContactSection';
import { ContactModal, ResumeModal } from './components/ContactModal';
import { fetchGitHubData, FALLBACK_DATA } from './services/github';
import { PROFILE } from './data/portfolioData';
import { Terminal, Heart, Code2 } from 'lucide-react';

export default function App() {
  const [githubData, setGithubData] = useState({
    profile: FALLBACK_DATA.profile,
    repos: FALLBACK_DATA.repos,
    allRepos: FALLBACK_DATA.repos,
    events: FALLBACK_DATA.events,
    stats: FALLBACK_DATA.stats,
    isCached: false,
    lastFetched: Date.now()
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [contactOpen, setContactOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Fetch live GitHub telemetry on load
  const loadGitHub = async (force = false) => {
    setLoading(true);
    try {
      const data = await fetchGitHubData(force);
      setGithubData(data);
    } catch (err) {
      console.error('Failed to load GitHub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGitHub(false);

    // Track scroll position for active section
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'activity', 'gears', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="portfolio-app">
      {/* Top Navbar */}
      <Header 
        activeSection={activeSection} 
        onOpenContact={() => setContactOpen(true)} 
      />

      {/* Hero Section matching exact sample */}
      <Hero 
        onOpenContact={() => setContactOpen(true)}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Projects Section */}
      <Projects 
        repos={githubData.repos} 
      />

      {/* GitHub Automated Activity Pulse */}
      <GitHubActivity 
        githubData={githubData}
        loading={loading}
        onRefresh={() => loadGitHub(true)}
      />

      {/* Gears & Workstation Setup */}
      <Gears />

      {/* Working Contact Section before Footer */}
      <ContactSection />

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-status">
            <span className="live-dot"></span>
            <span>system normal // jedi-terminal v2.4</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>engineered with</span>
            <span style={{ color: 'var(--accent-green-bright)' }}>React + Vite</span>
            <span>&amp; live GitHub API</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} {PROFILE.name} // all rights reserved
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ContactModal 
        isOpen={contactOpen} 
        onClose={() => setContactOpen(false)} 
      />

      <ResumeModal 
        isOpen={resumeOpen} 
        onClose={() => setResumeOpen(false)} 
      />
    </div>
  );
}
