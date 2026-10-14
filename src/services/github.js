// GitHub API Service with localStorage caching and offline fallback
const GITHUB_USERNAME = "jedi-dtechmaker";
const CACHE_KEY = "jedi_portfolio_github_cache_v1";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// High-fidelity fallback data in case of API rate limits
export const FALLBACK_DATA = {
  profile: {
    login: "jedi-dtechmaker",
    name: "jedi",
    avatar_url: "https://avatars.githubusercontent.com/u/317234232?v=4",
    html_url: "https://github.com/jedi-dtechmaker",
    bio: "Full-Stack Engineer & AI/3D Builder",
    public_repos: 12,
    followers: 8,
    following: 14,
    created_at: "2024-01-10T00:00:00Z"
  },
  repos: [
    {
      id: 1400618691,
      name: "Vora-3d-Marketplace",
      description: "Next-gen immersive 3D digital asset marketplace built with Three.js, React, and TypeScript.",
      html_url: "https://github.com/jedi-dtechmaker/Vora-3d-Marketplace",
      language: "TypeScript",
      stargazers_count: 5,
      forks_count: 1,
      updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      homepage: null,
      topics: ["threejs", "react", "typescript", "webgl", "marketplace"]
    },
    {
      id: 1376498297,
      name: "Rivet",
      description: "High-performance developer workspace and web interface.",
      html_url: "https://github.com/jedi-dtechmaker/Rivet",
      language: "TypeScript",
      stargazers_count: 3,
      forks_count: 0,
      updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      homepage: "https://rivet-web-ten.vercel.app",
      topics: ["typescript", "vite", "web"]
    },
    {
      id: 1391146542,
      name: "Jedi-Auto-Hustle-Agent",
      description: "Autonomous task automation agent built in Python for scheduling and intelligent workflow execution.",
      html_url: "https://github.com/jedi-dtechmaker/Jedi-Auto-Hustle-Agent",
      language: "Python",
      stargazers_count: 4,
      forks_count: 1,
      updated_at: new Date(Date.now() - 3600000 * 96).toISOString(),
      homepage: null,
      topics: ["python", "ai-agents", "automation"]
    },
    {
      id: 1346271109,
      name: "arcflow",
      description: "Modern interactive web application and fluid state management system.",
      html_url: "https://github.com/jedi-dtechmaker/arcflow",
      language: "JavaScript",
      stargazers_count: 2,
      forks_count: 0,
      updated_at: new Date(Date.now() - 3600000 * 120).toISOString(),
      homepage: "https://arcisflow-nine.vercel.app",
      topics: ["javascript", "react", "frontend"]
    },
    {
      id: 1391136059,
      name: "jedi-tele-mention-bot",
      description: "Telegram automated mention and broadcast management bot.",
      html_url: "https://github.com/jedi-dtechmaker/jedi-tele-mention-bot",
      language: "JavaScript",
      stargazers_count: 2,
      forks_count: 0,
      updated_at: new Date(Date.now() - 3600000 * 180).toISOString(),
      homepage: null,
      topics: ["telegram-bot", "automation", "nodejs"]
    },
    {
      id: 1373450043,
      name: "home-protocol",
      description: "Decentralized property and protocol architecture playground.",
      html_url: "https://github.com/jedi-dtechmaker/home-protocol",
      language: "JavaScript",
      stargazers_count: 1,
      forks_count: 0,
      updated_at: new Date(Date.now() - 3600000 * 240).toISOString(),
      homepage: "https://home-protocol.netlify.app",
      topics: ["web3", "protocol"]
    }
  ],
  events: [
    {
      id: "ev-1",
      type: "PushEvent",
      repo: { name: "jedi-dtechmaker/Vora-3d-Marketplace" },
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      payload: {
        commits: [
          { message: "feat: optimize 3D model loaders and asset caching" },
          { message: "refactor: improve camera orbit animations" }
        ]
      }
    },
    {
      id: "ev-2",
      type: "PushEvent",
      repo: { name: "jedi-dtechmaker/Rivet" },
      created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
      payload: {
        commits: [
          { message: "feat(ui): implement dark terminal mode and fast keybindings" }
        ]
      }
    },
    {
      id: "ev-3",
      type: "CreateEvent",
      repo: { name: "jedi-dtechmaker/Jedi-Auto-Hustle-Agent" },
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      payload: {
        ref_type: "branch",
        ref: "main"
      }
    }
  ]
};

// Language color map for visual tags
export const LANGUAGE_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00ADD8"
};

export async function fetchGitHubData(force = false) {
  if (!force) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          return { ...parsed.data, isCached: true, lastFetched: parsed.timestamp };
        }
      }
    } catch (e) {
      console.warn("Failed to read from cache:", e);
    }
  }

  try {
    const headers = { Accept: "application/vnd.github.v3+json" };

    const [profileRes, reposRes, eventsRes] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`, { headers })
    ]);

    const profile = profileRes.status === "fulfilled" && profileRes.value.ok
      ? await profileRes.value.json()
      : FALLBACK_DATA.profile;

    const repos = reposRes.status === "fulfilled" && reposRes.value.ok
      ? await reposRes.value.json()
      : FALLBACK_DATA.repos;

    const events = eventsRes.status === "fulfilled" && eventsRes.value.ok
      ? await eventsRes.value.json()
      : FALLBACK_DATA.events;

    // Filter out forks if desired, or keep non-forks prioritized
    const filteredRepos = Array.isArray(repos)
      ? repos.filter(r => !r.fork)
      : FALLBACK_DATA.repos;

    // Calculate aggregated stats
    const totalStars = filteredRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalForks = filteredRepos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

    // Language statistics
    const languageCounts = {};
    filteredRepos.forEach(r => {
      if (r.language) {
        languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      }
    });

    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / (filteredRepos.length || 1)) * 100),
        color: LANGUAGE_COLORS[name] || "#888888"
      }))
      .sort((a, b) => b.count - a.count);

    const compiledData = {
      profile,
      repos: filteredRepos,
      allRepos: Array.isArray(repos) ? repos : FALLBACK_DATA.repos,
      events: Array.isArray(events) ? events : FALLBACK_DATA.events,
      stats: {
        publicRepos: profile.public_repos || filteredRepos.length,
        totalStars,
        totalForks,
        languages
      },
      isCached: false,
      lastFetched: Date.now()
    };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: compiledData
      }));
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }

    return compiledData;
  } catch (error) {
    console.error("Error fetching live GitHub data:", error);
    return {
      profile: FALLBACK_DATA.profile,
      repos: FALLBACK_DATA.repos,
      allRepos: FALLBACK_DATA.repos,
      events: FALLBACK_DATA.events,
      stats: {
        publicRepos: FALLBACK_DATA.profile.public_repos,
        totalStars: 17,
        totalForks: 2,
        languages: [
          { name: "TypeScript", count: 2, percent: 40, color: "#3178c6" },
          { name: "JavaScript", count: 3, percent: 40, color: "#f7df1e" },
          { name: "Python", count: 1, percent: 20, color: "#3572A5" }
        ]
      },
      isCached: true,
      lastFetched: Date.now()
    };
  }
}
