import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import MessageModal from '../../components/MessageModal';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { jobId, applicantId, applicantName }

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const jobsSnap = await getDocs(collection(db, 'jobs'));
      const apps = [];
      for (const jobDoc of jobsSnap.docs) {
        const appSnap = await getDoc(doc(db, 'jobs', jobDoc.id, 'applications', user.uid));
        if (appSnap.exists()) {
          apps.push({
            jobId: jobDoc.id,
            job: jobDoc.data(),
            applicantId: user.uid,
            applicantName: appSnap.data().userName
          });
        }
      }
      setApplications(apps);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2em auto', padding: 24 }}>
      <h2>My Applications</h2>
      {applications.length === 0 && <div>You have not applied to any jobs yet.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5em' }}>
        {applications.map(app => (
          <div key={app.jobId} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 16, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{app.job.title}</h3>
            <div style={{ color: '#555', marginBottom: 4 }}><strong>Business:</strong> {app.job.businessName}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Location:</strong> {app.job.location}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Salary:</strong> {app.job.salary}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}><strong>Requirements:</strong> {app.job.requirements}</div>
            <div style={{ marginBottom: 8 }}>{app.job.description}</div>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>
              {app.job.createdAt && app.job.createdAt.toDate ? app.job.createdAt.toDate().toLocaleString() : ''}
            </div>
            <button
              style={{ marginTop: 8, padding: '4px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, alignSelf: 'flex-start' }}
              onClick={() => setModal({ jobId: app.jobId, applicantId: app.applicantId, applicantName: app.applicantName })}
            >
              Message
            </button>
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

export default MyApplications; 