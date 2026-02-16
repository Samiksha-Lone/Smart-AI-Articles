import { useEffect, useState } from 'react'
import axios from 'axios'
import { MdDashboard } from 'react-icons/md'
import { IoMdAdd } from 'react-icons/io'
import { FaTrash } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { IoDocumentText } from 'react-icons/io5'

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://beyondchats-assignment-backend.onrender.com/api'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', url: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editId, setEditId] = useState(null)

  const fetchArticles = () => {
    setLoading(true)
    axios.get(`${API_BASE}/articles`)
      .then(res => {
        setArticles(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editId) {
        await axios.put(`${API_BASE}/articles/${editId}`, { ...formData, original: true })
      } else {
        await axios.post(`${API_BASE}/articles`, { ...formData, original: true })
      }
      setFormData({ title: '', content: '', url: '' })
      setEditId(null)
      setShowModal(false)
      fetchArticles()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving article')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      content: article.content,
      url: article.url || ''
    })
    setEditId(article._id)
    setShowModal(true)
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL articles?')) return
    try {
      for (const article of articles) {
        await axios.delete(`${API_BASE}/articles/${article._id}`)
      }
      fetchArticles()
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Error clearing articles')
    }
  }

  const handleEnhance = async (articleId) => {
    const originalText = originals.find(a => a._id === articleId)?.title
    if (!window.confirm(`Ready to enhance "${originalText}" with AI?`)) return
    
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/articles/${articleId}/enhance`)
      console.log('Enhancement successful:', response.data)
      fetchArticles()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error executing AI enhancement'
      console.error('Enhancement error details:', err.response?.data)
      alert(`Enhancement failed: ${errorMessage}`)
      setLoading(false)
    }
  }

  const originals = articles.filter(a => a.original === true)
  const enhanced = articles.filter(a => !a.original)

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-bold text-slate-400">Loading Intelligence...</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 z-30">
        <div className="text-2xl font-black text-slate-900 mb-12 flex items-center gap-2">
          <span className="text-blue-600">Smart</span>Article AI
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-all">
            <MdDashboard className="text-lg" /> Dashboard View
          </button>
          <button 
            onClick={() => {
              setEditId(null)
              setFormData({ title: '', content: '', url: '' })
              setShowModal(true)
            }} 
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all"
          >
            <IoMdAdd className="text-lg" /> Create Article
          </button>
          <button onClick={handleDeleteAll} className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-all">
            <FaTrash className="text-lg" /> Clear Database
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">System Status</div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            AI Engine Connected
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 min-h-screen p-6 md:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">ML Analytics Dashboard</h1>
            <p className="text-slate-500 font-medium font-inter">Monitor and enhance your content ecosystem in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setEditId(null)
                setFormData({ title: '', content: '', url: '' })
                setShowModal(true)
              }}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-200"
            >
              + New Article
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Total Documents</div>
            <div className="text-5xl font-black text-slate-900">{articles.length}</div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Awaiting Enhancement</div>
            <div className="text-5xl font-black text-blue-600">{originals.length}</div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm border-emerald-100 bg-emerald-50/30">
            <div className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-4">AI Optimized</div>
            <div className="text-5xl font-black text-emerald-600">{enhanced.length}</div>
          </div>
        </div>

        {enhanced.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2"><HiSparkles className="text-emerald-600" /> Optimized Content</h2>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                AI ANALYST DATA
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {enhanced.map(article => (
                <div key={article._id} className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:-translate-y-2">
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                      article.analytics?.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-700' : 
                      article.analytics?.sentiment === 'Negative' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {article.analytics?.sentiment || 'Neutral'}
                    </span>
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-xs font-black rounded-xl border border-slate-100 uppercase tracking-widest">
                      {article.analytics?.tone || 'Professional'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 mb-4 line-clamp-2 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-500 leading-relaxed line-clamp-3 mb-8 text-sm font-medium">
                    {article.excerpt}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-tighter">Readability</div>
                      <div className="text-lg font-black text-slate-900">{article.analytics?.readabilityScore || 85}%</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-tighter">Keywords</div>
                      <div className="text-lg font-black text-slate-900">{article.analytics?.keywords?.length || 5}</div>
                    </div>
                  </div>

                  <a 
                    href={article.url?.startsWith('http') ? article.url : `https://google.com/search?q=${encodeURIComponent(article.title)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 text-slate-900 hover:text-white font-black bg-white px-6 py-4 rounded-2xl hover:bg-slate-900 transition-all border-2 border-slate-100 hover:border-slate-900 shadow-sm"
                  >
                    View Insights →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {originals.length > 0 && (
          <section>
             <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2"><IoDocumentText className="text-blue-600" /> Source Material</h2>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                AWAITING ENHANCEMENT
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {originals.map(article => (
                <div key={article._id} className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:-translate-y-1">
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-600 mb-4 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 mb-8 font-medium">
                    {article.content.slice(0, 180)}...
                  </p>
                  <div className="flex items-center justify-between mt-auto gap-2">
                    <span className="text-[10px] uppercase font-black text-slate-300">Raw Input</span>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(article)}
                        className="text-slate-400 font-bold text-xs hover:text-slate-600 uppercase tracking-widest transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleEnhance(article._id)}
                        className="text-blue-600 font-black text-xs hover:text-blue-700 hover:underline uppercase tracking-widest transition-colors flex items-center gap-1"
                      >
                        <HiSparkles /> Enhance
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => {
                setEditId(null)
                setShowModal(false)
              }}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-4xl font-black text-slate-900 mb-4">
              {editId ? 'Edit Article' : 'Define Your Vision'}
            </h2>
            <p className="text-slate-500 font-medium mb-10">
              {editId ? 'Update your content details below.' : 'Input your core content. Our AI Engine will perform deep analysis and enhancement.'}
            </p>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Article Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900"
                  placeholder="e.g. The Future of Conversational Marketing"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Core Content (Original)</label>
                <textarea 
                  required
                  rows="6"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900 resize-none"
                  placeholder="Paste your raw content here..."
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? (editId ? 'Updating...' : 'Architecting...') : (editId ? 'Update Article' : 'Deploy to Engine →')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

