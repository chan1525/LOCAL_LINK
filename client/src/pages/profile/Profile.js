import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userType, setUserType] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      // Check business owner first
      const businessRef = doc(db, 'business_owners', user.uid);
      const businessSnap = await getDoc(businessRef);
      if (businessSnap.exists()) {
        setUserType('business');
        setForm(businessSnap.data());
        setLoading(false);
        return;
      }
      // Check individual
      const individualRef = doc(db, 'individuals', user.uid);
      const individualSnap = await getDoc(individualRef);
      if (individualSnap.exists()) {
        setUserType('individual');
        setForm(individualSnap.data());
        setLoading(false);
        return;
      }
      setError('User not found.');
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');
      const ref = doc(db, userType === 'business' ? 'business_owners' : 'individuals', user.uid);
      // Don't update email or password
      const { email, password, uid, ...updateData } = form;
      await updateDoc(ref, updateData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile.');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>{error || 'Profile not found.'}</div>;

  return (
    <div style={{ maxWidth: 500, margin: '2em auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Profile</h2>
      <form onSubmit={handleSave}>
        <input name="name" placeholder="Name" value={form.name || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        {userType === 'business' ? (
          <>
            <input name="businessName" placeholder="Business Name" value={form.businessName || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
            <input name="businessType" placeholder="Business Type" value={form.businessType || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          </>
        ) : (
          <>
            <input name="occupation" placeholder="Occupation" value={form.occupation || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
            <input name="skills" placeholder="Skills" value={form.skills || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          </>
        )}
        <input name="address" placeholder="Address" value={form.address || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input name="phone" placeholder="Phone" value={form.phone || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <textarea name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        {form.image && <img src={form.image} alt="Profile" style={{ width: 80, height: 80, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />}
        {/* Optionally allow image update here */}
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>Profile updated!</div>}
        <button type="submit" disabled={saving} style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile; 