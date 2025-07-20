import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const IndividualDetails = () => {
  const { id } = useParams();
  const [individual, setIndividual] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndividual = async () => {
      const docRef = doc(db, 'individuals', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIndividual(docSnap.data());
      }
      setLoading(false);
    };
    fetchIndividual();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!individual) return <div>Individual not found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2em auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>{individual.name}</h2>
      {individual.image && <img src={individual.image} alt={individual.name} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />}
      <div><strong>Occupation:</strong> {individual.occupation}</div>
      <div><strong>Skills:</strong> {individual.skills}</div>
      <div><strong>Address:</strong> {individual.address}</div>
      <div><strong>Phone:</strong> {individual.phone}</div>
      <div><strong>Description:</strong> {individual.description}</div>
      <div><strong>Email:</strong> {individual.email}</div>
    </div>
  );
};

export default IndividualDetails; 