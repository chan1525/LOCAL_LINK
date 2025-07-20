import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../../components/PostForm';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const CreatePost = () => {
  const navigate = useNavigate();

  const handlePostCreated = async () => {
    // After post creation, redirect to the correct dashboard
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }
    const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
    if (businessSnap.exists()) {
      navigate('/dashboard/business');
    } else {
      navigate('/dashboard/individual');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2em auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Create Post</h2>
      <PostForm onPostCreated={handlePostCreated} />
    </div>
  );
};

export default CreatePost; 