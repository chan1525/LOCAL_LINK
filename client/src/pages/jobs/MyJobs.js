import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import MessageModal from '../../components/MessageModal';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState({});
  const [deleting, setDeleting] = useState({});
  const [modal, setModal] = useState(null); // { jobId, applicantId, applicantName }

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

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job and all its applications?')) return;
    setDeleting(prev => ({ ...prev, [jobId]: true }));
    // Delete all applications
    const appsSnap = await getDocs(collection(db, 'jobs', jobId, 'applications'));
    for (const appDoc of appsSnap.docs) {
      await deleteDoc(doc(db, 'jobs', jobId, 'applications', appDoc.id));
    }
    // Delete the job itself
    await deleteDoc(doc(db, 'jobs', jobId));
    setJobs(prev => prev.filter(job => job.id !== jobId));
    setDeleting(prev => ({ ...prev, [jobId]: false }));
  };

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
            <button
              onClick={() => handleDelete(job.id)}
              disabled={deleting[job.id]}
              style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, marginBottom: 12 }}
            >
              {deleting[job.id] ? 'Deleting...' : 'Delete'}
            </button>
            <div style={{ marginTop: 12 }}>
              <strong>Applications:</strong>
              <div style={{ marginTop: 8 }}>
                {(applications[job.id] || []).length === 0 && <div style={{ color: '#888' }}>No applications yet.</div>}
                {(applications[job.id] || []).map(app => (
                  <div key={app.id} style={{ marginBottom: 6, padding: 8, background: '#f5f6fa', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>{app.userName}</span>
                    <div style={{ color: '#888', fontSize: 11 }}>
                      {app.appliedAt && app.appliedAt.toDate ? app.appliedAt.toDate().toLocaleString() : ''}
                    </div>
                    <button
                      style={{ marginLeft: 12, padding: '4px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}
                      onClick={() => setModal({ jobId: job.id, applicantId: app.id, applicantName: app.userName })}
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <MessageModal
          jobId={modal.jobId}
          applicantId={modal.applicantId}
          applicantName={modal.applicantName}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default MyJobs; 