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


const Spinner = ({ size = 'md' }) => {
  const s = size === 'sm' ? 'w-3.5 h-3.5 border-[2px]' : 'w-5 h-5 border-[2.5px]'
  return (
    <div className={`${s} border-white/40 border-t-white rounded-full animate-spin-loader flex-shrink-0`} />
  )
}


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

// Format plain text content to HTML with proper structure
const formatContentToHTML = (content) => {
  if (!content) return ''
  
  // Check if content is already HTML
  if (/<[a-z][\s\S]*>/i.test(content)) {
    // It's already HTML, return as-is
    return content
  }
  
  // Handle escaped newlines (\n) by converting to actual newlines
  let processedContent = content.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  
  // Split by double newlines for paragraphs
  const paragraphs = processedContent.trim().split(/\n\n+/)
  
  return paragraphs.map(para => {
    const trimmed = para.trim()
    if (!trimmed) return ''
    
    // Check if it's a heading (markdown-style or all caps)
    if (trimmed.match(/^#{1,6}\s/)) {
      const level = trimmed.match(/^#+/)[0].length
      const text = trimmed.replace(/^#+\s/, '')
      return `<h${level} class="text-${level === 1 ? '2xl' : level === 2 ? 'xl' : 'lg'} font-bold text-slate-900 mt-6 mb-4 leading-tight">${text}</h${level}>`
    }
    
    // Check if it's a bullet point list
    if (trimmed.match(/^\s*[-•*]\s/m)) {
      const items = trimmed.split(/\n/).filter(line => line.trim())
      const listHTML = items.map(item => {
        const text = item.replace(/^\s*[-•*]\s+/, '').trim()
        return `<li class="mb-3">${text}</li>`
      }).join('')
      return `<ul class="list-disc ml-5 mb-4">${listHTML}</ul>`
    }
    
    // Regular paragraph
    return `<p class="mb-4">${trimmed}</p>`
  }).join('')
}


function App() {
  const { user, logout, loading: authLoading } = useAuth()

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

  const [copiedId, setCopiedId]       = useState(null)
  const [activePanel, setActivePanel] = useState('input') 

  const [pagination, setPagination]   = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [analytics, setAnalytics]     = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('custom')
  const [showDashboard, setShowDashboard] = useState(false)

  const fetchArticles = (page = 1, search = '', filter = '') => {
    if (!user) return
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10'
    })

    if (search) params.append('search', search)
    
    if (filter === 'original') params.append('original', 'true')
    else if (filter === 'enhanced') params.append('original', 'false')
    else if (filter) params.append('status', filter)

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

  useEffect(() => {
    // Set page title based on authentication state
    if (authLoading) {
      document.title = 'Smart Article AI - Loading...'
    } else if (!user) {
      document.title = authMode === 'login' 
        ? 'Sign In - Smart Article AI' 
        : 'Sign Up - Smart Article AI'
    } else {
      document.title = 'Smart Article AI - Content Creation Dashboard'
    }
  }, [user, authLoading, authMode])

  useEffect(() => { if (user) fetchArticles() }, [user])

  const fetchAnalytics = () => {
    if (!user) return
    axios.get(`${API_BASE}/articles/analytics/dashboard`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error('Failed to fetch analytics:', err))
  }

  useEffect(() => { if (user) fetchAnalytics() }, [user])

  const processingCount = articles.filter(a => a.status === 'processing').length;
  useEffect(() => {
    if (processingCount > 0) {
      const interval = setInterval(() => {
        fetchArticles(pagination.page)
        fetchAnalytics()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [processingCount, pagination.page])

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
      setEditId(null)
      setShowModal(true)
    }
  }

  const handleRegenerate = async (articleId) => {
    try {
      await axios.post(`${API_BASE}/articles/${articleId}/regenerate`)
      fetchArticles(pagination.page, searchQuery, statusFilter)
      fetchAnalytics()
      alert('Article regeneration started! Check back in a moment.')
    } catch (error) {
      console.error('Regeneration failed:', error)
      alert('Failed to regenerate article. Please try again.')
    }
  }
  
  const handleCreate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        original: true
      }

      if (!payload.url || payload.url.trim() === '') {
        delete payload.url
      }

      let newArticleId = null
      if (editId) {
        await axios.put(`${API_BASE}/articles/${editId}`, payload)
      } else {
        const res = await axios.post(`${API_BASE}/articles`, payload)
        newArticleId = res.data._id
      }
      
      const shouldAutoEnhance = !editId && formData.autoEnhance;
      
      setFormData({
        title: '',
        content: '',
        url: '',
        template: 'custom',
        writingStyle: 'formal',
        tone: 'professional',
        autoEnhance: false
      })
      setEditId(null)
      setShowModal(false)
      // On create, we usually want to see the new article, so we clear filters
      setSearchQuery('')
      setStatusFilter('')
      fetchArticles(1, '', '')
      fetchAnalytics()
      
      if (shouldAutoEnhance && newArticleId) {
        try {
          const response = await axios.post(`${API_BASE}/articles/${newArticleId}/enhance`)
          if (response.data.message === 'Enhancement queued') {
            alert('Enhancement queued! Processing in background...')
          }
          fetchArticles(1, '', '')
          fetchAnalytics()
        } catch (err) {
          alert('Enhancement failed: ' + (err.response?.data?.message || err.message))
        }
      }
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
      fetchArticles(1, searchQuery, statusFilter)
      fetchAnalytics()
    } catch (err) {
      if (err.response?.status === 401) logout()
      else alert('Error clearing articles')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await axios.delete(`${API_BASE}/articles/${id}`);
      fetchArticles(pagination.page, searchQuery, statusFilter);
      fetchAnalytics();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else alert('Failed to delete article: ' + (err.response?.data?.error || err.message));
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
      
      fetchArticles(pagination.page, searchQuery, statusFilter)
      fetchAnalytics()
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

  
  const originals = articles.filter(a => a.original === true)
  const enhanced  = articles.filter(a => !a.original)

  
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

  if (loading && articles.length === 0) return (
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

  
  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#F8FAFC] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="sticky top-0 z-20 h-[56px] bg-white/90 backdrop-blur-md border-b border-slate-200 px-5 flex items-center justify-between flex-shrink-0">

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-300">
            <HiSparkles className="text-white text-sm" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">
            Smart<span className="text-indigo-600">Article</span> AI
          </span>
        </div>

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

      <div className="flex flex-1 overflow-hidden min-h-0">

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
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">📄</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Articles</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{analytics.totalArticles}</div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">✍️</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Readability</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{analytics.averageScores.readability}%</div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analytics.averageScores.readability}%` }} />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">🔥</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Engagement</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{analytics.averageScores.engagement}%</div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${analytics.averageScores.engagement}%` }} />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">🚀</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg SEO Score</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{analytics.averageScores.seo}%</div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${analytics.averageScores.seo}%` }} />
                        </div>
                      </div>
                    </div>

                    {analytics?.lastArticle && (
                      <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Activity</h3>
                          <div className="text-xs text-slate-400">Latest enhancement tracker</div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">💡</div>
                            <div>
                              <div className="font-black text-slate-900 text-lg line-clamp-1">{analytics.lastArticle.title}</div>
                              <div className="text-xs text-slate-400 font-medium">
                                Optimized on {new Date(analytics.lastArticle.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Status</div>
                              <div className="text-xs font-black text-slate-900 uppercase">{analytics.lastArticle.status}</div>
                            </div>
                            <span className={`w-3 h-3 rounded-full animate-pulse ${
                              analytics.lastArticle.status === 'completed' ? 'bg-emerald-500' :
                              analytics.lastArticle.status === 'processing' ? 'bg-blue-500' : 'bg-rose-500'
                            }`} />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="animate-spin-loader w-8 h-8 border-indigo-600 border-t-transparent border-4 rounded-full mx-auto mb-4" />
                    <div className="text-sm text-slate-400 font-bold uppercase tracking-widest">Synthesizing Analytics...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <aside
          className={`
            ${activePanel !== 'input' ? 'hidden md:flex' : 'flex'}
            flex-col w-full md:w-[400px] lg:w-[440px] xl:w-[460px]
            border-r border-slate-200 bg-white flex-shrink-0 overflow-y-auto
          `}
        >
    
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

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleStatusFilter('')}
                className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left ${
                  statusFilter === '' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">📊</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</div>
                </div>
                <div className="text-2xl font-black text-slate-900 leading-none">{analytics?.totalArticles || 0}</div>
              </button>
              <button
                onClick={() => handleStatusFilter('original')}
                className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left ${
                  statusFilter === 'original' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500">✍️</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Originals</div>
                </div>
                <div className="text-2xl font-black text-slate-900 leading-none">{analytics?.totalOriginals || 0}</div>
              </button>
              <button
                onClick={() => handleStatusFilter('processing')}
                className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left ${
                  statusFilter === 'processing' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">⚡</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Processing</div>
                </div>
                <div className="text-2xl font-black text-slate-900 leading-none">{analytics?.totalProcessing || 0}</div>
              </button>
              <button
                onClick={() => handleStatusFilter('enhanced')}
                className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left ${
                  statusFilter === 'enhanced' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">🌟</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enhanced</div>
                </div>
                <div className="text-2xl font-black text-slate-900 leading-none">{analytics?.totalEnhanced || 0}</div>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-5 flex-1">

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
                                        <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => handleEdit(article)}
                              className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold transition-colors"
                            >
                              Edit
                            </button>
                            <span className="text-slate-200 select-none">|</span>
                            <button
                              onClick={() => handleDelete(article._id)}
                              className="text-[11px] text-rose-400 hover:text-rose-600 font-semibold transition-colors"
                            >
                              Delete
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

        <section
          className={`
            ${activePanel !== 'output' ? 'hidden md:flex' : 'flex'}
            flex-1 flex-col overflow-y-auto bg-[#F8FAFC] p-5 lg:p-8 relative
          `}
        >
          <div className="flex flex-col gap-6 mb-8 flex-shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                    <HiSparkles className="text-lg" />
                  </div>
                  Workspace Dashboard
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium ml-10.5">
                  Showing {articles.length} article{articles.length !== 1 ? 's' : ''} in this view
                </p>
              </div>

              <div className="relative group w-full lg:max-w-md">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Find an article..."
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-10 py-3.5 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm shadow-slate-100/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 border border-slate-200/60 rounded-2xl w-fit">
              <button
                onClick={() => handleStatusFilter('')}
                className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 ${
                  statusFilter === '' 
                    ? 'bg-white text-indigo-600 shadow-sm shadow-indigo-100 ring-1 ring-slate-200' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Total
              </button>
              <button
                onClick={() => handleStatusFilter('original')}
                className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 ${
                  statusFilter === 'original' 
                    ? 'bg-white text-emerald-600 shadow-sm shadow-emerald-100 ring-1 ring-slate-200' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Originals
              </button>
              <button
                onClick={() => handleStatusFilter('enhanced')}
                className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 ${
                  statusFilter === 'enhanced' 
                    ? 'bg-white text-violet-600 shadow-sm shadow-violet-100 ring-1 ring-slate-200' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Enhanced
              </button>
            </div>
          </div>

          {articles.length > 0 ? (
            <>
            <div className="flex flex-col gap-6 pb-10 w-full">
              {articles.map((article, idx) => (
                <div
                  key={article._id}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <div className={`h-[4.5px] ${
                    article.original 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                      : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500'
                  }`} />

                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        article.original
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {article.original ? '✍️ Original Draft' : '✨ AI Enhanced'}
                      </span>
                      
                      {!article.original && article.analytics?.sentiment && (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                          article.analytics.sentiment === 'Positive'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {article.analytics.sentiment} Tone
                        </span>
                      )}

                      <span className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-xl border border-slate-100 uppercase tracking-wider ml-auto">
                        🕒 {Math.ceil((article.content || '').split(/\s+/).length / 200)} min read
                      </span>
                    </div>

                    {(article.original || article.showOriginal || !article.enhancedContent) && (
                      <h1
                        className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-indigo-700 mb-6 leading-tight outline-none transition-colors"
                      >
                        {article.title}
                      </h1>
                    )}

                    <div className="relative">
                      {!article.original && (
                        <div className="flex items-center justify-end gap-2 mb-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${!article.showOriginal ? 'text-indigo-600' : 'text-slate-400'}`}>Enhanced AI</span>
                          <button
                            onClick={() => {
                              setArticles(articles.map(a => a._id === article._id ? { ...a, showOriginal: !a.showOriginal } : a));
                            }}
                            className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${article.showOriginal ? 'bg-amber-400' : 'bg-indigo-600'}`}
                          >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200 ${article.showOriginal ? 'left-[17px]' : 'left-0.5'}`} />
                          </button>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${article.showOriginal ? 'text-amber-600' : 'text-slate-400'}`}>Original Draft</span>
                        </div>
                      )}

                      <div 
                        className={`prose-container text-[16px] leading-relaxed mb-8 max-h-[500px] overflow-y-auto pr-6 custom-scrollbar transition-all duration-300 ${
                          article.original || article.showOriginal ? 'text-slate-600 opacity-90' : 'text-slate-700 font-normal'
                        }`}
                        dangerouslySetInnerHTML={{ 
                          __html: formatContentToHTML(
                            (article.original || article.showOriginal) ? article.content : (article.enhancedContent || article.content)
                          )
                        }}
                      />
                    </div>

                    {!article.original && article.analytics?.aiScores && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                         <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                            <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Readability</div>
                            <div className="text-xl font-black text-indigo-700">{article.analytics.aiScores.readability || 0}%</div>
                         </div>
                         <div className="bg-violet-50/50 rounded-2xl p-4 border border-violet-100/50">
                            <div className="text-[10px] text-violet-400 font-black uppercase tracking-widest mb-1">Engagement</div>
                            <div className="text-xl font-black text-violet-700">{article.analytics.aiScores.engagement || 0}%</div>
                         </div>
                         <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                            <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">SEO Score</div>
                            <div className="text-xl font-black text-emerald-700">{article.analytics.aiScores.seo || 0}%</div>
                         </div>
                       </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
                      <button
                        onClick={() => handleCopy(article)}
                        className={`flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl border transition-all duration-200 ${
                          copiedId === article._id
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {copiedId === article._id ? <CheckIcon /> : <CopyIcon />}
                        {copiedId === article._id ? 'Copied!' : 'Copy content'}
                      </button>

                      {article.original && (
                         <button
                           onClick={() => handleEnhance(article._id)}
                           className="flex items-center gap-2 text-xs font-bold px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all ml-auto"
                         >
                           <HiSparkles className="text-sm" />
                           Enhance with AI
                         </button>
                      )}

                      {!article.original && (
                         <div className="flex items-center gap-3 ml-auto">
                           <button
                             onClick={() => handleRegenerate(article._id)}
                             className="flex items-center gap-2 text-xs font-bold px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                           >
                             <HiSparkles className="text-sm" />
                             Regenerate
                           </button>
                         </div>
                      )}
                      
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Article"
                      >
                        <FaTrash className="text-sm" />
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
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
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

      {showModal && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-[3px] flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) { setEditId(null); setShowModal(false) } }}
        >
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden animate-scale-in">
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
              
              {!editId && (
                <div className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors">
                  <input
                    type="checkbox"
                    id="auto-enhance-checkbox"
                    checked={formData.autoEnhance || false}
                    onChange={(e) => setFormData({ ...formData, autoEnhance: e.target.checked })}
                    className="w-4 h-4 flex-shrink-0 text-indigo-600 rounded border-indigo-200 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="auto-enhance-checkbox" className="text-sm text-slate-700 font-semibold cursor-pointer select-none flex-1">
                    ✨ Enhance immediately with AI
                  </label>
                </div>
              )}

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
                  editId ? '✓ Update Article' : 'Save Article'
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