import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BusinessDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      // Find the business owner by UID
      const q = doc(db, 'business_owners', user.uid);
      const docSnap = await getDoc(q);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2em auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Welcome, {userData.name}!</h2>
      <div style={{ margin: '2em 0', display: 'flex', gap: '1.5em' }}>
        <button onClick={() => navigate('/browse/business')}>Browse Business</button>
        <button onClick={() => navigate('/browse/individuals')}>Browse Individuals</button>
        <button onClick={() => navigate('/profile')}>Profile</button>
      </div>
    </div>
  );
};

export default BusinessDashboard; 