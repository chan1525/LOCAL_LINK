import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');
      // Get business name
      const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
      if (!businessSnap.exists()) throw new Error('Only business owners can post jobs');
      const businessName = businessSnap.data().businessName;
      await addDoc(collection(db, 'jobs'), {
        ...form,
        uid: user.uid,
        businessName,
        createdAt: serverTimestamp()
      });
      navigate('/my-jobs');
    } catch (err) {
      setError(err.message || 'Failed to post job.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2em auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Job Title" value={form.title} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <textarea name="requirements" placeholder="Requirements" value={form.requirements} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob; 