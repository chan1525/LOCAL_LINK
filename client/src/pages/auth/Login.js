import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      // Check user type in Firestore
      const businessDoc = await getDoc(doc(db, 'business_owners', user.uid));
      if (businessDoc.exists()) {
        navigate('/dashboard/business');
      } else {
        const individualDoc = await getDoc(doc(db, 'individuals', user.uid));
        if (individualDoc.exists()) {
          navigate('/dashboard/individual');
        } else {
          setError('User type not found.');
        }
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
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

      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo-section">
              <h1 className="logo">LOCAL LINK</h1>
              <div className="logo-underline"></div>
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">
              Sign in to your account to continue networking
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="form-input-wrapper">
              <div className="input-icon">✉️</div>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="username"
                className="form-input"
              />
            </div>

            {/* Password Input */}
            <div className="form-input-wrapper">
              <div className="input-icon">🔒</div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="form-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
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
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <div className="button-arrow">→</div>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="login-footer">
              <p>
                Don't have an account? 
                <Link to="/signup" className="signup-link"> Create account</Link>
              </p>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <div className="feature-item">
            <div className="feature-icon">🤝</div>
            <div>
              <h4>Connect Locally</h4>
              <p>Build meaningful professional relationships in your area</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💼</div>
            <div>
              <h4>Find Opportunities</h4>
              <p>Discover jobs, partnerships, and business prospects</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🌟</div>
            <div>
              <h4>Grow Together</h4>
              <p>Share expertise and learn from your local community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
