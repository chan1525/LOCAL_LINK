import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f5f6fa' }}>
      <h1 style={{ color: '#222', marginBottom: '0.5em' }}>LOCAL_LINK</h1>
      <p style={{ color: '#555', maxWidth: 400, textAlign: 'center', marginBottom: '2em' }}>
        Connect local businesses and individuals in your city. Discover, collaborate, and grow together with LOCAL_LINK.
      </p>
      <div style={{ display: 'flex', gap: '1.5em' }}>
        <Link to="/login" style={{ padding: '0.75em 2em', background: '#007bff', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 500 }}>Login</Link>
        <Link to="/signup" style={{ padding: '0.75em 2em', background: '#28a745', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 500 }}>Signup</Link>
      </div>
    </div>
  );
};

export default Home; 