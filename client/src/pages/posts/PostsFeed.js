import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import './PostsFeed.css';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(auth.currentUser);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Listen for likes/comments updates in real time
  useEffect(() => {
    const unsubscribes = [];
    posts.forEach(post => {
      const postRef = doc(db, 'posts', post.id);
      const unsubscribe = onSnapshot(postRef, snap => {
        setPosts(prevPosts =>
          prevPosts.map(p => (p.id === post.id ? { ...p, ...snap.data() } : p))
        );
      });
      unsubscribes.push(unsubscribe);
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [posts.length]);

  const handleLike = async (post) => {
    const user = auth.currentUser;
    if (!user) return;
    const postRef = doc(db, 'posts', post.id);
    const hasLiked = post.likes && post.likes.includes(user.uid);
    await updateDoc(postRef, {
      likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  // Comments logic
  const [comments, setComments] = useState({});

  useEffect(() => {
    const unsubscribes = posts.map(post => {
      const commentsRef = collection(db, 'posts', post.id, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      return onSnapshot(q, snap => {
        setComments(prev => ({ ...prev, [post.id]: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) }));
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [posts.length]);

  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    setCommentLoading(prev => ({ ...prev, [postId]: true }));
    const user = auth.currentUser;
    if (!user) return;
    const userName = user.displayName || 'User';
    const content = commentInputs[postId];
    if (!content || !content.trim()) {
      setCommentLoading(prev => ({ ...prev, [postId]: false }));
      return;
    }
    
    // Try to get user name from Firestore
    let name = userName;
    const businessSnap = await getDocs(query(collection(db, 'business_owners')));
    const business = businessSnap.docs.find(doc => doc.id === user.uid);
    if (business) name = business.data().name;
    else {
      const individualSnap = await getDocs(query(collection(db, 'individuals')));
      const individual = individualSnap.docs.find(doc => doc.id === user.uid);
      if (individual) name = individual.data().name;
    }
    
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      uid: user.uid,
      userName: name,
      content,
      createdAt: serverTimestamp()
    });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setCommentLoading(prev => ({ ...prev, [postId]: false }));
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const now = new Date();
    const postTime = timestamp.toDate();
    const diff = now - postTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="posts-feed-loading">
        <div className="loading-spinner-container">
          <div className="elegant-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading professional insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-feed-container">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>

      <div className="posts-feed">
        {/* Header */}
        <header className="feed-header">
          <div className="header-content">
            <h1 className="feed-title">Professional Network Feed</h1>
            <p className="feed-subtitle">
              Stay updated with insights from your professional community
            </p>
          </div>
          <div className="feed-stats">
            <div className="stat-item">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>
        </header>

        {/* Posts Container */}
        <main className="posts-container">
          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-newspaper"></i>
              </div>
              <h3>No posts yet</h3>
              <p>Be the first to share professional insights with your network</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post, index) => (
                <article 
                  key={post.id} 
                  className="post-card"
                  style={{ '--animation-delay': `${index * 0.1}s` }}
                >
                  {/* Post Header */}
                  <div className="post-header">
                    <div className="author-info">
                      <div className="author-avatar">
                        <div className="avatar-placeholder">
                          {post.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="author-details">
                        <h4 className="author-name">{post.userName}</h4>
                        <div className="post-meta">
                          <span className="user-type">
                            {post.userType === 'business' ? 'Business Owner' : 'Professional'}
                          </span>
                          <span className="separator">•</span>
                          <span className="post-time">
                            {formatTimeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="post-menu">
                      <button className="menu-button">
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="post-content">
                    <p className="post-text">{post.content}</p>
                    {post.image && (
                      <div className="post-image-container">
                        <img src={post.image} alt="Post content" className="post-image" />
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="post-actions">
                    <div className="action-buttons">
                      <button
                        className={`action-button like-button ${
                          post.likes && currentUser && post.likes.includes(currentUser.uid) ? 'liked' : ''
                        }`}
                        onClick={() => handleLike(post)}
                      >
                        <i className={`${
                          post.likes && currentUser && post.likes.includes(currentUser.uid) 
                            ? 'fas fa-heart' 
                            : 'far fa-heart'
                        }`}></i>
                        <span>Like</span>
                      </button>
                      
                      <button
                        className="action-button comment-button"
                        onClick={() => toggleComments(post.id)}
                      >
                        <i className="far fa-comment"></i>
                        <span>Comment</span>
                      </button>
                      
                      <button className="action-button share-button">
                        <i className="far fa-share-square"></i>
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Engagement Stats */}
                    <div className="engagement-stats">
                      {post.likes && post.likes.length > 0 && (
                        <div className="likes-count">
                          <i className="fas fa-heart"></i>
                          <span>
                            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                          </span>
                        </div>
                      )}
                      {comments[post.id] && comments[post.id].length > 0 && (
                        <div className="comments-count">
                          <i className="far fa-comment"></i>
                          <span>
                            {comments[post.id].length} {comments[post.id].length === 1 ? 'comment' : 'comments'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {expandedComments[post.id] && (
                    <div className="comments-section">
                      <div className="comments-list">
                        {(comments[post.id] || []).map(comment => (
                          <div key={comment.id} className="comment-item">
                            <div className="comment-avatar">
                              <div className="avatar-placeholder small">
                                {comment.userName?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                            </div>
                            <div className="comment-content">
                              <div className="comment-bubble">
                                <div className="comment-author">{comment.userName}</div>
                                <div className="comment-text">{comment.content}</div>
                              </div>
                              <div className="comment-time">
                                {formatTimeAgo(comment.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Comment */}
                      <div className="add-comment">
                        <div className="comment-input-container">
                          <div className="current-user-avatar">
                            <div className="avatar-placeholder small">
                              {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          </div>
                          <div className="comment-input-wrapper">
                            <input
                              type="text"
                              placeholder="Write a professional comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={e => handleCommentChange(post.id, e.target.value)}
                              className="comment-input"
                              onKeyPress={e => {
                                if (e.key === 'Enter' && !commentLoading[post.id]) {
                                  handleAddComment(post.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={commentLoading[post.id] || !commentInputs[post.id]?.trim()}
                              className={`comment-submit ${commentLoading[post.id] ? 'loading' : ''}`}
                            >
                              {commentLoading[post.id] ? (
                                <div className="mini-spinner"></div>
                              ) : (
                                <i className="fas fa-paper-plane"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PostsFeed;
