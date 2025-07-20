import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';

const MessageModal = ({ jobId, applicantId, applicantName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [businessOwnerUid, setBusinessOwnerUid] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch business owner UID for this job
    const fetchJob = async () => {
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      if (jobDoc.exists()) {
        setBusinessOwnerUid(jobDoc.data().uid);
      }
    };
    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const q = query(
      collection(db, 'jobs', jobId, 'applications', applicantId, 'messages'),
      orderBy('sentAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [jobId, applicantId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    const user = auth.currentUser;
    let senderName = user.displayName || 'User';
    await addDoc(collection(db, 'jobs', jobId, 'applications', applicantId, 'messages'), {
      senderUid: user.uid,
      senderName,
      content: input,
      sentAt: serverTimestamp()
    });
    setInput('');
    setSending(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 8, width: 350, maxHeight: 500, display: 'flex', flexDirection: 'column', boxShadow: '0 2px 16px #888', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
        <div style={{ padding: '16px 16px 0 16px', borderBottom: '1px solid #eee', fontWeight: 600 }}>
          Chat with {applicantName}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f5f6fa' }}>
          {messages.map(msg => {
            // Business owner messages always left, applicant messages always right
            const isApplicant = msg.senderUid === applicantId;
            const isBusinessOwner = msg.senderUid === businessOwnerUid;
            const align = isApplicant ? 'right' : 'left';
            const bg = isApplicant ? '#007bff' : '#eee';
            const color = isApplicant ? '#fff' : '#222';
            return (
              <div key={msg.id} style={{ marginBottom: 10, textAlign: align }}>
                <div style={{ display: 'inline-block', background: bg, color: color, borderRadius: 12, padding: '6px 12px', maxWidth: 200, wordBreak: 'break-word' }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                  {msg.sentAt && msg.sentAt.toDate ? msg.sentAt.toDate().toLocaleString() : ''}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #eee', padding: 12, background: '#fff' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }}
            disabled={sending}
          />
          <button type="submit" disabled={sending || !input.trim()} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageModal; 