import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle2, FileText, Download } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    try {
      await fetch(`https://formsubmit.co/ajax/${PROFILE.socials.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `[Portfolio Handshake] Inquiry from ${formData.name}`
        })
      });
    } catch (err) {
      console.warn("Direct modal dispatch fallback:", err);
      const mailtoUrl = `mailto:${PROFILE.socials.email}?subject=Collaboration%20Inquiry%20from%20${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message)}`;
      window.location.href = mailtoUrl;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="whoami-tag">~ connection</div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
          Initialize Handshake
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          Schedule a call or send a message directly to <span style={{ color: 'var(--accent-green-bright)' }}>{PROFILE.socials.email}</span>
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={42} color="var(--accent-green)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Message Prepared</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Redirecting to your mail client...
            </p>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ marginTop: '1.25rem' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label className="form-label">Name or Company</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ada Lovelace"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ada@domain.io"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message / Project details</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Let's build something awesome..."
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, justifyContent: 'center' }}>
                <Send size={15} />
                <span>Send Dispatch</span>
              </button>
              <a
                href={`mailto:${PROFILE.socials.email}`}
                className="btn btn-secondary"
                style={{ justifyContent: 'center' }}
                title="Send plain email"
              >
                <Mail size={15} />
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: 660, maxHeight: '88vh', overflowY: 'auto' }}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="whoami-tag">~ curriculum-vitae</div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
          {PROFILE.fullName} ({PROFILE.name})
        </h3>
        <p style={{ color: 'var(--accent-green-bright)', fontSize: '0.82rem', marginTop: '0.15rem' }}>
          {PROFILE.role} · 5+ Years Experience
        </p>

        <div style={{ background: '#090c0a', padding: '1.2rem', borderRadius: 6, margin: '1rem 0', fontSize: '0.82rem', lineHeight: 1.6, border: '1px solid var(--border-subtle)' }}>
          <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', marginBottom: '0.4rem' }}>
            // SUMMARY
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {PROFILE.bio}
          </div>

          <div style={{ color: 'var(--accent-amber)', fontWeight: 'bold', margin: '1rem 0 0.4rem' }}>
            // WORK EXPERIENCE & LEADERSHIP
          </div>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {PROFILE.experience.slice(0, 5).map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                  <span style={{ fontWeight: 600 }}>{exp.company} — <span style={{ color: 'var(--accent-cyan)' }}>{exp.role}</span></span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{exp.period}</span>
                </div>
                <div style={{ fontSize: '0.79rem', color: 'var(--text-secondary)' }}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>

          <div style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', margin: '1rem 0 0.4rem' }}>
            // EDUCATION
          </div>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {PROFILE.education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-primary)' }}>• {edu.degree} — <span style={{ color: 'var(--text-muted)' }}>{edu.institution}</span></span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{edu.period}</span>
              </div>
            ))}
          </div>

          <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', margin: '1rem 0 0.4rem' }}>
            // CORE COMPETENCIES
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            • <strong style={{ color: 'var(--text-primary)' }}>Frontend & 3D:</strong> React, Vite, Next.js, TypeScript, JavaScript, Three.js, WebGL, Tailwind CSS<br/>
            • <strong style={{ color: 'var(--text-primary)' }}>Backend & Web3:</strong> Python (FastAPI), Node.js, REST APIs, Web3/Solidity basics, Telegram Bots<br/>
            • <strong style={{ color: 'var(--text-primary)' }}>Systems & Creative:</strong> Linux, Docker, Git, Neovim, UI/UX Wireframing, Figma, Canva
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <a
            href={PROFILE.socials.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <Download size={15} />
            <span>Download Full CV (PDF)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
