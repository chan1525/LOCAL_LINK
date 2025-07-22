import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

const initialBusiness = {
  name: '', email: '', password: '', businessName: '', businessType: '',
  address: '', phone: '', description: '', image: ''
};

const initialIndividual = {
  name: '', email: '', password: '', occupation: '', skills: '',
  address: '', phone: '', description: '', image: ''
};

const Signup = () => {
  const [userType, setUserType] = useState('business');
  const [form, setForm] = useState(initialBusiness);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUserTypeChange = (e) => {
    const type = e.target.value;
    setUserType(type);
    setForm(type === 'business' ? initialBusiness : initialIndividual);
    setError('');
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    
    for (const key in form) {
      if (key !== 'image' && !form[key]) {
        setError('All fields except image are required.');
        setLoading(false);
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, form.email, form.password
      );
      const user = userCredential.user;
      const { password, ...userData } = form;
      
      await setDoc(doc(db, userType === 'business' ? 'business_owners' : 'individuals', user.uid), {
        ...userData, uid: user.uid, createdAt: new Date()
      });
      
      setSuccess(true);
      setForm(userType === 'business' ? initialBusiness : initialIndividual);
      
      setTimeout(() => {
        navigate(userType === 'business' ? '/dashboard/business' : '/dashboard/individual');
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="signup-wrapper">
      {/* Background Elements */}
      <div className="background-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Back to Home Link */}
      <Link to="/" className="back-home">
        <div className="back-icon">←</div>
        <span>Back to Home</span>
      </Link>

      <div className="signup-container">
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <h1 className="signup-title">Join LOCAL LINK</h1>
            <p className="signup-subtitle">
              Connect with local businesses and professionals in your area
            </p>
          </div>

          {/* User Type Selection */}
          <div className="user-type-selection">
            <div className="type-toggle">
              <input 
                type="radio" 
                id="business" 
                value="business" 
                checked={userType === 'business'} 
                onChange={handleUserTypeChange}
                className="type-input"
              />
              <label htmlFor="business" className="type-label">
                <div className="type-icon">🏢</div>
                <span>Business Owner</span>
              </label>

              <input 
                type="radio" 
                id="individual" 
                value="individual" 
                checked={userType === 'individual'} 
                onChange={handleUserTypeChange}
                className="type-input"
              />
              <label htmlFor="individual" className="type-label">
                <div className="type-icon">👤</div>
                <span>Individual</span>
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-grid">
              <FormInput 
                name="name" 
                placeholder="Full Name" 
                value={form.name} 
                onChange={handleChange}
                icon="👤"
              />
              
              <FormInput 
                name="email" 
                type="email" 
                placeholder="Email Address" 
                value={form.email} 
                onChange={handleChange}
                icon="✉️"
              />
              
              <FormInput 
                name="password" 
                type="password" 
                placeholder="Password" 
                value={form.password} 
                onChange={handleChange}
                icon="🔒"
              />

              {userType === 'business' ? (
                <>
                  <FormInput 
                    name="businessName" 
                    placeholder="Business Name" 
                    value={form.businessName} 
                    onChange={handleChange}
                    icon="🏢"
                  />
                  <FormInput 
                    name="businessType" 
                    placeholder="Business Type (e.g., Restaurant, Tech)" 
                    value={form.businessType} 
                    onChange={handleChange}
                    icon="🏷️"
                  />
                </>
              ) : (
                <>
                  <FormInput 
                    name="occupation" 
                    placeholder="Occupation" 
                    value={form.occupation} 
                    onChange={handleChange}
                    icon="💼"
                  />
                  <FormInput 
                    name="skills" 
                    placeholder="Skills (e.g., Web Design, Marketing)" 
                    value={form.skills} 
                    onChange={handleChange}
                    icon="⚡"
                  />
                </>
              )}

              <FormInput 
                name="address" 
                placeholder="Address/City" 
                value={form.address} 
                onChange={handleChange}
                icon="📍"
              />
              
              <FormInput 
                name="phone" 
                placeholder="Phone Number" 
                value={form.phone} 
                onChange={handleChange}
                icon="📞"
              />
            </div>

            <FormTextarea 
              name="description" 
              placeholder={userType === 'business' 
                ? "Tell us about your business..." 
                : "Tell us about yourself and what you're looking for..."
              }
              value={form.description} 
              onChange={handleChange}
            />

            {/* Image Upload */}
            <div className="image-upload-section">
              <label className="image-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                />
                <div className="image-upload-content">
                  <div className="upload-icon">📷</div>
                  <span>Upload Profile Picture (Optional)</span>
                </div>
              </label>
              
              {form.image && (
                <div className="image-preview">
                  <img src={form.image} alt="Preview" className="preview-image" />
                  <button 
                    type="button" 
                    onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                    className="remove-image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                Signup successful! Redirecting to your dashboard...
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <div className="button-arrow">→</div>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="signup-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Input Component
const FormInput = ({ name, icon, ...rest }) => (
  <div className="form-input-wrapper">
    <div className="input-icon">{icon}</div>
    <input
      name={name}
      autoComplete={name}
      className="form-input"
      {...rest}
    />
  </div>
);

// Form Textarea Component
const FormTextarea = ({ name, ...rest }) => (
  <div className="form-textarea-wrapper">
    <textarea
      name={name}
      className="form-textarea"
      rows="3"
      {...rest}
    />
  </div>
);

export default Signup;
