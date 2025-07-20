import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const MyConnections = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const reqSnap = await getDocs(collection(db, 'individuals', user.uid, 'connections'));
      setRequests(reqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'individuals', user.uid, 'connections', id), { status });
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    setUpdating(prev => ({ ...prev, [id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2em auto', padding: 24 }}>
      <h2>My Connections</h2>
      {requests.length === 0 && <div>No connection requests yet.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {requests.map(req => (
          <div key={req.id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{req.fromName}</span>
              <span style={{ color: '#888', marginLeft: 12 }}>{req.status === 'pending' ? 'Pending' : req.status === 'accepted' ? 'Connected' : 'Rejected'}</span>
            </div>
            {req.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleUpdate(req.id, 'accepted')}
                  disabled={updating[req.id]}
                  style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600 }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdate(req.id, 'rejected')}
                  disabled={updating[req.id]}
                  style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600 }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyConnections; 