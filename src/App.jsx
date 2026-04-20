import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || ''
const IS_DEV = !__PROD__
const CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']

const API_BASE = IS_DEV
  ? '/api/news'
  : 'https://newsapi.org/v2'

const SAMPLE_ARTICLES = [
  { source: { id: null, name: 'TechCrunch' }, author: 'Jane Doe', title: 'AI Revolutionizes Healthcare with New Diagnostic Tools', description: 'Artificial intelligence is transforming the healthcare industry with groundbreaking diagnostic tools that can detect diseases earlier than ever before. Researchers at leading universities have developed algorithms that outperform traditional methods.', url: '#', urlToImage: null, publishedAt: '2026-04-20T10:00:00Z', content: null },
  { source: { id: null, name: 'BBC Sport' }, author: 'John Smith', title: 'India Wins Cricket World Cup in Thrilling Final', description: 'India clinched the Cricket World Cup with a stunning performance in the final match, defeating Australia by 7 wickets. The victory sparked celebrations across the nation.', url: '#', urlToImage: null, publishedAt: '2026-04-19T18:00:00Z', content: null },
  { source: { id: null, name: 'Reuters' }, author: 'Emma Wilson', title: 'Stock Markets Hit All-Time Highs on Tech Earnings', description: 'Global stock markets surged to record highs following better-than-expected earnings from major technology companies. The rally was led by semiconductor and AI stocks.', url: '#', urlToImage: null, publishedAt: '2026-04-19T14:00:00Z', content: null },
  { source: { id: null, name: 'The Hindu' }, author: 'Ravi Kumar', title: 'New Education Policy Shows Promising Results in Pilot Schools', description: 'Schools implementing the new National Education Policy have reported significant improvements in student engagement and learning outcomes. The pilot program covers 500 schools across 10 states.', url: '#', urlToImage: null, publishedAt: '2026-04-18T09:00:00Z', content: null },
  { source: { id: null, name: 'Variety' }, author: 'Lisa Chen', title: 'Streaming Wars Heat Up with Exclusive Content Deals', description: 'Major streaming platforms are investing billions in exclusive content to attract subscribers. The competition has led to a golden age of television with unprecedented production values.', url: '#', urlToImage: null, publishedAt: '2026-04-18T12:00:00Z', content: null },
  { source: { id: null, name: 'Nature' }, author: 'Dr. Alex Park', title: 'Breakthrough in Quantum Computing Achieves 1000 Qubits', description: 'Scientists have achieved a major milestone in quantum computing by creating a stable 1000-qubit processor. This breakthrough brings practical quantum computing closer to reality.', url: '#', urlToImage: null, publishedAt: '2026-04-17T16:00:00Z', content: null },
  { source: { id: null, name: 'ESPN' }, author: 'Mike Torres', title: 'Premier League Title Race Goes Down to the Wire', description: 'The Premier League title race will be decided on the final day of the season after the top two teams both won their penultimate matches. Fans are in for a dramatic finale.', url: '#', urlToImage: null, publishedAt: '2026-04-17T20:00:00Z', content: null },
  { source: { id: null, name: 'Bloomberg' }, author: 'Sarah Gold', title: 'RBI Holds Interest Rates Steady Amid Global Uncertainty', description: 'The Reserve Bank of India kept interest rates unchanged, citing global economic uncertainty and stable domestic inflation. The decision was widely expected by analysts.', url: '#', urlToImage: null, publishedAt: '2026-04-16T08:00:00Z', content: null },
  { source: { id: null, name: 'Wired' }, author: 'Tom Bootstrap', title: 'New JavaScript Framework Takes Developer Community by Storm', description: 'A new JavaScript framework has gained rapid adoption due to its innovative approach to reactivity and rendering. Developers praise its simplicity and performance advantages.', url: '#', urlToImage: null, publishedAt: '2026-04-16T11:00:00Z', content: null },
  { source: { id: null, name: 'The Lancet' }, author: 'Dr. Priya Shah', title: 'New Vaccine Shows 95% Efficacy Against Malaria', description: 'A groundbreaking malaria vaccine has demonstrated 95% efficacy in large-scale clinical trials across Africa and South Asia. The WHO has fast-tracked its approval process.', url: '#', urlToImage: null, publishedAt: '2026-04-15T07:00:00Z', content: null },
]

function App() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('general')
  const [readIds, setReadIds] = useState(new Set())
  const [expandedId, setExpandedId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : ''
  }, [darkMode])

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      if (!API_KEY) {
        setArticles(SAMPLE_ARTICLES)
        setLoading(false)
        return
      }
      try {
        const res = await fetch(
          `${API_BASE}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
        )
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        if (data.status !== 'ok') throw new Error(data.message || 'Failed to fetch')
        if (!data.articles || data.articles.length === 0) {
          setArticles(SAMPLE_ARTICLES)
        } else {
          setArticles(data.articles)
        }
      } catch (err) {
        setError(err.message)
        setArticles(SAMPLE_ARTICLES)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [category])

  const toggleRead = (url) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })
  }

  const filtered = articles.filter(
    (a) => a.title && a.title !== '[Removed]'
  )

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="header">
        <h1>📰 News Tracker</h1>
        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <div className="controls">
        <div className="categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="read-count">
          Read: {readIds.size} / {filtered.length}
        </div>
      </div>

      {error && (
        <p className="error">
          API error: {error}. Showing sample data.
        </p>
      )}

      {loading ? (
        <div className="loading">Loading headlines...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No articles found for this category.</div>
      ) : (
        <ul className="article-list">
          {filtered.map((article) => {
            const isRead = readIds.has(article.url)
            const isExpanded = expandedId === article.url
            return (
              <li
                key={article.url}
                className={`article-card ${isRead ? 'read' : ''} ${isExpanded ? 'expanded' : ''}`}
              >
                <div className="article-header" onClick={() => setExpandedId(isExpanded ? null : article.url)}>
                  <h2 className={`article-title ${isRead ? 'strikethrough' : ''}`}>
                    {article.title}
                  </h2>
                  <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div className="article-body">
                    <p className="article-meta">
                      {article.source?.name}
                      {article.author ? ` · ${article.author}` : ''}
                      {article.publishedAt
                        ? ` · ${new Date(article.publishedAt).toLocaleDateString()}`
                        : ''}
                    </p>
                    <p className="article-desc">{article.description}</p>
                    {article.url && article.url !== '#' && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-link"
                      >
                        Read full article →
                      </a>
                    )}
                    <button
                      className={`mark-read-btn ${isRead ? 'undo' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRead(article.url)
                      }}
                    >
                      {isRead ? '✓ Marked as Read' : 'Mark as Read'}
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default App