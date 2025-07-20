import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const myJobs = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.uid === user.uid);
      setJobs(myJobs);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Fetch applications for each job
    const fetchApplications = async () => {
      const apps = {};
      for (const job of jobs) {
        const appsSnap = await getDocs(collection(db, 'jobs', job.id, 'applications'));
        apps[job.id] = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      setApplications(apps);
    };
    if (jobs.length) fetchApplications();
  }, [jobs]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2em auto', padding: 24 }}>
      <h2>My Job Listings</h2>
      {jobs.length === 0 && <div>You have not posted any jobs yet.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5em' }}>
        {jobs.map(job => (
          <div key={job.id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16 }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{job.title}</h3>
            <div style={{ color: '#555', marginBottom: 4 }}><strong>Location:</strong> {job.location}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Salary:</strong> {job.salary}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Requirements:</strong> {job.requirements}</div>
            <div style={{ marginBottom: 8 }}>{job.description}</div>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
              {job.createdAt && job.createdAt.toDate ? job.createdAt.toDate().toLocaleString() : ''}
            </div>
            <div style={{ marginTop: 12 }}>
              <strong>Applications:</strong>
              <div style={{ marginTop: 8 }}>
                {(applications[job.id] || []).length === 0 && <div style={{ color: '#888' }}>No applications yet.</div>}
                {(applications[job.id] || []).map(app => (
                  <div key={app.id} style={{ marginBottom: 6, padding: 8, background: '#f5f6fa', borderRadius: 6 }}>
                    <span style={{ fontWeight: 500 }}>{app.userName}</span>
                    <div style={{ color: '#888', fontSize: 11 }}>
                      {app.appliedAt && app.appliedAt.toDate ? app.appliedAt.toDate().toLocaleString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs; 