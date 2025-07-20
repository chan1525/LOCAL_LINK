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

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState({});

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

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 700, margin: '2em auto', padding: 24 }}>
      <h2>All Posts</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5em' }}>
        {posts.map(post => (
          <div key={post.id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              {post.userName} <span style={{ color: '#888', fontSize: 13 }}>({post.userType})</span>
            </div>
            <div style={{ marginBottom: 8 }}>{post.content}</div>
            {post.image && <img src={post.image} alt="Post" style={{ width: 200, maxHeight: 200, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />}
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
              {post.createdAt && post.createdAt.toDate ? post.createdAt.toDate().toLocaleString() : ''}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button
                onClick={() => handleLike(post)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: post.likes && auth.currentUser && post.likes.includes(auth.currentUser.uid) ? '#007bff' : '#888', fontWeight: 600 }}
              >
                {post.likes && auth.currentUser && post.likes.includes(auth.currentUser.uid) ? '♥' : '♡'} Like
              </button>
              <span>{post.likes ? post.likes.length : 0} {post.likes && post.likes.length === 1 ? 'like' : 'likes'}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <strong>Comments:</strong>
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                {(comments[post.id] || []).map(comment => (
                  <div key={comment.id} style={{ marginBottom: 6, padding: 8, background: '#f5f6fa', borderRadius: 6 }}>
                    <span style={{ fontWeight: 500 }}>{comment.userName}:</span> {comment.content}
                    <div style={{ color: '#888', fontSize: 11 }}>
                      {comment.createdAt && comment.createdAt.toDate ? comment.createdAt.toDate().toLocaleString() : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={e => handleCommentChange(post.id, e.target.value)}
                  style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  disabled={commentLoading[post.id]}
                  style={{ padding: '6px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}
                >
                  {commentLoading[post.id] ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsFeed; 