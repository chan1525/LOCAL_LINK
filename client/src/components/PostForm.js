import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');
      // Determine user type and name (v9+ syntax)
      let userType = '';
      let userName = '';
      const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
      if (businessSnap.exists()) {
        userType = 'business';
        userName = businessSnap.data().name;
      } else {
        const individualSnap = await getDoc(doc(db, 'individuals', user.uid));
        if (individualSnap.exists()) {
          userType = 'individual';
          userName = individualSnap.data().name;
        }
      }
      await addDoc(collection(db, 'posts'), {
        uid: user.uid,
        userType,
        userName,
        content,
        image,
        createdAt: serverTimestamp()
      });
      setContent('');
      setImage('');
      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError('Failed to create post.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        style={{ width: '100%', minHeight: 60, marginBottom: 12, padding: 8 }}
      />
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 12 }} />
      {image && <img src={image} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ padding: '8px 24px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default PostForm; 