// //GuestPage.jsx

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./GuestPage.css";

// const posts = [
//   {
//     PostId: 1,
//     Title: "How to connect to company VPN",
//     Body: "Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.",
//     Tags: [{ TagId: 1, TagName: "VPN" }, { TagId: 2, TagName: "IT" }],
//     DeptId: "Dept-4",
//     UpvoteCount: 12,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:51:21",
//   },
//   {
//     PostId: 2,
//     Title: "How to raise leave request",
//     Body: "Open HR portal → My Requests → New Leave. Select dates, reason and approver. Attach docs if needed. Manager gets a notification.",
//     Tags: [{ TagId: 3, TagName: "HR" }, { TagId: 4, TagName: "Leave" }],
//     DeptId: "Dept-6",
//     UpvoteCount: 8,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:57:11",
//   },
//   {
//     PostId: 3,
//     Title: "Setup local SQL Server",
//     Body: "Install SQL Server Express, enable TCP/IP, create SQL auth user and update connection string in appsettings.json.",
//     Tags: [{ TagId: 5, TagName: "SQL" }, { TagId: 6, TagName: "Server" }],
//     DeptId: "Dept-6",
//     UpvoteCount: 10,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T23:11:43",
//   },
//   {
//     PostId: 4,
//     Title: "How to connect to company VPN",
//     Body: "Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.",
//     Tags: [{ TagId: 1, TagName: "VPN" }, { TagId: 2, TagName: "IT" }],
//     DeptId: "Dept-4",
//     UpvoteCount: 12,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:51:21",
//   },
//   {
//   PostId: 5,
//     Title: "How to connect to company VPN",
//     Body: "Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.",
//     Tags: [{ TagId: 1, TagName: "VPN" }, { TagId: 2, TagName: "IT" }],
//     DeptId: "Dept-4",
//     UpvoteCount: 12,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:51:21",
//   },
// ];

// export default function GuestPage() {
//   const navigate = useNavigate();
//   const [showScrollPrompt, setShowScrollPrompt] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/feed", { replace: true });
//     }

//     const handleScroll = () => {
//       if (window.scrollY > 300) {
//         setShowScrollPrompt(true);
//         window.removeEventListener("scroll", handleScroll);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [navigate]);

//   const handleView = () => {
//     setShowModal(true);
//   };

//   return (
//     <div className="guest-page">
//       <header className="header-container">
//         <div className="top-nav">
//           <div className="nav-left">
//             <div className="logo-container">
//               <img src="/fnfi.png"></img>
//             </div>
//           </div>
//           <div className="nav-right">
//             <button className="nav-btn" onClick={() => navigate("/signup")}>
//               Sign Up
//             </button>
//             <button className="nav-btn" onClick={() => navigate("/login")}>
//               Login
//             </button>
//           </div>
//         </div>
//       </header>

//       <section className="guest-header">
//         <h1>Welcome to FNF Knowledge Hub</h1>
//       </section>

//       <div className="qna-container">
//         {posts.map((post) => {
//           const excerpt =
//             post.Body && post.Body.length > 160
//               ? post.Body.slice(0, 157) + "..."
//               : post.Body;

//           return (
//             <div
//               key={post.PostId}
//               style={{
//                 border: "1px solid #e6edf3",
//                 borderRadius: 8,
//                 padding: 16,
//                 background: "#fff",
//                 boxShadow: "0 1px 4px rgba(2,6,23,0.04)",
//                 marginBottom: 24,
//               }}
//             >
//               <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
//                 <div style={{ flex: 1 }}>
//                   <h3 style={{ margin: "0 0 8px" }}>{post.Title}</h3>
//                   <div style={{ color: "#334155" }}>{excerpt}</div>

//                   <div style={{ marginTop: 8 }}>
//                     {Array.isArray(post.Tags) &&
//                       post.Tags.map((tag) => (
//                         <span
//                           key={tag.TagId}
//                           style={{
//                             display: "inline-block",
//                             padding: "4px 8px",
//                             marginRight: 6,
//                             marginBottom: 6,
//                             borderRadius: 999,
//                             border: "1px solid #e2e8f0",
//                             fontSize: 12,
//                             color: "#0f172a",
//                           }}
//                         >
//                           {tag.TagName}
//                         </span>
//                       ))}
//                   </div>
//                 </div>

//                 <div style={{ textAlign: "right" }}>
//                   <div style={{ fontSize: 12, color: "#6b7280" }}>
//                     DeptId: {post.DeptId}
//                   </div>
//                   <div style={{ marginTop: 8 }}>
//                     <button
//                       onClick={handleView}
//                       style={{
//                         padding: "8px 12px",
//                         borderRadius: 6,
//                         border: "none",
//                         background: "#2563eb",
//                         color: "#fff",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Read More
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
//                 Upvotes: {post.UpvoteCount ?? 0} • Downvotes: {post.DownvoteCount ?? 0} • CreatedAt:{" "}
//                 {post.CreatedAt ? new Date(post.CreatedAt).toLocaleString() : ""}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Scroll Prompt */}
//       {showScrollPrompt && (
//         <div className="scroll-modal">
//           <p>Please login or sign up to continue exploring!</p>
//           <button onClick={() => navigate("/login")}>Login</button>
//           <button onClick={() => navigate("/signup")}>Sign Up</button>
//         </div>
//       )}

//       {/* Read More Modal */}
//       {showModal && (
//         <div className="overlay">
//           <div className="modal">
//             <h3>Login Required</h3>
//             <p>Please login or sign up to view full content.</p>
//             <div className="modal-actions">
//               <button onClick={() => navigate("/login")}>Login</button>
//               <button onClick={() => navigate("/signup")}>Sign Up</button>
//               <button onClick={() => setShowModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




//  import React, { useEffect, useState } from "react";
//  import { useNavigate } from "react-router-dom";
//  import "./GuestPage.css";

//  export default function GuestPage() {
//    const navigate = useNavigate();
//    const [showScrollPrompt, setShowScrollPrompt] = useState(false);
//    const [showModal, setShowModal] = useState(false);
//    const [sidebarOpen, setSidebarOpen] = useState(false);
//    const token = localStorage.getItem("token");

//    useEffect(() => {
//      const handleScroll = () => {
//        if (window.scrollY > 300) {
//          setShowScrollPrompt(true);
//          window.removeEventListener("scroll", handleScroll);
//        }
//      };

//      window.addEventListener("scroll", handleScroll);
//      return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleView = () => {
//     setShowModal(true);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="guest-page">
//       {/* Sidebar */}
//       {sidebarOpen && (
//         <div className="sidebar">
//           <button onClick={() => navigate("/myposts")}>My Posts</button>
//           <button onClick={() => navigate("/newpost")}>New Post</button>
//           <button onClick={() => navigate("/profile")}>Profile</button>
//           <button
//             onClick={() => {
//               localStorage.removeItem("token");
//               navigate("/login");
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       )}

//       {/* Header */}
//       <header className="header-container">
//         <div className="top-nav">
//           <div className="nav-left">
//             <button className="hamburger-btn" onClick={toggleSidebar}>
//               ☰
//             </button>
//             <div className="logo-container">
//               <img src="/fnfi.png"></img>
//             </div>
//           </div>
//           <div className="nav-right">
//             <button className="nav-btn" onClick={() => navigate("/signup")}>
//               Sign Up
//             </button>
//             <button className="nav-btn" onClick={() => navigate("/login")}>
//               Login
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Rest of your content... */}
//     </div>
//   );
// }





// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// //import { isAuthenticated } from '../../utils/auth'
// import Navbar from '../Navbar/Navbar'
// import PostEditor from '../PostEditor/PostEditor'

// // Mock data for guest users
// const samplePosts = [
//   {
//     id: '1',
//     title: 'How to connect to company VPN',
//     content: 'Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.',
//     tags: ['VPN', 'IT', 'Security'],
//     dept: 'IT Department',
//     authorName: 'John Smith',
//     updates: 12,
//     downvotes: 0,
//     comments: 3,
//     createdAt: '2025-09-19T22:51:21Z'
//   },
//   {
//     id: '2',
//     title: 'How to raise leave request',
//     content: 'Open HR portal → My Requests → New Leave. Select dates, reason and approver. Attach docs if needed. Manager gets a notification.',
//     tags: ['HR', 'Leave', 'Process'],
//     dept: 'HR Department',
//     authorName: 'Sarah Johnson',
//     updates: 8,
//     downvotes: 0,
//     comments: 5,
//     createdAt: '2025-09-19T22:57:11Z'
//   },
//   {
//     id: '3',
//     title: 'Setup local SQL Server',
//     content: 'Install SQL Server Express, enable TCP/IP, create SQL auth user and update connection string in appsettings.json. Remember to configure firewall rules.',
//     tags: ['SQL', 'Server', 'Development'],
//     dept: 'Development',
//     authorName: 'Mike Chen',
//     updates: 10,
//     downvotes: 1,
//     comments: 7,
//     createdAt: '2025-09-19T23:11:43Z'
//   },
//   {
//     id: '4',
//     title: 'Best practices for code reviews',
//     content: 'Always review for functionality, security, and maintainability. Use automated tools, focus on logic and potential bugs, provide constructive feedback.',
//     tags: ['Code Review', 'Best Practices', 'Development'],
//     dept: 'Development',
//     authorName: 'Emily Davis',
//     updates: 15,
//     downvotes: 0,
//     comments: 12,
//     createdAt: '2025-09-20T09:30:00Z'
//   }
// ]

// export default function Home() {
//   const navigate = useNavigate()
//   const [viewedCount, setViewedCount] = useState(0)
//   const maxViewsForGuest = 3
  
//   const [showScrollPrompt, setShowScrollPrompt] = useState(false);
//   const [showModal, setShowModal] = useState(false);


//   // useEffect(() => {
//   //   if (isAuthenticated()) {
//   //     navigate('/feed', { replace: true })
//   //   }
//   // }, [navigate])

//   // const handlePostClick = (postId) => {
//   //   if (viewedCount >= maxViewsForGuest) {
//   //     navigate('/login')
//   //     return
//   //   }
//   //   setViewedCount(prev => prev + 1)
//   //   navigate(`/post/${postId}`)
//   // }

  
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/feed", { replace: true });
//     }

//     const handleScroll = () => {
//       if (window.scrollY > 300) {
//         setShowScrollPrompt(true);
//         window.removeEventListener("scroll", handleScroll);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [navigate]);

  
// const handlePostClick = (postId) => {
//     if (viewedCount >= maxViewsForGuest) {
//       navigate('/login');
//       return;
//     }
//     setViewedCount(prev => prev + 1);
//     navigate(`/post/${postId}`);
//   };

//   const handleView = () => {
//     setShowModal(true);
//   };


  

//   return (
//     <div>
//       <Navbar />
      
//       {/* Hero Section */}
//       <section className="guest-hero">
//         <div className="container center-content">
//           <h1>Welcome to FNF Knowledge Hub</h1>
//           <p>Discover solutions, share knowledge, and collaborate with your team</p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <main className="container">
//         <div style={{ marginBottom: '2rem' }}>
//           <h2>Recent Knowledge Posts</h2>
//           {viewedCount < maxViewsForGuest ? (
//             <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
//               You can view {maxViewsForGuest - viewedCount} more post{maxViewsForGuest - viewedCount !== 1 ? 's' : ''} as a guest. 
//               <a href="/signup" style={{ marginLeft: '0.5rem' }}>Sign up</a> for unlimited access.
//             </p>
//           ) : (
//             <div className="card" style={{ textAlign: 'center', background: '#f8f9fa' }}>
//               <h3>Guest View Limit Reached</h3>
//               <p>You've reached the maximum number of posts you can view as a guest.</p>
//               <div className="flex gap-2" style={{ justifyContent: 'center', marginTop: '1rem' }}>
//                 <button className="btn" onClick={() => navigate('/signup')}>
//                   Sign Up for Free
//                 </button>
//                 <button className="btn btn-outline" onClick={() => navigate('/login')}>
//                   Login
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div>
//           {samplePosts.map(post => (
//             <div key={post.id} onClick={() => handlePostClick(post.id)} style={{ cursor: 'pointer' }}>
//               <PostCard post={post} />
//             </div>
//           ))}
//         </div>

//         {/* Call to Action */}
//         <div className="card" style={{ textAlign: 'center', marginTop: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
//           <h3 style={{ color: 'white' }}>Join FNF Knowledge Hub Today</h3>
//           <p>Access unlimited posts, create your own content, and collaborate with your team.</p>
//           <div className="flex gap-2" style={{ justifyContent: 'center', marginTop: '1rem' }}>
//             <button className="btn" style={{ background: 'white', color: '#333' }} onClick={() => navigate('/signup')}>
//               Get Started
//             </button>
//           </div>
//         </div>
      
      
//       {/* Modal Display */}
//         {showModal && (
//           <div className="modal-overlay">
//             <div className="modal-box">
//               <h3>Welcome to FNF Knowledge Hub</h3>
//               <p>Sign up to access unlimited posts and collaborate with your team.</p>
//               <button className="btn" onClick={() => navigate('/signup')}>Sign Up</button>
//               <button className="btn btn-outline" onClick={() => setShowModal(false)}>Close</button>
//             </div>
//           </div>
//         )}
//       </main>
      
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./GuestPage.css";

// const posts = [
//   {
//     PostId: 1,
//     Title: "How to connect to company VPN",
//     Body: "Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.",
//     Tags: [{ TagId: 1, TagName: "VPN" }, { TagId: 2, TagName: "IT" }],
//     DeptId: "Dept-4",
//     UpvoteCount: 12,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:51:21",
//   },
//   {
//     PostId: 2,
//     Title: "How to raise leave request",
//     Body: "Open HR portal → My Requests → New Leave. Select dates, reason and approver. Attach docs if needed. Manager gets a notification.",
//     Tags: [{ TagId: 3, TagName: "HR" }, { TagId: 4, TagName: "Leave" }],
//     DeptId: "Dept-6",
//     UpvoteCount: 8,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:57:11",
//   },
//   {
//     PostId: 3,
//     Title: "Setup local SQL Server",
//     Body: "Install SQL Server Express, enable TCP/IP, create SQL auth user and update connection string in appsettings.json.",
//     Tags: [{ TagId: 5, TagName: "SQL" }, { TagId: 6, TagName: "Server" }],
//     DeptId: "Dept-6",
//     UpvoteCount: 10,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T23:11:43",
//   },
//   {
//     PostId: 4,
//     Title: "How to connect to company VPN",
//     Body: "Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.",
//     Tags: [{ TagId: 1, TagName: "VPN" }, { TagId: 2, TagName: "IT" }],
//     DeptId: "Dept-4",
//     UpvoteCount: 12,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:51:21",
//   },
//   {
//   PostId: 5,
//     Title: "How to connect to company VPN",
//     Body: "Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.",
//     Tags: [{ TagId: 1, TagName: "VPN" }, { TagId: 2, TagName: "IT" }],
//     DeptId: "Dept-4",
//     UpvoteCount: 12,
//     DownvoteCount: 0,
//     CreatedAt: "2025-09-19T22:51:21",
//   },
// ];

// export default function GuestPage() {
//   const navigate = useNavigate();
  
//   const [viewedCount, setViewedCount] = useState(0);
//   const maxViewsForGuest = 3;

//   const [showScrollPrompt, setShowScrollPrompt] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/feed", { replace: true });
//     }

//     const handleScroll = () => {
//       if (window.scrollY > 300) {
//         setShowScrollPrompt(true);
//         window.removeEventListener("scroll", handleScroll);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [navigate]);

//   const handleView = () => {
//     setShowModal(true);
//   };

//   return (
//     <div className="guest-page">
//       <header className="header-container">
//         <div className="top-nav">
//           <div className="nav-left">
//             <div className="logo-container">
//               <img src="/fnfi.png"></img>
//             </div>
//           </div>
//           <div className="nav-right">
//             <button className="nav-btn" onClick={() => navigate("/signup")}>
//               Sign Up
//             </button>
//             <button className="nav-btn" onClick={() => navigate("/login")}>
//               Login
//             </button>
//           </div>
//         </div>
//       </header>

//       <section className="guest-header">
//         <h1>Welcome to FNF Knowledge Hub</h1>
//       </section>

//       <div className="qna-container">
//         {posts.map((post) => {
//           const excerpt =
//             post.Body && post.Body.length > 160
//               ? post.Body.slice(0, 157) + "..."
//               : post.Body;

//           return (
//             <div
//               key={post.PostId}
//               style={{
//                 border: "1px solid #e6edf3",
//                 borderRadius: 8,
//                 padding: 16,
//                 background: "#fff",
//                 boxShadow: "0 1px 4px rgba(2,6,23,0.04)",
//                 marginBottom: 24,
//               }}
//             >
//               <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
//                 <div style={{ flex: 1 }}>
//                   <h3 style={{ margin: "0 0 8px" }}>{post.Title}</h3>
//                   <div style={{ color: "#334155" }}>{excerpt}</div>

//                   <div style={{ marginTop: 8 }}>
//                     {Array.isArray(post.Tags) &&
//                       post.Tags.map((tag) => (
//                         <span
//                           key={tag.TagId}
//                           style={{
//                             display: "inline-block",
//                             padding: "4px 8px",
//                             marginRight: 6,
//                             marginBottom: 6,
//                             borderRadius: 999,
//                             border: "1px solid #e2e8f0",
//                             fontSize: 12,
//                             color: "#0f172a",
//                           }}
//                         >
//                           {tag.TagName}
//                         </span>
//                       ))}
//                   </div>
//                 </div>

//                 <div style={{ textAlign: "right" }}>
//                   <div style={{ fontSize: 12, color: "#6b7280" }}>
//                     DeptId: {post.DeptId}
//                   </div>
//                   <div style={{ marginTop: 8 }}>
//                     <button
//                       onClick={handleView}
//                       style={{
//                         padding: "8px 12px",
//                         borderRadius: 6,
//                         border: "none",
//                         background: "#2563eb",
//                         color: "#fff",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Read More
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
//                 Upvotes: {post.UpvoteCount ?? 0} • Downvotes: {post.DownvoteCount ?? 0} • CreatedAt:{" "}
//                 {post.CreatedAt ? new Date(post.CreatedAt).toLocaleString() : ""}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Scroll Prompt */}
//       {showScrollPrompt && (
//         <div className="scroll-modal">
//           <p>Please login or sign up to continue exploring!</p>
//           <button onClick={() => navigate("/login")}>Login</button>
//           <button onClick={() => navigate("/signup")}>Sign Up</button>
//         </div>
//       )}

//       {/* Read More Modal */}
//       {showModal && (
//         <div className="overlay">
//           <div className="modal">
//             <h3>Login Required</h3>
//             <p>Please login or sign up to view full content.</p>
//             <div className="modal-actions">
//               <button onClick={() => navigate("/login")}>Login</button>
//               <button onClick={() => navigate("/signup")}>Sign Up</button>
//               <button onClick={() => setShowModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./GuestPage.css";

const posts = [

  {

    PostId: 1,

    Title: "How to connect to company VPN",

    Body: "Step-by-step: open VPN client, add server address, use corporate credentials. If MFA enabled, approve on your device. Troubleshoot: check firewall, DNS, and certificates.",

    Tags: [{ TagId: 1, TagName: "VPN" }, { TagId: 2, TagName: "IT" }],

    DeptId: "Dept-4",

    UpvoteCount: 12,

    DownvoteCount: 0,

    CreatedAt: "2025-09-19T22:51:21",

  },

  {

    PostId: 2,

    Title: "How to raise leave request",

    Body: "Open HR portal → My Requests → New Leave. Select dates, reason and approver. Attach docs if needed. Manager gets a notification.",

    Tags: [{ TagId: 3, TagName: "HR" }, { TagId: 4, TagName: "Leave" }],

    DeptId: "Dept-6",

    UpvoteCount: 8,

    DownvoteCount: 0,

    CreatedAt: "2025-09-19T22:57:11",

  },

  {

    PostId: 3,

    Title: "Setup local SQL Server",

    Body: "Install SQL Server Express, enable TCP/IP, create SQL auth user and update connection string in appsettings.json.",

    Tags: [{ TagId: 5, TagName: "SQL" }, { TagId: 6, TagName: "Server" }],

    DeptId: "Dept-6",

    UpvoteCount: 10,

    DownvoteCount: 0,

    CreatedAt: "2025-09-19T23:11:43",

  },

];

export default function GuestPage() {

  const navigate = useNavigate();

  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      navigate("/feed", { replace: true });

    }

    const timer = setTimeout(() => setShowScrollPrompt(true), 10000); // Show prompt after 10s

    return () => clearTimeout(timer);

  }, [navigate]);

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === "Escape") setShowModal(false);

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);

  }, []);

  const handleView = () => {

    setShowModal(true);

  };

  return (

    <div className="guest-page">

      <header className="header-container">

        <div className="top-nav">

          <div className="nav-left logo-container">

            <div className="logo-container">
              <img src="/fnfi.png" alt="FNF Knowledge Hub Logo" />

            </div>

          </div>

          <div className="nav-right">

            <button className="nav-btn" onClick={() => navigate("/signup")}>

              Sign Up

            </button>

            <button className="nav-btn" onClick={() => navigate("/login")}>

              Login

            </button>

          </div>

        </div>

      </header>

      <section className="guest-header">

        <h1>Welcome to FNF Knowledge Hub</h1>

      </section>

      <div className="qna-container">

        {/* <h2 className="qna-header">Knowledge Hub Q&A</h2> */}

        <p className="qna-helptext">Explore common questions and answers from our community.</p>

        {posts.map((post) => {

          const excerpt =

            post.Body && post.Body.length > 160

              ? post.Body.slice(0, 157) + "..."

              : post.Body;

          return (

            <div className="qna-post" key={post.PostId}>

              <div className="qna-title">{post.Title}</div>

              <div className="qna-content">{excerpt}</div>

              <div className="qna-meta">

                {Array.isArray(post.Tags) &&

                  post.Tags.map((tag) => (

                    <span className="qna-tag" key={tag.TagId}>

                      {tag.TagName}

                    </span>

                  ))}

                <span className="qna-dept">Dept: {post.DeptId}</span>

              </div>

              <div className="qna-footer">

                <div className="qna-updates">

                  Upvotes: {post.UpvoteCount ?? 0} • Downvotes: {post.DownvoteCount ?? 0} •

                  Created: {post.CreatedAt ? new Date(post.CreatedAt).toLocaleString() : ""}

                </div>

                <button className="qna-btn" onClick={handleView}>

                  Read More

                </button>

              </div>

            </div>

          );

        })}

      </div>

      {showScrollPrompt && (

        <div className="scroll-modal">

          <p>Please login or sign up to continue exploring!</p>

          <button onClick={() => navigate("/login")}>Login</button>

          <button onClick={() => navigate("/signup")}>Sign Up</button>

        </div>

      )}

      {showModal && (

        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">

          <div className="modal">

            <h3 id="modal-title">Login Required</h3>

            <p>Please login or sign up to view full content.</p>

            <div className="modal-actions">

              <button onClick={() => navigate("/login")}>Login</button>

              <button onClick={() => navigate("/signup")}>Sign Up</button>

              <button onClick={() => setShowModal(false)} aria-label="Close modal">

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}



