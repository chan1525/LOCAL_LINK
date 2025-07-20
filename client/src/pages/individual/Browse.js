import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BrowseIndividuals = () => {
  const [individuals, setIndividuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIndividuals = async () => {
      const querySnapshot = await getDocs(collection(db, 'individuals'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIndividuals(data);
      setLoading(false);
    };
    fetchIndividuals();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2em auto', padding: 24 }}>
      <h2>Browse Individuals</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5em' }}>
        {individuals.map(individual => (
          <div key={individual.id} style={{ width: 250, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16, cursor: 'pointer' }}
            onClick={() => navigate(`/individual/${individual.id}`)}>
            {individual.image && <img src={individual.image} alt={individual.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />}
            <h3 style={{ margin: '0 0 8px 0' }}>{individual.name}</h3>
            <div style={{ color: '#555', marginBottom: 4 }}>{individual.occupation}</div>
            <div style={{ color: '#888', fontSize: 14 }}>{individual.skills}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseIndividuals; 