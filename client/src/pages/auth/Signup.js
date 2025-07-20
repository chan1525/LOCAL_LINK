import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const initialBusiness = {
  name: '',
  email: '',
  password: '',
  businessName: '',
  businessType: '',
  address: '',
  phone: '',
  description: '',
  image: ''
};
const initialIndividual = {
  name: '',
  email: '',
  password: '',
  occupation: '',
  skills: '',
  address: '',
  phone: '',
  description: '',
  image: ''
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
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    // Validation
    for (const key in form) {
      if (key !== 'image' && !form[key]) {
        setError('All fields except image are required.');
        setLoading(false);
        return;
      }
    }
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      // Save details in Firestore (excluding password), using UID as doc ID
      const { password, ...userData } = form;
      await setDoc(doc(db, userType === 'business' ? 'business_owners' : 'individuals', user.uid), {
        ...userData,
        uid: user.uid,
        createdAt: new Date()
      });
      setSuccess(true);
      setForm(userType === 'business' ? initialBusiness : initialIndividual);
      // Redirect to the correct dashboard
      setTimeout(() => {
        navigate(userType === 'business' ? '/dashboard/business' : '/dashboard/individual');
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2em auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Signup</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input type="radio" value="business" checked={userType === 'business'} onChange={handleUserTypeChange} /> Business Owner
        </label>
        <label style={{ marginLeft: 24 }}>
          <input type="radio" value="individual" checked={userType === 'individual'} onChange={handleUserTypeChange} /> Individual
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        {userType === 'business' ? (
          <>
            <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
            <input name="businessType" placeholder="Business Type" value={form.businessType} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          </>
        ) : (
          <>
            <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
            <input name="skills" placeholder="Skills" value={form.skills} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          </>
        )}
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input name="image" type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%', marginBottom: 12 }} />
        {form.image && <img src={form.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />}
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>Signup successful!</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup; 