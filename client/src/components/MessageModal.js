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
import './MessageModal.css';

const MessageModal = ({ jobId, applicantId, applicantName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [businessOwnerUid, setBusinessOwnerUid] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchJob = async () => {
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      if (jobDoc.exists()) {
        const jobData = jobDoc.data();
        setBusinessOwnerUid(jobData.uid);
        setJobDetails(jobData);
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
    
    // Get user name from appropriate collection
    if (user.uid === businessOwnerUid) {
      const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
      if (businessSnap.exists()) senderName = businessSnap.data().name;
    } else {
      const individualSnap = await getDoc(doc(db, 'individuals', user.uid));
      if (individualSnap.exists()) senderName = individualSnap.data().name;
    }
    
    await addDoc(collection(db, 'jobs', jobId, 'applications', applicantId, 'messages'), {
      senderUid: user.uid,
      senderName,
      content: input,
      sentAt: serverTimestamp()
    });
    setInput('');
    setSending(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="message-modal-overlay">
      <div className="message-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="chat-info">
            <div className="participant-avatar">
              {applicantName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="chat-details">
              <h3 className="chat-title">
                {auth.currentUser?.uid === businessOwnerUid ? 
                  `Chat with ${applicantName}` : 
                  `Chat with ${jobDetails?.businessName || 'Employer'}`
                }
              </h3>
              <p className="job-reference">
                Regarding: {jobDetails?.title || 'Job Application'}
              </p>
            </div>
          </div>
          <button 
            className="close-button"
            onClick={onClose}
            title="Close chat"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <div className="no-messages-icon">
                <i className="fas fa-comment"></i>
              </div>
              <p>Start the conversation</p>
              <span>Send a message to begin discussing this opportunity</span>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.senderUid === auth.currentUser?.uid;
                const showDate = index === 0 || 
                  (messages[index - 1]?.sentAt?.toDate()?.toDateString() !== msg.sentAt?.toDate()?.toDateString());
                
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="date-separator">
                        {msg.sentAt?.toDate()?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                    <div className={`message ${isCurrentUser ? 'sent' : 'received'}`}>
                      {!isCurrentUser && (
                        <div className="message-avatar">
                          {msg.senderName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="message-content">
                        <div className="message-bubble">
                          <p>{msg.content}</p>
                        </div>
                        <div className="message-meta">
                          <span className="message-sender">{msg.senderName}</span>
                          <span className="message-time">{formatTime(msg.sentAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="message-input-form">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
              disabled={sending}
              maxLength={500}
            />
            <button 
              type="submit" 
              disabled={sending || !input.trim()}
              className={`send-button ${sending ? 'sending' : ''}`}
            >
              {sending ? (
                <div className="sending-spinner"></div>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>
          <div className="input-footer">
            <span className="char-count">{input.length}/500</span>
            <span className="input-hint">Press Enter to send</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
