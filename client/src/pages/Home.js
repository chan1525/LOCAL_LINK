import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Features data
const features = [
  {
    title: 'Business Networking',
    description: 'Connect with local businesses, suppliers, and potential partners to expand your professional network and discover new opportunities.'
  },
  {
    title: 'Talent Acquisition',
    description: 'Business owners can post job openings, skilled professionals can showcase their expertise, and everyone benefits from local talent matching.'
  },
  {
    title: 'Professional Communication',
    description: 'Streamlined messaging and collaboration tools designed for business communication and project coordination.'
  },
  {
    title: 'Multi-language Support',
    description: 'Conduct business in English, Hindi, or Kannada to serve your local market effectively and reach diverse customer bases.'
  },
  {
    title: 'Enterprise Security',
    description: 'Business-grade security and privacy protection with encrypted communications and secure data handling for professional use.'
  }
];

// Testimonials data
const testimonials = [
  {
    name: 'Priya K.',
    role: 'Small Business Owner',
    quote: "LOCAL LINK helped me hire trustworthy staff for my boutique and discover local suppliers I'd never met before. It's a must-have!",
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Rohit Sharma',
    role: 'Freelance Designer',
    quote: "I started getting project invites from local companies. Easy, secure, and all in my own language!",
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    name: 'Deepika N.',
    role: 'Startup Founder',
    quote: "Networking used to be hard in my town. Now my business found real partners and talent to grow.",
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

const styles = {
  gradientBox: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px'
  },
  appBar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent'
  },
  appBarScrolled: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    padding: '0 24px'
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
    fontWeight: 500
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  },
  authButtons: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  typography: {
    h1: {
      fontSize: 'clamp(3rem, 5vw, 6rem)',
      fontWeight: 900,
      color: 'white',
      marginBottom: '24px',
      lineHeight: 1.1,
      textAlign: 'center'
    },
    h2: {
      fontSize: 'clamp(2.5rem, 4vw, 4rem)',
      fontWeight: 900,
      color: 'white',
      marginBottom: '24px',
      textAlign: 'center'
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      color: 'white',
      marginBottom: '16px'
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 900,
      letterSpacing: '2px'
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: 'white',
      marginBottom: '16px'
    },
    h6: {
      fontSize: '1.25rem',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '32px',
      lineHeight: 1.6,
      textAlign: 'center'
    },
    body1: {
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      color: '#93c5fd'
    }
  },
  button: {
    base: {
      position: 'relative',
      overflow: 'hidden',
      fontSize: '1.125rem',
      fontWeight: 600,
      padding: '16px 32px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none'
    },
    contained: {
      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      color: 'white',
      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
    },
    outlined: {
      background: 'transparent',
      color: '#93c5fd',
      border: '2px solid #60a5fa'
    },
    text: {
      background: 'transparent',
      color: 'white',
      border: 'none'
    }
  },
  card: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    transition: 'all 0.5s ease',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  paper: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px'
  },
  grid: {
    display: 'grid',
    gap: '32px'
  },
  // Testimonials styles
  testimonialsSection: {
    padding: '80px 0',
    background: 'rgba(255, 255, 255, 0.02)'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '32px',
    marginTop: '64px'
  },
  testimonialCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  testimonialAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    margin: '0 auto 20px',
    objectFit: 'cover',
    border: '3px solid rgba(96, 165, 250, 0.3)'
  },
  testimonialQuote: {
    fontSize: '1.1rem',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.6,
    marginBottom: '24px'
  },
  testimonialName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '8px'
  },
  testimonialRole: {
    fontSize: '1rem',
    color: '#93c5fd'
  },
  // Contact section styles
  contactSection: {
    padding: '80px 0',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))'
  },
  contactContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  contactInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    marginTop: '48px'
  },
  contactItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  contactIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    borderRadius: '12px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

// Floating orbs component
const FloatingOrbs = () => (
  <div style={{
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  }}>
    <div style={{
      position: 'absolute',
      top: '80px',
      left: '40px',
      width: '128px',
      height: '128px',
      background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      opacity: 0.4,
      animation: 'pulse 4s ease-in-out infinite',
      mixBlendMode: 'multiply'
    }} />
    <div style={{
      position: 'absolute',
      top: '160px',
      right: '80px',
      width: '160px',
      height: '160px',
      background: 'linear-gradient(135deg, #10b981, #14b8a6)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      opacity: 0.4,
      animation: 'pulse 4s ease-in-out infinite 1s',
      mixBlendMode: 'multiply'
    }} />
    <div style={{
      position: 'absolute',
      top: '-40px',
      left: '50%',
      marginLeft: '-56px',
      width: '112px',
      height: '112px',
      background: 'linear-gradient(135deg, #64748b, #4b5563)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      opacity: 0.4,
      animation: 'pulse 4s ease-in-out infinite 2s',
      mixBlendMode: 'multiply'
    }} />
  </div>
);

// Animated button component
const AnimatedButton = ({ children, variant = 'contained', onClick, className = '', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const buttonStyle = {
    ...styles.button.base,
    ...styles.button[variant],
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered && variant === 'contained' 
      ? '0 20px 40px rgba(59, 130, 246, 0.4)' 
      : styles.button[variant].boxShadow || 'none',
    backgroundColor: isHovered && variant === 'outlined' ? '#3b82f6' : styles.button[variant].background,
    color: isHovered && variant === 'outlined' ? 'white' : styles.button[variant].color,
    borderColor: isHovered && variant === 'outlined' ? '#3b82f6' : '#60a5fa'
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={className}
      {...props}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        transition: 'transform 0.7s ease'
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
};

// Feature card component
const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradients = [
    'linear-gradient(135deg, #3b82f6, #6366f1)',
    'linear-gradient(135deg, #10b981, #14b8a6)',
    'linear-gradient(135deg, #64748b, #4b5563)',
    'linear-gradient(135deg, #6366f1, #3b82f6)',
    'linear-gradient(135deg, #14b8a6, #10b981)'
  ];

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? '0 25px 50px rgba(59, 130, 246, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '24px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: gradients[index % gradients.length],
        opacity: isHovered ? 0.1 : 0,
        transition: 'opacity 0.5s ease',
        borderRadius: '16px'
      }} />
      
      {/* Icon */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: isHovered ? gradients[index % gradients.length] : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
        zIndex: 2
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          background: 'rgba(96, 165, 250, 0.6)',
          borderRadius: '4px'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '32px' }}>
        <h3 style={{
          ...styles.typography.h5,
          background: isHovered ? 'linear-gradient(135deg, #93c5fd, #ddd6fe)' : 'none',
          WebkitBackgroundClip: isHovered ? 'text' : 'initial',
          WebkitTextFillColor: isHovered ? 'transparent' : 'white',
          transition: 'all 0.3s ease'
        }}>
          {feature.title}
        </h3>
        <p style={{
          ...styles.typography.body1,
          color: isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
          transition: 'color 0.3s ease'
        }}>
          {feature.description}
        </p>
      </div>
    </div>
  );
};

// Stats box component
const StatsBox = ({ number, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        ...styles.paper,
        padding: '24px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        transform: isVisible ? (isHovered ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        boxShadow: isHovered ? '0 15px 35px rgba(59, 130, 246, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        color: 'white',
        marginBottom: '8px'
      }}>
        {number}
      </div>
      <div style={styles.typography.body2}>
        {label}
      </div>
    </div>
  );
};

// Ping dot animation component
const PingDot = ({ style, delay = 0 }) => (
  <div style={{
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: '#60a5fa',
    borderRadius: '50%',
    ...style
  }}>
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#60a5fa',
      borderRadius: '50%',
      animation: `ping 2s infinite ${delay}ms`
    }} />
  </div>
);

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.gradientBox}>
      {/* Global styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
      `}</style>

      <FloatingOrbs />

      {/* Navigation */}
      <nav style={{
        ...styles.appBar,
        ...(scrollY > 50 ? styles.appBarScrolled : {})
      }}>
        <div style={styles.container}>
          <div style={styles.toolbar}>
            <h1 style={{
              ...styles.typography.h4,
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              LOCAL<span style={{ color: 'white' }}> LINK</span>
            </h1>
            <div style={styles.navLinks}>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('about')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                About
              </a>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('features')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                Features
              </a>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('testimonials')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                Testimonials
              </a>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('contact')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                Contact
              </a>
            </div>
            <div style={styles.authButtons}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  ...styles.button.base,
                  ...styles.button.text,
                  padding: '8px 16px'
                }}>
                  Login
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <AnimatedButton variant="contained">
                  Signup
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        ...styles.container,
        paddingTop: '160px',
        paddingBottom: '80px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Animated dots */}
        <PingDot style={{ top: '25%', left: '25%' }} delay={0} />
        <PingDot style={{ top: '75%', right: '25%' }} delay={1000} />
        <PingDot style={{ top: '50%', left: '75%' }} delay={2000} />

        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={styles.typography.h1}>
            Empower Your
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #60a5fa, #6366f1, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Local Business Network
            </span>
          </h1>

          <p style={{
            ...styles.typography.h6,
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            The professional network for local businesses, entrepreneurs, and skilled professionals.
            <span style={{ color: '#93c5fd', fontWeight: 600 }}>
              {' '}Connect, collaborate, and grow
            </span>
            {' '}your business with LOCAL LINK.
          </p>

          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '64px'
          }}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="contained">
                Start Networking
              </AnimatedButton>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="outlined">
                Business Login
              </AnimatedButton>
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <StatsBox number="15K+" label="Professionals" delay={500} />
            <StatsBox number="2K+" label="Businesses" delay={700} />
            <StatsBox number="100+" label="Cities" delay={900} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        ...styles.container,
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={styles.typography.h2}>
            About{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              LOCAL LINK
            </span>
          </h2>
          
          <div style={{
            width: '96px',
            height: '4px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            margin: '0 auto 32px',
            borderRadius: '2px'
          }} />
          
          <p style={{
            ...styles.typography.h6,
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            LOCAL LINK is the professional networking platform designed for tier 2 and tier 3 cities—connecting 
            local businesses, entrepreneurs, skilled professionals, and service providers. Whether you're seeking 
            business partnerships, hiring talent, or expanding your professional network, LOCAL LINK is your 
            gateway to local business growth.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        ...styles.container,
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={styles.typography.h2}>
            Our{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Features
            </span>
          </h2>
          
          <div style={{
            width: '96px',
            height: '4px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            margin: '0 auto 32px',
            borderRadius: '2px'
          }} />
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
          marginBottom: '64px'
        }}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={styles.testimonialsSection}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={styles.typography.h2}>
              What Our{' '}
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Users Say
              </span>
            </h2>
            
            <div style={{
              width: '96px',
              height: '4px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              margin: '0 auto',
              borderRadius: '2px'
            }} />
          </div>

          <div style={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.testimonialCard,
                  ':hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.15)'
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  style={styles.testimonialAvatar}
                />
                <p style={styles.testimonialQuote}>"{testimonial.quote}"</p>
                <h5 style={styles.testimonialName}>{testimonial.name}</h5>
                <p style={styles.testimonialRole}>{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.contactSection}>
        <div style={styles.container}>
          <div style={styles.contactContent}>
            <h2 style={styles.typography.h2}>
              Get In{' '}
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Touch
              </span>
            </h2>
            
            <div style={{
              width: '96px',
              height: '4px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              margin: '0 auto 32px',
              borderRadius: '2px'
            }} />
            
            <p style={{
              ...styles.typography.h6,
              marginBottom: '48px'
            }}>
              Ready to transform your local business network? Get in touch with us today and join the LOCAL LINK community.
            </p>

            <div style={styles.contactInfo}>
              <div style={{
                ...styles.contactItem,
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1)'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                <div style={styles.contactIcon}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: 'white', 
                    borderRadius: '4px' 
                  }} />
                </div>
                <h4 style={styles.typography.h5}>Email Us</h4>
                <p style={styles.typography.body1}>contact@locallink.com</p>
              </div>

              <div style={{
                ...styles.contactItem,
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1)'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                <div style={styles.contactIcon}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: 'white', 
                    borderRadius: '4px' 
                  }} />
                </div>
                <h4 style={styles.typography.h5}>Call Us</h4>
                <p style={styles.typography.body1}>+91 98765 43210</p>
              </div>

              <div style={{
                ...styles.contactItem,
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1)'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                <div style={styles.contactIcon}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    background: 'white', 
                    borderRadius: '4px' 
                  }} />
                </div>
                <h4 style={styles.typography.h5}>Visit Us</h4>
                <p style={styles.typography.body1}>Business District, Tech City</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        ...styles.container,
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{
          ...styles.paper,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
          padding: '64px 32px',
          textAlign: 'center'
        }}>
          <h3 style={styles.typography.h3}>
            Ready to Expand Your Professional Network?
          </h3>
          <p style={{
            ...styles.typography.h6,
            marginBottom: '32px'
          }}>
            Join thousands of local businesses and professionals already growing together
          </p>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <AnimatedButton variant="contained">
              Join the Network
            </AnimatedButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '48px 0'
      }}>
        <div style={{
          ...styles.container,
          textAlign: 'center'
        }}>
          <h3 style={{
            ...styles.typography.h4,
            background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            LOCAL<span style={{ color: 'white' }}> LINK</span>
          </h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '24px'
          }}>
            Professional networking • Business growth • Local connections
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.875rem'
          }}>
            © {new Date().getFullYear()} LOCAL LINK. Empowering professional communities worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
