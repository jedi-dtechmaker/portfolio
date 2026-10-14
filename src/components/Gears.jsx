import React from 'react';
import { Cpu, Terminal, Laptop, Wrench, Check } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export default function Gears() {
  const icons = {
    "Web3 & Blockchain": <Cpu size={18} color="var(--accent-amber)" />,
    "Backend & Cloud": <Terminal size={18} color="var(--accent-green)" />,
    "Frontend & UI": <Laptop size={18} color="var(--accent-cyan)" />
  };

  return (
    <section id="gears" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <div>
            <div className="whoami-tag">~ workstation</div>
            <h2 className="section-title">
              <span className="section-prefix">#</span>
              <span>gears & developer setup</span>
            </h2>
          </div>
          <span className="section-subtitle">
            Tools, hardware, and environment I use daily
          </span>
        </div>

        <div className="gears-grid">
          {PROFILE.gears.map((cat, idx) => (
            <div key={idx} className="gear-category-card">
              <div className="gear-cat-title">
                {icons[cat.category] || <Wrench size={18} />}
                <span>{cat.category}</span>
              </div>

              <ul className="gear-list">
                {cat.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="gear-item">
                    <span className="gear-bullet">❯</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
