import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  addDoc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const JobsFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Fetch jobs the current user has applied to
    const fetchAppliedJobs = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const applied = [];
      for (const job of jobs) {
        const appRef = doc(db, 'jobs', job.id, 'applications', user.uid);
        const appSnap = await getDoc(appRef);
        if (appSnap.exists()) {
          applied.push(job.id);
        }
      }
      setAppliedJobs(applied);
    };
    if (jobs.length && auth.currentUser) fetchAppliedJobs();
  }, [jobs]);

  const handleApply = async (job) => {
    setApplying(prev => ({ ...prev, [job.id]: true }));
    const user = auth.currentUser;
    if (!user) return;
    // Get user name
    let userName = user.displayName || 'User';
    // Try to get from Firestore
    const indSnap = await getDoc(doc(db, 'individuals', user.uid));
    if (indSnap.exists()) userName = indSnap.data().name;
    // Add application (use UID as doc ID to prevent duplicates)
    await setDoc(doc(db, 'jobs', job.id, 'applications', user.uid), {
      uid: user.uid,
      userName,
      appliedAt: serverTimestamp()
    });
    setAppliedJobs(prev => [...prev, job.id]);
    setApplying(prev => ({ ...prev, [job.id]: false }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2em auto', padding: 24 }}>
      <h2>Job Listings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5em' }}>
        {jobs.map(job => (
          <div key={job.id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16 }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{job.title}</h3>
            <div style={{ color: '#555', marginBottom: 4 }}><strong>Business:</strong> {job.businessName}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Location:</strong> {job.location}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Salary:</strong> {job.salary}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Requirements:</strong> {job.requirements}</div>
            <div style={{ marginBottom: 8 }}>{job.description}</div>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
              {job.createdAt && job.createdAt.toDate ? job.createdAt.toDate().toLocaleString() : ''}
            </div>
            <button
              onClick={() => handleApply(job)}
              disabled={appliedJobs.includes(job.id) || applying[job.id]}
              style={{ padding: '8px 24px', background: appliedJobs.includes(job.id) ? '#ccc' : '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}
            >
              {appliedJobs.includes(job.id) ? 'Applied' : applying[job.id] ? 'Applying...' : 'Apply'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsFeed; 