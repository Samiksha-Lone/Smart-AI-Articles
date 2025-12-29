// // import { useEffect, useState } from 'react'
// // import axios from 'axios'

// // function App() {
// //   const [articles, setArticles] = useState([])
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     axios.get('http://localhost:5000/api/articles')
// //       .then(res => {
// //         console.log('API Response:', res.data) // DEBUG
// //         setArticles(res.data)
// //         setLoading(false)
// //       })
// //       .catch(err => {
// //         console.error('Frontend Error:', err)
// //         setLoading(false)
// //       })
// //   }, [])

// //   const originals = articles.filter(a => a.original === true)
// //   const enhanced = articles.filter(a => a.original === false || a.is_updated === true)

// //   console.log('Originals:', originals.length, 'Enhanced:', enhanced.length) // DEBUG

// //   if (loading) return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
// //       <div className="text-4xl font-bold text-slate-400 animate-pulse">Loading articles...</div>
// //     </div>
// //   )

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="text-center mb-20">
// //           <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-6">
// //             BeyondChats Assignment 🚀
// //           </h1>
// //           <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
// //             Phase 1: Backend APIs | Phase 2: AI Enhancer | Phase 3: Responsive Frontend
// //           </p>
// //           <div className="flex flex-wrap justify-center items-center gap-6 text-lg text-slate-600">
// //             <span>Total Articles: <span className="font-black text-3xl text-blue-600">{articles.length}</span></span>
// //             <span>Original: <span className="font-bold text-blue-600">{originals.length}</span></span>
// //             <span>Enhanced: <span className="font-bold text-emerald-600">{enhanced.length}</span></span>
// //             <a href="http://localhost:5000/api/articles" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg">
// //               View Raw API →
// //             </a>
// //             {/* <a href="https://github.com/YOUR_USERNAME/beyondchats-assignment" target="_blank" rel="noopener noreferrer"
// //                className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-all shadow-lg">
// //               🌐 View on GitHub
// //             </a> */}
// //           </div>
// //         </div>

// //         {/* Two Column Layout */}
// //         <div className="grid lg:grid-cols-2 gap-12 items-start">
          
// //           {/* Original Articles */}
// //           <section>
// //             <h2 className="text-4xl font-bold text-slate-900 mb-12 flex items-center gap-4">
// //               📄 Original Articles
// //               <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-lg font-bold">
// //                 {originals.length}
// //               </span>
// //             </h2>
            
// //             {originals.length === 0 ? (
// //               <div className="text-center py-20">
// //                 <p className="text-2xl text-slate-500 mb-4">No original articles</p>
// //                 <p className="text-slate-400">All articles have been AI enhanced! 🎉</p>
// //               </div>
// //             ) : (
// //               <div className="space-y-6">
// //                 {originals.map(article => (
// //                   <div key={article._id} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-blue-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
// //                     <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 mb-4 line-clamp-2">
// //                       {article.title}
// //                     </h3>
// //                     <p className="text-slate-600 leading-relaxed line-clamp-4 mb-6">
// //                       {article.excerpt}
// //                     </p>
// //                     <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all border-2 border-blue-100">
// //                       Read Original →
// //                     </a>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </section>

// //           {/* Enhanced Articles */}
// //           <section>
// //             <h2 className="text-4xl font-bold text-emerald-900 mb-12 flex items-center gap-4">
// //               ✨ AI Enhanced Articles
// //               <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl text-lg font-bold">
// //                 {enhanced.length}
// //               </span>
// //             </h2>
            
// //             <div className="space-y-6">
// //               {enhanced.map(article => (
// //                 <div key={article._id} className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-emerald-200 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
// //                   <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 mb-4 line-clamp-2">
// //                     {article.title}
// //                   </h3>
// //                   <p className="text-slate-600 leading-relaxed line-clamp-4 mb-6">
// //                     {article.excerpt}
// //                   </p>
// //                   {article.references && article.references.length > 0 && (
// //                     <div className="flex flex-wrap gap-2 mb-6">
// //                       {article.references.slice(0, 3).map((ref, i) => (
// //                         <span key={i} className="px-3 py-1 bg-emerald-200 text-emerald-800 text-sm font-medium rounded-full">
// //                           {ref.length > 25 ? ref.slice(0, 22) + '...' : ref}
// //                         </span>
// //                       ))}
// //                     </div>
// //                   )}
// //                   <a 
// //                     href={article.url || `http://localhost:5000/api/articles/${article._id}`} 
// //                     target="_blank" 
// //                     rel="noopener noreferrer"
// //                     className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold bg-emerald-50 px-6 py-3 rounded-2xl hover:bg-emerald-100 transition-all border-2 border-emerald-200"
// //                   >
// //                     Read Enhanced Article →
// //                   </a>
// //                 </div>
// //               ))}
// //             </div>
// //           </section>
// //         </div>
// //       </div>
// //       <a href="https://github.com/YOUR_USERNAME/beyondchats-assignment" target="_blank" rel="noopener noreferrer"
// //                className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-all shadow-lg">
// //               🌐 View on GitHub
// //             </a>

// //     </div>
// //   )
// // }

// // export default App










// import { useEffect, useState } from 'react'
// import axios from 'axios'

// function App() {
//   const [articles, setArticles] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/articles')
//       .then(res => {
//         console.log('API Response:', res.data)
//         setArticles(res.data)
//         setLoading(false)
//       })
//       .catch(err => {
//         console.error('Frontend Error:', err)
//         setLoading(false)
//       })
//   }, [])

//   const originals = articles.filter(a => a.original === true)
//   const enhanced = articles.filter(a => a.original === false || a.is_updated === true)

//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//       <div className="text-4xl font-bold text-slate-400 animate-pulse">Loading articles...</div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-20">
//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-6">
//             BeyondChats Assignment 🚀
//           </h1>
//           <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
//             Phase 1: Backend APIs | Phase 2: AI Enhancer | Phase 3: Responsive Frontend
//           </p>
//           <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-lg text-slate-600 mb-8">
//             <span className="bg-white px-4 py-2 rounded-xl shadow-md">
//               Total: <span className="font-black text-3xl text-blue-600">{articles.length}</span>
//             </span>
//             <span className="bg-white px-4 py-2 rounded-xl shadow-md">
//               Original: <span className="font-bold text-blue-600">{originals.length}</span>
//             </span>
//             <span className="bg-white px-4 py-2 rounded-xl shadow-md">
//               Enhanced: <span className="font-bold text-emerald-600">{enhanced.length}</span>
//             </span>
//           </div>
//           <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
//             <a href="http://localhost:5000/api/articles" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg">
//               View Raw API →
//             </a>
//             <a href="https://github.com/YOUR_USERNAME/beyondchats-assignment" target="_blank" rel="noopener noreferrer"
//                className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-all shadow-lg">
//               🌐 View on GitHub
//             </a>
//           </div>
//         </div>

//         {/* ✨ ENHANCED ARTICLES FIRST - Horizontal Cards */}
//         {enhanced.length > 0 && (
//           <section className="mb-20">
//             <h2 className="text-4xl md:text-5xl font-black text-emerald-900 mb-12 text-center">
//               ✨ AI Enhanced Articles ({enhanced.length})
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {enhanced.map(article => (
//                 <div key={article._id} className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl border border-emerald-200 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-3 cursor-pointer h-full">
//                   <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 mb-4 line-clamp-2 leading-tight">
//                     {article.title}
//                   </h3>
//                   <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6 text-sm sm:text-base">
//                     {article.excerpt}
//                   </p>
//                   {article.references && article.references.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mb-6">
//                       {article.references.slice(0, 3).map((ref, i) => (
//                         <span key={i} className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium rounded-full">
//                           {ref.length > 20 ? ref.slice(0, 17) + '...' : ref}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                   <a 
//                     href={article.url || `http://localhost:5000/api/articles/${article._id}`} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold bg-emerald-50 px-5 py-2 sm:px-6 sm:py-3 rounded-2xl hover:bg-emerald-100 transition-all border-2 border-emerald-200 w-full justify-center"
//                   >
//                     Read Enhanced Article →
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* 📄 ORIGINAL ARTICLES SECOND - Horizontal Cards */}
//         {originals.length > 0 && (
//           <section>
//             <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 text-center">
//               📄 Original Articles ({originals.length})
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {originals.map(article => (
//                 <div key={article._id} className="group bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl border border-blue-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-3 cursor-pointer h-full">
//                   <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-700 mb-4 line-clamp-2 leading-tight">
//                     {article.title}
//                   </h3>
//                   <p className="text-slate-600 leading-relaxed line-clamp-3 mb-6 text-sm sm:text-base">
//                     {article.excerpt}
//                   </p>
//                   <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-5 py-2 sm:px-6 sm:py-3 rounded-2xl hover:bg-blue-100 transition-all border-2 border-blue-100 w-full justify-center">
//                     Read Original →
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Empty State */}
//         {articles.length === 0 && (
//           <div className="text-center py-20">
//             <div className="text-6xl mb-8">📝</div>
//             <h2 className="text-4xl font-black text-slate-900 mb-4">No Articles Yet</h2>
//             <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
//               Run the scraper to populate articles from BeyondChats blog (page 14-15)
//             </p>
//             <a href="http://localhost:5000/api/scrape" className="px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-2xl hover:bg-emerald-700 transition-all shadow-xl">
//               🕷️ Run Scraper
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default App








// import { useEffect, useState } from 'react'
// import axios from 'axios'

// function App() {
//   const [articles, setArticles] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/articles')
//       .then(res => {
//         console.log('API Response:', res.data)
//         setArticles(res.data)
//         setLoading(false)
//       })
//       .catch(err => {
//         console.error('Frontend Error:', err)
//         setLoading(false)
//       })
//   }, [])

//   const originals = articles.filter(a => a.original === true)
//   const enhanced = articles.filter(a => a.original === false || a.is_updated === true)

//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//       <div className="text-4xl font-bold text-slate-400 animate-pulse">Loading articles...</div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-20">
//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-6">
//             BeyondChats Assignment 🚀
//           </h1>
//           <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
//             Phase 1: Backend APIs | Phase 2: AI Enhancer | Phase 3: Responsive Frontend
//           </p>
//           <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-lg text-slate-600 mb-8">
//             <span className="bg-white px-4 py-2 rounded-xl shadow-md">
//               Total: <span className="font-black text-3xl text-blue-600">{articles.length}</span>
//             </span>
//             <span className="bg-white px-4 py-2 rounded-xl shadow-md">
//               Original: <span className="font-bold text-blue-600">{originals.length}</span>
//             </span>
//             <span className="bg-white px-4 py-2 rounded-xl shadow-md">
//               Enhanced: <span className="font-bold text-emerald-600">{enhanced.length}</span>
//             </span>
//           </div>
//           <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
//             <a href="http://localhost:5000/api/articles" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg">
//               View Raw API →
//             </a>
//             <a href="https://github.com/YOUR_USERNAME/beyondchats-assignment" target="_blank" rel="noopener noreferrer"
//                className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-all shadow-lg">
//               🌐 View on GitHub
//             </a>
//           </div>
//         </div>

//         {/* ✨ ENHANCED ARTICLES FIRST - ORIGINAL Card Structure */}
//         {enhanced.length > 0 && (
//           <section className="mb-20">
//             <h2 className="text-4xl font-bold text-emerald-900 mb-12 flex items-center gap-4 justify-center">
//               ✨ AI Enhanced Articles
//               <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl text-lg font-bold">
//                 {enhanced.length}
//               </span>
//             </h2>
            
//             <div className="grid lg:grid-cols-2 gap-12 items-start">
//               <div className="space-y-6">
//                 {enhanced.map(article => (
//                   <div key={article._id} className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-emerald-200 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
//                     <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 mb-4 line-clamp-2">
//                       {article.title}
//                     </h3>
//                     <p className="text-slate-600 leading-relaxed line-clamp-4 mb-6">
//                       {article.excerpt}
//                     </p>
//                     {article.references && article.references.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mb-6">
//                         {article.references.slice(0, 3).map((ref, i) => (
//                           <span key={i} className="px-3 py-1 bg-emerald-200 text-emerald-800 text-sm font-medium rounded-full">
//                             {ref.length > 25 ? ref.slice(0, 22) + '...' : ref}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                     <a 
//                       href={article.url || `http://localhost:5000/api/articles/${article._id}`} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold bg-emerald-50 px-6 py-3 rounded-2xl hover:bg-emerald-100 transition-all border-2 border-emerald-200"
//                     >
//                       Read Enhanced →
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* 📄 ORIGINAL ARTICLES SECOND - ORIGINAL Card Structure */}
//         {originals.length > 0 && (
//           <section>
//             <h2 className="text-4xl font-bold text-slate-900 mb-12 flex items-center gap-4 justify-center">
//               📄 Original Articles
//               <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-lg font-bold">
//                 {originals.length}
//               </span>
//             </h2>
            
//             <div className="grid lg:grid-cols-2 gap-12 items-start">
//               <div className="space-y-6">
//                 {originals.map(article => (
//                   <div key={article._id} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-blue-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
//                     <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 mb-4 line-clamp-2">
//                       {article.title}
//                     </h3>
//                     <p className="text-slate-600 leading-relaxed line-clamp-4 mb-6">
//                       {article.excerpt}
//                     </p>
//                     <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all border-2 border-blue-100">
//                       Read Original →
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   )
// }

// export default App















import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/api/articles')
      .then(res => {
        console.log('API Response:', res.data)
        setArticles(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Frontend Error:', err)
        setLoading(false)
      })
  }, [])

  const originals = articles.filter(a => a.original === true)
  const enhanced = articles.filter(a => a.original === false || a.is_updated === true)

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-4xl font-bold text-slate-400 animate-pulse">Loading articles...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-6">
            BeyondChats Assignment 🚀
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
            Phase 1: Backend APIs | Phase 2: AI Enhancer | Phase 3: Responsive Frontend
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-lg text-slate-600 mb-8">
            <span className="bg-white px-4 py-2 rounded-xl shadow-md">
              Total: <span className="font-black text-3xl text-blue-600">{articles.length}</span>
            </span>
            <span className="bg-white px-4 py-2 rounded-xl shadow-md">
              Original: <span className="font-bold text-blue-600">{originals.length}</span>
            </span>
            <span className="bg-white px-4 py-2 rounded-xl shadow-md">
              Enhanced: <span className="font-bold text-emerald-600">{enhanced.length}</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <a href="https://beyondchats-assignment-backend.onrender.com/api/articles" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg">
              View Raw API →
            </a>
            <a href="https://github.com/Samiksha-Lone/beyondchats-assignment" target="_blank" rel="noopener noreferrer"
               className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-all shadow-lg ml-auto sm:ml-0">
              🌐 View on GitHub
            </a>
          </div>
        </div>

        {/* ✨ ENHANCED FIRST - SAME Cards Horizontally */}
        {enhanced.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-emerald-900 mb-12 flex items-center gap-4 justify-center">
              ✨ AI Enhanced Articles
              <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl text-lg font-bold">
                {enhanced.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enhanced.map(article => (
                <div key={article._id} className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-emerald-200 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 mb-4 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed line-clamp-4 mb-6">
                    {article.excerpt}
                  </p>
                  {article.references && article.references.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.references.slice(0, 3).map((ref, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-200 text-emerald-800 text-sm font-medium rounded-full">
                          {ref.length > 25 ? ref.slice(0, 22) + '...' : ref}
                        </span>
                      ))}
                    </div>
                  )}
                  <a 
                    href={article.url || `http://localhost:5000/api/articles/${article._id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold bg-emerald-50 px-6 py-3 rounded-2xl hover:bg-emerald-100 transition-all border-2 border-emerald-200"
                  >
                    Read Enhanced →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 📄 ORIGINAL SECOND - SAME Cards Horizontally */}
        {originals.length > 0 && (
          <section>
            <h2 className="text-4xl font-bold text-slate-900 mb-12 flex items-center gap-4 justify-center">
              📄 Original Articles
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl text-lg font-bold">
                {originals.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {originals.map(article => (
                <div key={article._id} className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-blue-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 mb-4 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed line-clamp-4 mb-6">
                    {article.excerpt}
                  </p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all border-2 border-blue-100">
                    Read Original →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App

