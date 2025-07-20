import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const BusinessDetails = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      const docRef = doc(db, 'business_owners', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBusiness(docSnap.data());
      }
      setLoading(false);
    };
    fetchBusiness();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!business) return <div>Business not found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2em auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>{business.businessName}</h2>
      {business.image && <img src={business.image} alt={business.businessName} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />}
      <div><strong>Owner:</strong> {business.name}</div>
      <div><strong>Business Type:</strong> {business.businessType}</div>
      <div><strong>Address:</strong> {business.address}</div>
      <div><strong>Phone:</strong> {business.phone}</div>
      <div><strong>Description:</strong> {business.description}</div>
      <div><strong>Email:</strong> {business.email}</div>
    </div>
  );
};

export default BusinessDetails; 