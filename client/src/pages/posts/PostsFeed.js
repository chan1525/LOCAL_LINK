import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <div style={{ color: '#888', fontSize: 12 }}>
              {post.createdAt && post.createdAt.toDate ? post.createdAt.toDate().toLocaleString() : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsFeed; 