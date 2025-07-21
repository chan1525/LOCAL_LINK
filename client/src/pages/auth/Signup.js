import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

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
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'linear-gradient(120deg, #3b82f6 10%, #6366f1 60%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 40px #1e293b29',
          maxWidth: 430,
          width: '95vw',
          padding: 'clamp(22px,5vw,40px) clamp(18px,6vw,38px)',
          margin: '2vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxHeight: '97vh',
          overflowY: 'auto',
        }}
      >
        <h2 style={{
          fontWeight: 900,
          fontSize: 'clamp(1.6rem,2.2vw,2.15rem)',
          lineHeight: 1.15,
          color: '#1e293b',
          textAlign: 'center',
          margin: 0,
          marginBottom: '0.7em'
        }}>
          Sign up
        </h2>
        <div style={{
          textAlign: 'center',
          color: '#334155',
          fontWeight: 500,
          fontSize: 'clamp(1rem,1.1vw,1.14rem)',
          marginBottom: 12,
        }}>
          Join <span style={{ color: '#2563eb', fontWeight: 700 }}>LOCAL_LINK</span> as a{' '}
          <span style={{ color: '#3b82f6', fontWeight: 700 }}>
            {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </span>
        </div>

        {/* USER TYPE SWITCH */}
        <div style={{
          display: 'flex',
          gap: 28,
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <label style={{
            fontWeight: 600,
            color: userType === 'business' ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            fontSize: 16,
            letterSpacing: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}>
            <input type="radio" value="business" checked={userType === 'business'} onChange={handleUserTypeChange} />
            Business Owner
          </label>
          <label style={{
            fontWeight: 600,
            color: userType === 'individual' ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            fontSize: 16,
            letterSpacing: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}>
            <input type="radio" value="individual" checked={userType === 'individual'} onChange={handleUserTypeChange} />
            Individual
          </label>
        </div>

        {/* FORM FIELDS */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 13,
            alignItems: 'center',
            margin: 0
          }}
        >
          <FormInput name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <FormInput name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <FormInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          {userType === 'business' ? (
            <>
              <FormInput name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} />
              <FormInput name="businessType" placeholder="Business Type" value={form.businessType} onChange={handleChange} />
            </>
          ) : (
            <>
              <FormInput name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} />
              <FormInput name="skills" placeholder="Skills" value={form.skills} onChange={handleChange} />
            </>
          )}
          <FormInput name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <FormInput name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <FormTextarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: '100%',
              marginBottom: '5px',
              fontSize: 15,
              background: '#f1f5f9',
            }}
          />
          {form.image &&
            <img src={form.image} alt="Preview" style={{
              width: 80, height: 80, objectFit: 'cover', borderRadius: 5, margin: '6px auto', display: 'block', border: '1px solid #cbd5e1'
            }} />
          }
          {error && <div style={alertStyle('#fee2e2', '#b91c1c', '#fca5a5')}>{error}</div>}
          {success && <div style={alertStyle('#d1fae5', '#065f46', '#6ee7b7')}>Signup successful! Redirecting...</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 0',
              background: loading
                ? 'linear-gradient(90deg,#bdbfe0 0%,#93c5fd 80%, #a5b4fc 100%)'
                : 'linear-gradient(90deg, #2563eb 0%, #3b82f6 90%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: '1.13rem',
              letterSpacing: 0.2,
              marginTop: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.17s'
            }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div style={{
          textAlign: 'center',
          marginTop: 15,
          color: '#64748b',
          fontSize: 15
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

// Single reusable input field, keeps everything centered and sizing consistent
const FormInput = ({ name, ...rest }) => (
  <input
    name={name}
    autoComplete={name}
    {...rest}
    style={{
      width: '100%',
      padding: '11px 13px',
      border: '1.4px solid #e5e7eb',
      borderRadius: 7,
      fontSize: '1.08rem',
      color: '#1e293b',
      background: '#f8fafc',
      transition: 'border 0.16s',
      outline: 'none',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}
  />
);

// Consistent textarea for description
const FormTextarea = ({ name, ...rest }) => (
  <textarea
    name={name}
    {...rest}
    style={{
      width: '100%',
      minHeight: 58,
      border: '1.4px solid #e5e7eb',
      borderRadius: 7,
      fontSize: '1.07rem',
      color: '#1e293b',
      background: '#f8fafc',
      transition: 'border 0.16s',
      outline: 'none',
      textAlign: 'center',
      padding: '10px 13px',
      boxSizing: 'border-box'
    }}
  />
);

const alertStyle = (bg, color, border) => ({
  background: bg,
  color: color,
  border: `1px solid ${border}`,
  borderRadius: 7,
  padding: '9px 14px',
  fontWeight: 600,
  fontSize: '1.07rem',
  textAlign: 'center',
  margin: '6px 0'
});

export default Signup;
