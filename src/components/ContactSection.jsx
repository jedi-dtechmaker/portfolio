import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Development',
    message: ''
  });

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${PROFILE.socials.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message,
          _subject: `[Portfolio Inquiry] ${formData.projectType} from ${formData.name}`
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        triggerMailtoFallback();
      }
    } catch (err) {
      console.warn("Direct form dispatch notice, triggering fallback:", err);
      triggerMailtoFallback();
    }
  };

  const triggerMailtoFallback = () => {
    setStatus('success');
    const subject = encodeURIComponent(`[${formData.projectType}] Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Hi Jedi,\n\n${formData.message}\n\n---\nFrom: ${formData.name} (${formData.email})`
    );
    window.location.href = `mailto:${PROFILE.socials.email}?subject=${subject}&body=${body}`;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      projectType: 'Full-Stack Development',
      message: ''
    });
    setStatus('idle');
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-title-wrap">
          <div>
            <div className="whoami-tag">~ handshake</div>
            <h2 className="section-title">
              <span className="section-prefix">#</span>
              <span>initialize connection</span>
            </h2>
          </div>
          <span className="section-subtitle">
            Let's build something extraordinary together
          </span>
        </div>

        <div className="contact-grid">
          
          {/* Left Column: Direct info & status */}
          <div className="contact-info-col">
            <div className="contact-status-badge">
              <span className="live-dot" style={{ backgroundColor: 'var(--accent-green)' }}></span>
              <span>Available for Full-Time &amp; Freelance Contracts</span>
            </div>

            <p className="contact-bio-text">
              Have a high-impact project, looking to build an immersive 3D WebGL experience, or need autonomous AI workflow agents? Feel free to drop a transmission below or reach out directly.
            </p>

            <div className="contact-cards-list">
              {/* Email Card with 1-click Copy */}
              <div className="contact-channel-card">
                <div className="channel-icon-wrap">
                  <Mail size={18} color="var(--accent-green-bright)" />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Direct Email</span>
                  <a href={`mailto:${PROFILE.socials.email}`} className="channel-value">
                    {PROFILE.socials.email}
                  </a>
                </div>
                <button 
                  onClick={handleCopyEmail}
                  className="channel-copy-btn"
                  title="Copy email address"
                >
                  {copied ? <Check size={14} color="var(--accent-green-bright)" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Telegram Card */}
              <div className="contact-channel-card">
                <div className="channel-icon-wrap">
                  <MessageSquare size={18} color="var(--accent-cyan)" />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Telegram Direct</span>
                  <a href={PROFILE.socials.telegram} target="_blank" rel="noreferrer" className="channel-value">
                    @jedi_dtechmaker
                  </a>
                </div>
              </div>

              {/* Location & Timezone Card */}
              <div className="contact-channel-card">
                <div className="channel-icon-wrap">
                  <MapPin size={18} color="var(--accent-amber)" />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Timezone &amp; Location</span>
                  <span className="channel-value" style={{ color: 'var(--text-secondary)' }}>
                    WAT (UTC+1) // Available Globally Remote
                  </span>
                </div>
              </div>

              {/* Turnaround Time */}
              <div className="contact-channel-card">
                <div className="channel-icon-wrap">
                  <Clock size={18} color="var(--accent-blue)" />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Expected Response</span>
                  <span className="channel-value" style={{ color: 'var(--text-secondary)' }}>
                    Within 2-4 hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Working Terminal Form */}
          <div className="contact-form-col">
            <div className="contact-terminal-window">
              <div className="term-header">
                <div className="term-dots">
                  <span className="term-dot dot-red"></span>
                  <span className="term-dot dot-yellow"></span>
                  <span className="term-dot dot-green"></span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  transmission.sh — jedi@gateway
                </span>
              </div>

              {status === 'success' ? (
                <div className="contact-success-state">
                  <CheckCircle2 size={48} color="var(--accent-green-bright)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    Transmission Dispatched
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
                    Your message payload was formatted and dispatched to <span style={{ color: 'var(--accent-green-bright)' }}>{PROFILE.socials.email}</span>. Thank you for connecting!
                  </p>
                  <button 
                    onClick={handleReset}
                    className="btn btn-secondary"
                    style={{ marginTop: '1.5rem', alignSelf: 'center' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="terminal-form-body">
                  
                  {/* Name field */}
                  <div className="form-row">
                    <label className="form-term-label">
                      <span className="form-prompt-prefix">jedi@client:~$</span>
                      <span>Your Name / Team</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Satoshi Nakamoto"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-term-input"
                    />
                  </div>

                  {/* Email field */}
                  <div className="form-row">
                    <label className="form-term-label">
                      <span className="form-prompt-prefix">jedi@client:~$</span>
                      <span>Your Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. satoshi@bitcoin.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-term-input"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="form-row">
                    <label className="form-term-label">
                      <span className="form-prompt-prefix">jedi@client:~$</span>
                      <span>Project Focus</span>
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="form-term-select"
                    >
                      <option value="Full-Stack Web App">Full-Stack Web App (React / Vite / Node)</option>
                      <option value="3D WebGL / Three.js">3D WebGL / Three.js Experience</option>
                      <option value="AI Workflow Agents">Autonomous AI Agents / Bots</option>
                      <option value="Contract / Full-time Role">Full-time Engineering Role</option>
                      <option value="General Collaboration">General Chat &amp; Collaboration</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="form-row">
                    <label className="form-term-label">
                      <span className="form-prompt-prefix">jedi@client:~$</span>
                      <span>Message Payload</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell me about what you're building, timelines, or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-term-textarea"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn btn-primary form-submit-btn"
                    >
                      <Send size={15} />
                      <span>{status === 'sending' ? 'Transmitting...' : 'Dispatch Message'}</span>
                    </button>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Press dispatch to trigger instant handshake
                    </span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
