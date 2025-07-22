import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import './PostForm.css';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
        if (businessSnap.exists()) {
          setUserData({ ...businessSnap.data(), type: 'business' });
        } else {
          const individualSnap = await getDoc(doc(db, 'individuals', user.uid));
          if (individualSnap.exists()) {
            setUserData({ ...individualSnap.data(), type: 'individual' });
          }
        }
      }
    };
    fetchUserData();
  }, []);

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

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Please share your thoughts before posting.');
      return;
    }
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Authentication required');
      
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
      setCharCount(0);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError('Unable to publish your post. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="elegant-post-form">
      <div className="post-card">
        {/* Header Section */}
        <div className="post-header">
          <div className="author-info">
            <div className="author-avatar">
              {userData?.image ? (
                <img src={userData.image} alt="Your avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="author-details">
              <h3 className="author-name">
                {userData?.name || 'Professional User'}
              </h3>
              <span className="author-type">
                {userData?.type === 'business' ? 'Business Owner' : 'Professional'}
              </span>
            </div>
          </div>
          <div className="post-privacy">
            <i className="fas fa-globe-americas"></i>
            <span>Public</span>
          </div>
        </div>

        {/* Content Input */}
        <div className="content-section">
          <div className="textarea-wrapper">
            <textarea
              placeholder="What insights would you like to share with your professional network?"
              value={content}
              onChange={handleContentChange}
              className="content-textarea"
              maxLength={maxChars}
            />
            <div className="textarea-footer">
              <div className="char-counter">
                <span className={charCount > maxChars * 0.8 ? 'warning' : ''}>
                  {charCount}/{maxChars}
                </span>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {image && (
            <div className="image-preview-section">
              <div className="image-container">
                <img src={image} alt="Post preview" className="preview-image" />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => setImage('')}
                  title="Remove image"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <div className="error-content">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="post-actions">
          <div className="media-options">
            <label className="media-option" htmlFor="image-input" title="Add photo">
              <input 
                type="file" 
                id="image-input"
                accept="image/*" 
                onChange={handleImageChange}
                className="file-input"
              />
              <i className="fas fa-image"></i>
              <span>Photo</span>
            </label>
          </div>

          <div className="publish-section">
            <button 
              type="submit" 
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className={`publish-btn ${loading ? 'publishing' : ''}`}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <i className="fas fa-share"></i>
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
