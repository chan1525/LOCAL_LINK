import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BrowseBusiness = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const querySnapshot = await getDocs(collection(db, 'business_owners'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBusinesses(data);
      setLoading(false);
    };
    fetchBusinesses();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2em auto', padding: 24 }}>
      <h2>Browse Business Owners</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5em' }}>
        {businesses.map(business => (
          <div key={business.id} style={{ width: 250, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16, cursor: 'pointer' }}
            onClick={() => navigate(`/business/${business.id}`)}>
            {business.image && <img src={business.image} alt={business.businessName} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />}
            <h3 style={{ margin: '0 0 8px 0' }}>{business.businessName}</h3>
            <div style={{ color: '#555', marginBottom: 4 }}>{business.name}</div>
            <div style={{ color: '#888', fontSize: 14 }}>{business.businessType}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseBusiness; 