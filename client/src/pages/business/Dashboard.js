import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const navActions = [
  { label: "Create Post", icon: "📝", route: "/create-post", description: "Share updates" },
  { label: "View Posts", icon: "📋", route: "/posts", description: "See all posts" },
  { label: "Post Job", icon: "💼", route: "/post-job", description: "Hire talent" },
  { label: "My Jobs", icon: "📁", route: "/my-jobs", description: "Manage jobs" },
  { label: "Browse Business", icon: "🏢", route: "/browse/business", description: "Find businesses" },
  { label: "Browse Individuals", icon: "👥", route: "/browse/individuals", description: "Find professionals" },
  { label: "Profile", icon: "⚙️", route: "/profile", description: "Manage account" },
];

const statsCards = [
  { icon: "📈", title: "Growth Ready", description: "Scale your business with powerful tools" },
  { icon: "🤝", title: "Connect", description: "Network with professionals worldwide" },
  { icon: "⚡", title: "Efficient", description: "Streamline your business operations" },
];

const mainBlue = "#183484";
const lightGray = "#f8fafc";
const cardBorder = "#dde1ea";
const cardShadow = "0 2px 12px #dde1ea1a";

const BusinessDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      const q = doc(db, 'business_owners', user.uid);
      const docSnap = await getDoc(q);
      if (docSnap.exists()) setUserData(docSnap.data());
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading)
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: lightGray,
        color: mainBlue, fontWeight: 500, fontSize: 22
      }}>
        Loading...
      </div>
    );
  if (!userData)
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: lightGray,
        color: '#b91c1c', fontWeight: 500, fontSize: 22
      }}>
        User not found.
      </div>
    );

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: lightGray,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch'
    }}>
      {/* HEADER */}
      <header style={{
        width: '100%',
        background: '#fff',
        borderBottom: `1.5px solid ${cardBorder}`,
        padding: '30px 3vw 14px 3vw',
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 29,
            fontWeight: 900,
            color: mainBlue,
            letterSpacing: 1.05,
          }}>
            Welcome, <span style={{
              background: 'linear-gradient(90deg,#183484 35%,#64748b 85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{userData.name}</span>
          </h1>
          <div style={{
            color: '#476085',
            fontSize: 16,
            fontWeight: 400,
            marginTop: 3
          }}>
            Business Owner Dashboard
          </div>
        </div>
        <button
          onClick={async () => { await signOut(auth); navigate('/'); }}
          style={{
            padding: '10px 28px',
            background: mainBlue,
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            fontWeight: 700,
            fontSize: '1.07rem',
            cursor: 'pointer',
            letterSpacing: 0.4,
            boxShadow: '0 2px 3px #dde1ea30',
            marginLeft: 'auto'
          }}
        >Log Out</button>
      </header>
      {/* WELCOME/HERO SECTION */}
      <section style={{
        width: '100%',
        background: '#f1f5fa',
        borderBottom: `1.5px solid ${cardBorder}`,
        padding: '38px 3vw 28px 3vw',
        margin: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 0 0 3vw'
        }}>
          <span style={{
            fontSize: 37,
            background: '#e5e8f5',
            borderRadius: '40%',
            padding: 12,
            marginRight: 10,
            color: "#355"
          }}>🏢</span>
          <div>
            <h2 style={{
              fontWeight: 900,
              fontSize: 31,
              color: mainBlue,
              lineHeight: 1.13,
              margin: '0 0 7px 0'
            }}>
              Grow your business and your network
            </h2>
            <p style={{
              color: '#637298',
              fontSize: 17,
              margin: 0,
              maxWidth: 550,
              fontWeight: 500,
              lineHeight: 1.5
            }}>
              Access all your tools in one place: post, hire, connect, and collaborate professionally.
            </p>
          </div>
        </div>
      </section>

      {/* NAVIGATION GRID */}
      <nav style={{
        width: '100%',
        margin: '0 auto',
        padding: '36px 3vw 0 3vw',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
          gap: 24,
          margin: '0 auto'
        }}>
          {navActions.map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.route)}
              style={{
                background: '#fff',
                border: `1.2px solid ${cardBorder}`,
                borderRadius: 10,
                boxShadow: cardShadow,
                padding: '30px 11px 19px 11px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: 20,
                color: mainBlue,
                cursor: 'pointer',
                transition: 'box-shadow .16s, border-color .14s, transform .14s',
                outline: 'none',
                minHeight: 138,
                textAlign: 'center'
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = "0 4px 20px #18348418";
                e.currentTarget.style.borderColor = "#64748b";
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = cardShadow;
                e.currentTarget.style.borderColor = cardBorder;
                e.currentTarget.style.transform = "none";
              }}
              tabIndex={0}
            >
              <span style={{
                fontSize: 30,
                marginBottom: 1
              }}>{action.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 16.7 }}>{action.label}</span>
              <span style={{
                fontSize: 13.6,
                fontWeight: 400,
                color: '#7e97b8',
                marginTop: 3
              }}>
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* AT-A-GLANCE STATS */}
      <section style={{
        width: '100%',
        background: '#f1f5fa',
        padding: '38px 3vw 46px 3vw',
        marginTop: 44,
        borderTop: `1.5px solid ${cardBorder}`,
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
          gap: 20,
          margin: '0 auto'
        }}>
          {statsCards.map(card => (
            <div key={card.title}
              style={{
                background: '#fff',
                border: `1.2px solid ${cardBorder}`,
                borderRadius: 10,
                textAlign: 'center',
                boxShadow: cardShadow,
                padding: '20px 9px 13px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 100
              }}>
              <div style={{ fontSize: 27, marginBottom: 7 }}>{card.icon}</div>
              <div style={{
                fontSize: 17.5, fontWeight: 700, color: mainBlue, marginBottom: 2
              }}>{card.title}</div>
              <div style={{
                fontSize: 14, color: "#7e97b8", fontWeight: 400,
                lineHeight: 1.45
              }}>{card.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Responsive adjustments */}
      <style>
        {`
        @media (max-width: 1100px) {
          header, section, nav { padding-left: 4vw !important; padding-right: 4vw !important; }
        }
        @media (max-width: 740px) {
          header h1 { font-size: 17px !important; }
          section h2 { font-size: 19px !important; }
          nav>div, section>div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          header, section, nav { padding-left: 1vw !important; padding-right: 1vw !important; }
        }
        `}
      </style>
    </div>
  );
};

export default BusinessDashboard;
