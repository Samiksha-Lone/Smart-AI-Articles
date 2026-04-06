import { useEffect, useState } from 'react'
import axios from 'axios'
import { MdLogout } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { IoDocumentText } from 'react-icons/io5'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://beyondchats-assignment-backend.onrender.com/api'

/* ── Phase 5: Enhanced Templates ──────────────────────── */
const TEMPLATES = [
  {
    id: 'blog',
    emoji: '📝',
    label: 'Blog Post',
    title: 'The Future of AI-Powered Content Creation',
    content: 'Artificial intelligence is transforming how we create, edit, and distribute content. From automated writing assistants to intelligent SEO tools, AI is becoming essential for modern content creators who want to stay competitive in an increasingly digital landscape.',
  },
  {
    id: 'linkedin',
    emoji: '💼',
    label: 'LinkedIn Post',
    title: '5 Productivity Hacks That Changed My Work Life',
    content: 'Struggling to stay focused? Here are 5 game-changing techniques I use every day: time-blocking, digital minimalism, the two-minute rule, deep work sessions, and weekly reviews. Try them for one week and see the difference.',
  },
  {
    id: 'email',
    emoji: '📧',
    label: 'Email Newsletter',
    title: 'Weekly Tech Roundup: AI Breakthroughs & Trends',
    content: 'Welcome to this week\'s tech roundup! We\'re diving into the latest AI developments, from new language models to practical applications that are changing how businesses operate. Plus, our top picks for tools and resources to stay ahead of the curve.',
  },
  {
    id: 'custom',
    emoji: '✨',
    label: 'Custom Article',
    title: 'Your Amazing Article Title',
    content: 'Start writing your content here. This template gives you complete freedom to create any type of content you need.',
  },
]

/* ── Spinner helper ─────────────────────────────── */
const Spinner = ({ size = 'md' }) => {
  const s = size === 'sm' ? 'w-3.5 h-3.5 border-[2px]' : 'w-5 h-5 border-[2.5px]'
  return (
    <div className={`${s} border-white/40 border-t-white rounded-full animate-spin-loader flex-shrink-0`} />
  )
}

/* ── Copy icon ──────────────────────────────────── */
const CopyIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ═══════════════════════════════════════════════════
   App
═══════════════════════════════════════════════════ */
function App() {
  const { user, logout, loading: authLoading } = useAuth()

  // ── State (all original) ──────────────────────
  const [articles, setArticles]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [formData, setFormData]       = useState({
    title: '',
    content: '',
    url: '',
    template: 'custom',
    writingStyle: 'formal',
    tone: 'professional'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editId, setEditId]           = useState(null)
  const [authMode, setAuthMode]       = useState('login')

  // ── New UI state ──────────────────────────────
  const [copiedId, setCopiedId]       = useState(null)
  const [activePanel, setActivePanel] = useState('input') // mobile tab

  // ── Phase 4: Pagination & Search ──────────────
  const [pagination, setPagination]   = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // ── Phase 5: Dashboard & Personalization ──────
  const [analytics, setAnalytics]     = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('custom')
  const [showDashboard, setShowDashboard] = useState(false)

  // ── Data fetching (updated for pagination) ────
  const fetchArticles = (page = 1, search = '', status = '') => {
    if (!user) return
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...(search && { search }),
      ...(status && { status })
    })

    axios.get(`${API_BASE}/articles?${params}`)
      .then(res => {
        setArticles(res.data.articles || [])
        setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        if (err.response?.status === 401) logout()
        else if (err.response?.status === 429) {
          alert(err.response.data.message || 'Rate limit exceeded')
        }
      })
  }

  useEffect(() => { if (user) fetchArticles() }, [user])

  // ── Phase 5: Analytics Dashboard ──────────────
  const fetchAnalytics = () => {
    if (!user) return
    axios.get(`${API_BASE}/articles/analytics/dashboard`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error('Failed to fetch analytics:', err))
  }

  useEffect(() => { if (user) fetchAnalytics() }, [user])

  // Poll for status updates when there are processing articles
  useEffect(() => {
    const processingArticles = articles.filter(a => a.status === 'processing')
    if (processingArticles.length > 0) {
      const interval = setInterval(() => {
        fetchArticles(pagination.page, searchQuery, statusFilter)
      }, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [articles, pagination.page, searchQuery, statusFilter])

  // ── Phase 4: Pagination & Search Handlers ────
  const handlePageChange = (newPage) => {
    fetchArticles(newPage, searchQuery, statusFilter)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    fetchArticles(1, query, statusFilter)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    fetchArticles(1, searchQuery, status)
  }

  // ── Phase 5: New Handlers ─────────────────────
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    const template = TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setFormData({
        ...formData,
        title: template.title,
        content: template.content,
        template: templateId
      })
    }
  }

  const handleRegenerate = async (articleId) => {
    try {
      await axios.post(`${API_BASE}/articles/${articleId}/regenerate`)
      // Refresh articles and analytics
      fetchArticles(pagination.page, searchQuery, statusFilter)
      fetchAnalytics()
      alert('Article regeneration started! Check back in a moment.')
    } catch (error) {
      console.error('Regeneration failed:', error)
      alert('Failed to regenerate article. Please try again.')
    }
  }

  const handleExport = async (articleId, format = 'json') => {
    try {
      const response = await axios.get(`${API_BASE}/articles/${articleId}/export`)
      const data = response.data

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (format === 'txt') {
        const content = `# ${data.title}\n\n${data.content}\n\n---\nExported from Smart AI Articles`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export article. Please try again.')
    }
  }
  const handleCreate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editId) {
        await axios.put(`${API_BASE}/articles/${editId}`, { ...formData, original: true })
      } else {
        await axios.post(`${API_BASE}/articles`, { ...formData, original: true })
      }
      setFormData({
        title: '',
        content: '',
        url: '',
        template: 'custom',
        writingStyle: 'formal',
        tone: 'professional'
      })
      setEditId(null)
      setShowModal(false)
      fetchArticles()
    } catch (err) {
      if (err.response?.status === 401) logout()
      else alert(err.response?.data?.message || 'Error saving article')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      content: article.content,
      url: article.url || '',
      template: article.template || 'custom',
      writingStyle: article.writingStyle || 'formal',
      tone: article.tone || 'professional'
    })
    setEditId(article._id)
    setShowModal(true)
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL your articles?')) return
    try {
      for (const article of articles) {
        await axios.delete(`${API_BASE}/articles/${article._id}`)
      }
      fetchArticles()
    } catch (err) {
      if (err.response?.status === 401) logout()
      else alert('Error clearing articles')
    }
  }

  const handleEnhance = async (articleId) => {
    const originalText = originals.find(a => a._id === articleId)?.title
    if (!window.confirm(`Ready to enhance "${originalText}" with AI?`)) return
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/articles/${articleId}/enhance`)
      console.log('Enhancement response:', response.data)
      
      // If queued, show success message and refresh to show processing status
      if (response.data.message === 'Enhancement queued') {
        alert('Enhancement queued! Processing in background...')
      }
      
      fetchArticles()
    } catch (err) {
      if (err.response?.status === 401) logout()
      else {
        const errorMessage = err.response?.data?.message ||
          err.response?.data?.error || err.message || 'Error executing AI enhancement'
        console.error('Enhancement error details:', err.response?.data)
        alert(`Enhancement failed: ${errorMessage}`)
      }
      setLoading(false)
    }
  }

  // ── New helper handlers ───────────────────────
  const handleCopy = (article) => {
    const text = `${article.title}\n\n${article.content || article.excerpt || ''}`
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(article._id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const openNewArticle = () => {
    setEditId(null)
    setFormData({
      title: '',
      content: '',
      url: '',
      template: 'custom',
      writingStyle: 'formal',
      tone: 'professional'
    })
    setShowModal(true)
  }

  /* ── Derived lists (original logic) ──────────── */
  const originals = articles.filter(a => a.original === true)
  const enhanced  = articles.filter(a => !a.original)

  /* ───────────────────────────────────────────────
     Loading & auth screens
  ─────────────────────────────────────────────── */
  if (authLoading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin-loader" />
        <p className="text-sm text-slate-400 font-medium">Loading workspace…</p>
      </div>
    </div>
  )

  if (!user) return authMode === 'login'
    ? <Login onSwitchToRegister={() => setAuthMode('register')} />
    : <Register onSwitchToLogin={() => setAuthMode('login')} />

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-[3px] border-indigo-100 rounded-full" />
          <div className="absolute inset-0 border-[3px] border-t-indigo-600 border-x-transparent border-b-transparent rounded-full animate-spin-loader" />
          <div className="absolute inset-0 flex items-center justify-center">
            <HiSparkles className="text-indigo-500 text-xl" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-700 font-semibold text-sm">Processing with AI</p>
          <p className="text-slate-400 text-xs mt-0.5">This may take a moment…</p>
        </div>
      </div>
    </div>
  )

  /* ───────────────────────────────────────────────
     Main workspace render
  ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ══ Top Navigation ══════════════════════════ */}
      <nav className="sticky top-0 z-20 h-[56px] bg-white/90 backdrop-blur-md border-b border-slate-200 px-5 flex items-center justify-between flex-shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-300">
            <HiSparkles className="text-white text-sm" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">
            Smart<span className="text-indigo-600">Article</span> AI
          </span>
        </div>

        {/* Mobile panel tabs */}
        <div className="md:hidden flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
          <button
            id="mobile-tab-input"
            onClick={() => setActivePanel('input')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activePanel === 'input' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Workspace
          </button>
          <button
            id="mobile-tab-output"
            onClick={() => setActivePanel('output')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${activePanel === 'output' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Output {enhanced.length > 0 && `(${enhanced.length})`}
          </button>
        </div>

        {/* Right: status + user + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-dot" />
            <span className="text-xs font-medium text-slate-400">AI Connected</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-700 text-[9px] font-extrabold leading-none">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-700">{user.name}</span>
          </div>
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            title="Dashboard & Analytics"
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors ${
              showDashboard
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            📊
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            id="logout-btn"
            onClick={logout}
            title="Logout"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <MdLogout className="text-base" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* ══ Split Workspace ═════════════════════════ */}
      <div className="flex flex-1" style={{ height: 'calc(100vh - 56px)' }}>

        {/* ── Phase 5: Dashboard Overlay ──────────── */}
        {showDashboard && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">📊 Analytics Dashboard</h2>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="text-2xl font-bold text-blue-900">{analytics.totalArticles}</div>
                      <div className="text-sm text-blue-700">Total Articles</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                      <div className="text-2xl font-bold text-emerald-900">{analytics.averageScores.readability}%</div>
                      <div className="text-sm text-emerald-700">Avg Readability</div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6">
                      <div className="text-2xl font-bold text-violet-900">{analytics.averageScores.engagement}%</div>
                      <div className="text-sm text-violet-700">Avg Engagement</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
                      <div className="text-2xl font-bold text-amber-900">{analytics.averageScores.seo}%</div>
                      <div className="text-sm text-amber-700">Avg SEO Score</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">Loading analytics...</div>
                )}

                {analytics?.lastArticle && (
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Last Generated Article</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{analytics.lastArticle.title}</div>
                        <div className="text-sm text-slate-500">
                          {new Date(analytics.lastArticle.date).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        analytics.lastArticle.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : analytics.lastArticle.status === 'processing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {analytics.lastArticle.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── LEFT PANEL ──────────────────────────── */}
        <aside
          className={`
            ${activePanel !== 'input' ? 'hidden md:flex' : 'flex'}
            flex-col w-full md:w-[400px] lg:w-[440px] xl:w-[460px]
            border-r border-slate-200 bg-white flex-shrink-0 overflow-y-auto
          `}
        >
          {/* Left sticky header */}
          <div className="sticky top-0 bg-white z-10 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                Workspace
              </h2>
              {articles.length > 0 && (
                <button
                  id="clear-all-btn"
                  onClick={handleDeleteAll}
                  className="flex items-center gap-1.5 text-[11px] text-rose-400 hover:text-rose-600 font-semibold transition-colors"
                >
                  <FaTrash className="text-[9px]" />
                  Clear all
                </button>
              )}
            </div>

            {/* Stats chips */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-2 py-2.5 text-center">
                <div className="text-lg font-bold text-slate-900 leading-none mb-1">{articles.length}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Total</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-2 py-2.5 text-center">
                <div className="text-lg font-bold text-indigo-600 leading-none mb-1">{originals.length}</div>
                <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">Originals</div>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl px-2 py-2.5 text-center">
                <div className="text-lg font-bold text-orange-600 leading-none mb-1">{articles.filter(a => a.status === 'processing').length}</div>
                <div className="text-[10px] text-orange-400 font-semibold uppercase tracking-widest">Processing</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-2 py-2.5 text-center">
                <div className="text-lg font-bold text-emerald-600 leading-none mb-1">{enhanced.length}</div>
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Enhanced</div>
              </div>
            </div>
          </div>

          {/* Left scrollable body */}
          <div className="flex flex-col gap-6 p-5 flex-1">

            {/* ── New Article CTA ────────────────── */}
            <button
              id="new-article-btn"
              onClick={openNewArticle}
              className="group w-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl px-5 py-4 flex items-center gap-3 hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
            >
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
                <span className="text-white text-xl font-light leading-none">+</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold leading-snug">Create New Article</div>
                <div className="text-indigo-200 text-xs font-normal mt-0.5">Add content for AI enhancement</div>
              </div>
            </button>

            {/* ── Phase 5: Template Selection ──────── */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-3">
                Article Templates
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleTemplateSelect(tpl.id)}
                    className={`group flex flex-col items-center gap-1.5 p-3 border rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      selectedTemplate === tpl.id
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 hover:bg-indigo-50 border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <span className="text-xl leading-none">{tpl.emoji}</span>
                    <span className="text-[10px] font-bold text-center leading-tight">
                      {tpl.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Personalization Options */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-2 block">
                    Writing Style
                  </label>
                  <select
                    value={formData.writingStyle}
                    onChange={e => setFormData({ ...formData, writingStyle: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-2 block">
                    Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={e => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="enthusiastic">Enthusiastic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Pending Enhancement (history) ──── */}
            {originals.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                    Pending Enhancement
                  </p>
                  <span className="text-[10px] bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full px-2 py-0.5 font-bold">
                    {originals.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {originals.map((article, idx) => (
                    <div
                      key={article._id}
                      className="group relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/60 rounded-2xl p-4 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex gap-3 items-start">
                        {/* Status indicator */}
                        <div className="mt-1.5 flex-shrink-0">
                          {article.status === 'processing' ? (
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                          ) : article.status === 'completed' ? (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                          ) : article.status === 'failed' ? (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          ) : (
                            <div className="w-2 h-2 bg-indigo-300 group-hover:bg-indigo-500 rounded-full transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 line-clamp-1 transition-colors">
                              {article.title}
                            </h4>
                            {article.status === 'processing' && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                                Processing...
                              </span>
                            )}
                            {article.status === 'completed' && (
                              <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                                Enhanced
                              </span>
                            )}
                            {article.status === 'failed' && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                Failed
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {article.content.slice(0, 100)}…
                          </p>
                          {article.status === 'failed' && article.failureReason && (
                            <p className="text-xs text-red-500 mt-1">
                              Error: {article.failureReason}
                            </p>
                          )}
                          {/* Actions */}
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => handleEdit(article)}
                              className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold transition-colors"
                            >
                              Edit
                            </button>
                            <span className="text-slate-200 select-none">|</span>
                            {article.status === 'pending' && (
                              <button
                                onClick={() => handleEnhance(article._id)}
                                className="flex items-center gap-1 text-[11px] text-indigo-500 hover:text-indigo-700 font-bold transition-colors"
                              >
                                <HiSparkles className="text-xs" />
                                Enhance with AI
                              </button>
                            )}
                            {article.status === 'processing' && (
                              <span className="text-[11px] text-orange-500 font-medium">
                                Enhancing...
                              </span>
                            )}
                            {article.status === 'completed' && (
                              <span className="text-[11px] text-emerald-600 font-medium">
                                ✓ Enhanced
                              </span>
                            )}
                            {article.status === 'failed' && (
                              <button
                                onClick={() => handleEnhance(article._id)}
                                className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-bold transition-colors"
                              >
                                <HiSparkles className="text-xs" />
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Empty workspace state ───────────── */}
            {articles.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                  <IoDocumentText className="text-slate-400 text-2xl" />
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-1">No articles yet</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Create your first article or pick a template above
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ── RIGHT PANEL ─────────────────────────── */}
        <section
          className={`
            ${activePanel !== 'output' ? 'hidden md:flex' : 'flex'}
            flex-1 flex-col overflow-y-auto bg-[#F8FAFC] p-5 lg:p-8
          `}
        >
          {/* Right panel header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HiSparkles className="text-indigo-500" />
                AI Enhanced Output
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {enhanced.length > 0
                  ? `${enhanced.length} article${enhanced.length !== 1 ? 's' : ''} enhanced and ready`
                  : 'Your enhanced articles will appear here'}
              </p>
            </div>
            {enhanced.length > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ● AI Optimized
              </span>
            )}
          </div>

          {/* Phase 4: Search & Filter Controls */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced article cards */}
          {enhanced.length > 0 ? (
            <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-10">
              {enhanced.map((article, idx) => (
                <div
                  key={article._id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  {/* Accent stripe */}
                  <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

                  <div className="p-6">
                    {/* Sentiment + tone badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        article.analytics?.sentiment === 'Positive'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : article.analytics?.sentiment === 'Negative'
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {article.analytics?.sentiment || 'Neutral'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 uppercase tracking-wider">
                        {article.analytics?.tone || 'Professional'}
                      </span>
                    </div>

                    {/* Title — inline editable */}
                    <h3
                      contentEditable
                      suppressContentEditableWarning
                      className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-700 mb-3 leading-snug outline-none transition-colors cursor-text"
                      spellCheck={false}
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-5">
                      {article.excerpt || (article.content?.slice(0, 180) + '…')}
                    </p>

                    {/* Mini analytics */}
                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Readability</div>
                        <div className="text-sm font-bold text-slate-900">
                          {article.analytics?.readabilityScore || 85}%
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Keywords</div>
                        <div className="text-sm font-bold text-slate-900">
                          {article.analytics?.keywords?.length || 5}
                        </div>
                      </div>
                    </div>

                    {/* Phase 3: AI Intelligence Cards */}
                    {article.analytics?.aiScores && (
                      <div className="space-y-3 mb-5">
                        {/* AI Scores */}
                        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <HiSparkles className="text-sm" />
                            AI Scores
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-indigo-600 mb-1">
                                {article.analytics.aiScores.readability || 0}
                              </div>
                              <div className="text-[9px] text-indigo-500 font-semibold uppercase tracking-wider">
                                Readability
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-violet-600 mb-1">
                                {article.analytics.aiScores.engagement || 0}
                              </div>
                              <div className="text-[9px] text-violet-500 font-semibold uppercase tracking-wider">
                                Engagement
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600 mb-1">
                                {article.analytics.aiScores.seo || 0}
                              </div>
                              <div className="text-[9px] text-purple-500 font-semibold uppercase tracking-wider">
                                SEO
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-indigo-200">
                            <div className="text-xs text-indigo-600">
                              <span className="font-semibold">{article.analytics.aiScores.wordCount || 0}</span> words • 
                              <span className="font-semibold ml-1">{article.analytics.aiScores.sentenceCount || 0}</span> sentences • 
                              <span className="font-semibold ml-1">{article.analytics.aiScores.avgSentenceLength || 0}</span> avg length
                            </div>
                          </div>
                        </div>

                        {/* Suggestions */}
                        {article.analytics?.suggestions && article.analytics.suggestions.length > 0 && (
                          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              💡 Suggestions
                            </h4>
                            <div className="space-y-2">
                              {article.analytics.suggestions.slice(0, 3).map((suggestion, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                                    suggestion.severity === 'high' ? 'bg-red-400' :
                                    suggestion.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                                  }`} />
                                  <div className="text-xs text-amber-800 leading-relaxed">
                                    {suggestion.message}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Keyword Analysis */}
                        {article.analytics?.keywordAnalysis && (
                          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              🔍 Keywords
                            </h4>
                            <div className="space-y-2">
                              {article.analytics.keywordAnalysis.topKeywords?.slice(0, 5).map((kw, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-emerald-800">{kw.word}</span>
                                  <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                                    {kw.count}
                                  </span>
                                </div>
                              ))}
                              {article.analytics.keywordAnalysis.missingKeywords?.length > 0 && (
                                <div className="pt-2 border-t border-emerald-200">
                                  <div className="text-xs text-emerald-600 font-semibold mb-1">Consider adding:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {article.analytics.keywordAnalysis.missingKeywords.slice(0, 3).map((kw, idx) => (
                                      <span key={idx} className="text-xs bg-white text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Output actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(article)}
                        title="Copy to clipboard"
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all duration-200 ${
                          copiedId === article._id
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                        }`}
                      >
                        {copiedId === article._id ? <CheckIcon /> : <CopyIcon />}
                        {copiedId === article._id ? 'Copied!' : 'Copy'}
                      </button>

                      {/* View insights */}
                      <a
                        href={article.url?.startsWith('http') ? article.url : `https://google.com/search?q=${encodeURIComponent(article.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
                      >
                        View Insights ↗
                      </a>

                      {/* Phase 5: Export Options */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleExport(article._id, 'json')}
                          title="Export as JSON"
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-100 hover:border-emerald-200 transition-all"
                        >
                          📄
                        </button>
                        <button
                          onClick={() => handleExport(article._id, 'txt')}
                          title="Export as Text"
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-100 hover:border-blue-200 transition-all"
                        >
                          📝
                        </button>
                      </div>

                      {/* Regenerate */}
                      <button
                        onClick={() => handleRegenerate(article._id)}
                        title="Regenerate with AI"
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-100 hover:border-indigo-200 transition-all"
                      >
                        <HiSparkles className="text-xs" />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-4">
                <div className="text-sm text-slate-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} articles
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600 px-2">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            </>
          ) : (
            /* ── Empty output state ──────────────── */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-100 rounded-[1.75rem] flex items-center justify-center shadow-sm">
                  <HiSparkles className="text-indigo-400 text-3xl" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-violet-200 rounded-full opacity-70" />
                <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-indigo-200 rounded-full opacity-70" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No enhanced articles yet</h3>
              <p className="text-slate-400 text-sm max-w-[260px] leading-relaxed">
                Add an article in the workspace, then click{' '}
                <strong className="text-indigo-500 font-semibold">Enhance with AI</strong>{' '}
                to see the results here.
              </p>
              <button
                id="empty-state-create-btn"
                onClick={openNewArticle}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
              >
                + Create Your First Article
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ══ Modal ═══════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-[3px] flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) { setEditId(null); setShowModal(false) } }}
        >
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden animate-scale-in">
            {/* Modal gradient header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-7 pt-6 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editId ? 'Edit Article' : 'New Article'}
                  </h2>
                  <p className="text-indigo-200 text-xs mt-1">
                    {editId ? 'Update your content below' : 'Add your raw content — AI will enhance it'}
                  </p>
                </div>
                <button
                  id="modal-close-btn"
                  onClick={() => { setEditId(null); setShowModal(false) }}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 mt-0.5"
                  aria-label="Close modal"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal form body */}
            <form onSubmit={handleCreate} className="p-7 space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-2">
                  Article Title
                </label>
                <input
                  id="article-title-input"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Future of Conversational Marketing"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-2">
                  Content <span className="text-slate-300 normal-case font-normal tracking-normal">(original)</span>
                </label>
                <textarea
                  id="article-content-input"
                  required
                  rows={7}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste your raw content here. Our AI will analyze and enhance it for you…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all resize-none leading-relaxed"
                />
              </div>
              <button
                id="article-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    {editId ? 'Updating…' : 'Saving…'}
                  </>
                ) : (
                  editId ? '✓ Update Article' : 'Save & Enhance Later →'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
