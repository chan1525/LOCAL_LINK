import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
    } catch (err) {
      setError('Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(120deg, #3b82f6 0%, #6366f1 50%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Light Glass Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,255,255,0.08)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          zIndex: 1,
          width: 370,
          padding: '42px 32px 32px 32px',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.98)',
          boxShadow: '0 4px 32px #23295435',
          border: '1.5px solid #e0e7ef',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <h2 style={{
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '2.1rem',
          marginBottom: 10,
          letterSpacing: 1,
          color: '#1e293b',
        }}>
          Welcome Back
        </h2>
        <div style={{
          textAlign: 'center',
          marginBottom: 10,
          color: '#334155',
          fontWeight: 500,
          fontSize: 18,
        }}>
          Login to <span style={{ color: '#2563eb', fontWeight: 700 }}>LOCAL_LINK</span>
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="username"
          style={{
            width: '100%',
            padding: '13px 15px',
            background: '#f1f5f9',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: '1rem',
            color: '#1e293b',
            marginBottom: 4,
            outline: 'none',
            transition: 'border 0.2s',
            boxSizing: 'border-box'
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          style={{
            width: '100%',
            padding: '13px 15px',
            background: '#f1f5f9',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: '1rem',
            color: '#1e293b',
            marginBottom: 5,
            outline: 'none',
            transition: 'border 0.2s',
            boxSizing: 'border-box'
          }}
        />

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            borderRadius: 7,
            padding: '9px 14px',
            fontWeight: 600,
            fontSize: 15,
            textAlign: 'center',
            marginBottom: '2px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px 0',
            background: loading
              ? 'linear-gradient(90deg, #93c5fd 0%, #a5b4fc 100%)'
              : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 80%)',
            boxShadow: '0 2px 13px #64748b20',
            color: loading ? '#33415599' : '#fff',
            border: 'none',
            borderRadius: 9,
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: 0.6,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.18s'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: 10,
          color: '#6b7280',
          fontSize: 15
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
