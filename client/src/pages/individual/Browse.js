import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BrowseIndividuals = () => {
  const [individuals, setIndividuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({});
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchIndividuals = async () => {
      const querySnapshot = await getDocs(collection(db, 'individuals'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIndividuals(data);
      setLoading(false);
    };
    fetchIndividuals();
  }, []);

  useEffect(() => {
    // Fetch connection status for each individual
    const fetchStatus = async () => {
      if (!currentUser) return;
      const status = {};
      for (const individual of individuals) {
        if (individual.id === currentUser.uid) continue;
        const reqRef = doc(db, 'individuals', individual.id, 'connections', currentUser.uid);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          status[individual.id] = reqSnap.data().status;
        }
      }
      setConnectionStatus(status);
    };
    if (individuals.length && currentUser) fetchStatus();
  }, [individuals, currentUser]);

  const handleConnect = async (individual) => {
    setConnecting(prev => ({ ...prev, [individual.id]: true }));
    const user = auth.currentUser;
    if (!user) return;
    // Prevent sending to self
    if (user.uid === individual.id) return;
    // Get user name
    let userName = user.displayName || 'User';
    const indSnap = await getDoc(doc(db, 'individuals', user.uid));
    if (indSnap.exists()) userName = indSnap.data().name;
    // Create connection request
    await setDoc(doc(db, 'individuals', individual.id, 'connections', user.uid), {
      fromUid: user.uid,
      fromName: userName,
      status: 'pending',
      createdAt: new Date()
    });
    setConnectionStatus(prev => ({ ...prev, [individual.id]: 'pending' }));
    setConnecting(prev => ({ ...prev, [individual.id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2em auto', padding: 24 }}>
      <h2>Browse Individuals</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5em' }}>
        {individuals.map(individual => (
          <div key={individual.id} style={{ width: 250, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16, cursor: 'pointer' }}>
            {individual.image && <img src={individual.image} alt={individual.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />}
            <h3 style={{ margin: '0 0 8px 0' }}>{individual.name}</h3>
            <div style={{ color: '#555', marginBottom: 4 }}>{individual.occupation}</div>
            <div style={{ color: '#888', fontSize: 14 }}>{individual.skills}</div>
            {currentUser && individual.id !== currentUser.uid && (
              <button
                onClick={() => handleConnect(individual)}
                disabled={connecting[individual.id] || connectionStatus[individual.id] === 'pending' || connectionStatus[individual.id] === 'accepted'}
                style={{ marginTop: 10, padding: '6px 16px', background: connectionStatus[individual.id] === 'accepted' ? '#28a745' : '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}
              >
                {connectionStatus[individual.id] === 'pending'
                  ? 'Request Sent'
                  : connectionStatus[individual.id] === 'accepted'
                  ? 'Connected'
                  : connecting[individual.id]
                  ? 'Connecting...'
                  : 'Connect'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseIndividuals; 