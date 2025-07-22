import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

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
  mobileMenuButton: {
    display: 'none',
    color: 'white',
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  mobileMenu: {
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '20px',
    display: 'none',
    flexDirection: 'column',
    gap: '20px',
    zIndex: 999
  },
  typography: {
    h1: {
      fontSize: 'clamp(2.5rem, 5vw, 6rem)',
      fontWeight: 900,
      color: 'white',
      marginBottom: '24px',
      lineHeight: 1.1,
      textAlign: 'center'
    },
    h2: {
      fontSize: 'clamp(2rem, 4vw, 4rem)',
      fontWeight: 900,
      color: 'white',
      marginBottom: '24px',
      textAlign: 'center'
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      fontWeight: 700,
      color: 'white',
      marginBottom: '16px'
    },
    h4: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      fontWeight: 900,
      letterSpacing: '2px'
    },
    h5: {
      fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
      fontWeight: 700,
      color: 'white',
      marginBottom: '16px'
    },
    h6: {
      fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '32px',
      lineHeight: 1.6,
      textAlign: 'center'
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: 1.6
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
      color: '#93c5fd'
    }
  },
  button: {
    base: {
      position: 'relative',
      overflow: 'hidden',
      fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)',
      fontWeight: 600,
      padding: 'clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)',
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
  // Responsive testimonials styles
  testimonialsSection: {
    padding: 'clamp(40px, 8vw, 80px) 0',
    background: 'rgba(255, 255, 255, 0.02)'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(20px, 4vw, 32px)',
    marginTop: 'clamp(32px, 6vw, 64px)'
  },
  testimonialCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: 'clamp(20px, 4vw, 32px)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  testimonialAvatar: {
    width: 'clamp(60px, 10vw, 80px)',
    height: 'clamp(60px, 10vw, 80px)',
    borderRadius: '50%',
    margin: '0 auto 20px',
    objectFit: 'cover',
    border: '3px solid rgba(96, 165, 250, 0.3)'
  },
  testimonialQuote: {
    fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.6,
    marginBottom: '24px'
  },
  testimonialName: {
    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
    fontWeight: 700,
    color: 'white',
    marginBottom: '8px'
  },
  testimonialRole: {
    fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
    color: '#93c5fd'
  },
  // Responsive contact section styles
  contactSection: {
    padding: 'clamp(40px, 8vw, 80px) 0',
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
    gap: 'clamp(20px, 4vw, 32px)',
    marginTop: 'clamp(24px, 6vw, 48px)'
  },
  contactItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: 'clamp(16px, 3vw, 24px)',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  contactIcon: {
    width: 'clamp(36px, 6vw, 48px)',
    height: 'clamp(36px, 6vw, 48px)',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    borderRadius: '12px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  languageSelect: {
    marginLeft: '16px',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '15px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)'
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
      width: 'clamp(80px, 15vw, 128px)',
      height: 'clamp(80px, 15vw, 128px)',
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
      width: 'clamp(100px, 18vw, 160px)',
      height: 'clamp(100px, 18vw, 160px)',
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
      marginLeft: 'clamp(-40px, -8vw, -56px)',
      width: 'clamp(70px, 13vw, 112px)',
      height: 'clamp(70px, 13vw, 112px)',
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
        padding: 'clamp(16px, 3vw, 24px)'
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
        width: 'clamp(36px, 6vw, 48px)',
        height: 'clamp(36px, 6vw, 48px)',
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
          width: 'clamp(16px, 3vw, 24px)',
          height: 'clamp(16px, 3vw, 24px)',
          background: 'rgba(96, 165, 250, 0.6)',
          borderRadius: '4px'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(24px, 4vw, 32px)' }}>
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
        padding: 'clamp(16px, 3vw, 24px)',
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
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
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
    width: 'clamp(6px, 1vw, 8px)',
    height: 'clamp(6px, 1vw, 8px)',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Use translations for features and testimonials
  const localFeatures = t('features.list', { returnObjects: true }) || features;
  const localTestimonials = t('testimonials.list', { returnObjects: true }) || testimonials;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Language dropdown handler
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div style={styles.gradientBox}>
      {/* Global styles with responsive CSS */}
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
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-button { display: block !important; }
          .mobile-menu.open { display: flex !important; }
          .auth-buttons { gap: 8px !important; }
          .hero-buttons { flex-direction: column !important; align-items: center !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .contact-info { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        
        @media (max-width: 480px) {
          .container { padding: 0 16px !important; }
          .toolbar { padding: 0 16px !important; }
          .hero-section { padding-top: 120px !important; }
          .cta-section { padding: 40px 16px !important; }
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
            
            {/* Desktop Navigation */}
            <div className="nav-links" style={styles.navLinks}>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('about')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                {t('nav.about')}
              </a>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('features')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                {t('nav.features')}
              </a>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('testimonials')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                {t('nav.testimonials')}
              </a>
              <a 
                style={styles.navLink} 
                onClick={() => scrollToSection('contact')}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                {t('nav.contact')}
              </a>
              {/* Language Dropdown */}
              <select 
                onChange={handleLanguageChange} 
                defaultValue={i18n.language} 
                style={styles.languageSelect}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-button"
              style={styles.mobileMenuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>

            <div className="auth-buttons" style={styles.authButtons}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  ...styles.button.base,
                  ...styles.button.text,
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)',
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
                }}>
                  {t('nav.login')}
                </button>
              </Link>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <AnimatedButton variant="contained">
                  {t('nav.signup')}
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} style={styles.mobileMenu}>
          <a onClick={() => scrollToSection('about')} style={styles.navLink}>{t('nav.about')}</a>
          <a onClick={() => scrollToSection('features')} style={styles.navLink}>{t('nav.features')}</a>
          <a onClick={() => scrollToSection('testimonials')} style={styles.navLink}>{t('nav.testimonials')}</a>
          <a onClick={() => scrollToSection('contact')} style={styles.navLink}>{t('nav.contact')}</a>
          <select onChange={handleLanguageChange} defaultValue={i18n.language} style={styles.languageSelect}>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        ...styles.container,
        paddingTop: 'clamp(120px, 20vw, 160px)',
        paddingBottom: 'clamp(40px, 10vw, 80px)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Animated dots */}
        <PingDot style={{ top: '25%', left: '25%' }} delay={0} />
        <PingDot style={{ top: '75%', right: '25%' }} delay={1000} />
        <PingDot style={{ top: '50%', left: '75%' }} delay={2000} />

        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 8vw, 64px)' }}>
          <h1 style={styles.typography.h1}>
            {t('hero.title')}
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #60a5fa, #6366f1, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('hero.subtitle')}
            </span>
          </h1>

          <p style={{
            ...styles.typography.h6,
            maxWidth: '800px',
            margin: '0 auto clamp(16px, 4vw, 32px)'
          }}>
            {t('hero.description')}
          </p>

          <div className="hero-buttons" style={{
            display: 'flex',
            gap: 'clamp(16px, 3vw, 24px)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 'clamp(32px, 8vw, 64px)'
          }}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="contained">
                {t('hero.startNetworking')}
              </AnimatedButton>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <AnimatedButton variant="outlined">
                {t('hero.businessLogin')}
              </AnimatedButton>
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(16px, 4vw, 32px)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <StatsBox number="15K+" label={t('hero.stats.professionals')} delay={500} />
            <StatsBox number="2K+" label={t('hero.stats.businesses')} delay={700} />
            <StatsBox number="100+" label={t('hero.stats.cities')} delay={900} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        ...styles.container,
        paddingTop: 'clamp(40px, 8vw, 80px)',
        paddingBottom: 'clamp(40px, 8vw, 80px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 8vw, 64px)' }}>
          <h2 style={styles.typography.h2}>
            {t('about.title')}
          </h2>
          
          <div style={{
            width: 'clamp(60px, 12vw, 96px)',
            height: '4px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            margin: '0 auto clamp(16px, 4vw, 32px)',
            borderRadius: '2px'
          }} />
          
          <p style={{
            ...styles.typography.h6,
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        ...styles.container,
        paddingTop: 'clamp(40px, 8vw, 80px)',
        paddingBottom: 'clamp(40px, 8vw, 80px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 8vw, 64px)' }}>
          <h2 style={styles.typography.h2}>
            {t('features.title')}
          </h2>
          
          <div style={{
            width: 'clamp(60px, 12vw, 96px)',
            height: '4px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            margin: '0 auto clamp(16px, 4vw, 32px)',
            borderRadius: '2px'
          }} />
        </div>

        {/* Features Grid */}
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(20px, 4vw, 32px)',
          marginBottom: 'clamp(32px, 8vw, 64px)'
        }}>
          {localFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={styles.testimonialsSection}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(16px, 4vw, 32px)' }}>
            <h2 style={styles.typography.h2}>
              {t('testimonials.title')}
            </h2>
            
            <div style={{
              width: 'clamp(60px, 12vw, 96px)',
              height: '4px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              margin: '0 auto',
              borderRadius: '2px'
            }} />
          </div>

          <div className="testimonials-grid" style={styles.testimonialsGrid}>
            {localTestimonials.map((testimonial, index) => (
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
              {t('contact.title')}
            </h2>
            
            <div style={{
              width: 'clamp(60px, 12vw, 96px)',
              height: '4px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              margin: '0 auto clamp(16px, 4vw, 32px)',
              borderRadius: '2px'
            }} />
            
            <p style={{
              ...styles.typography.h6,
              marginBottom: 'clamp(24px, 6vw, 48px)'
            }}>
              {t('contact.description')}
            </p>

            <div className="contact-info" style={styles.contactInfo}>
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
                    width: 'clamp(16px, 3vw, 24px)', 
                    height: 'clamp(16px, 3vw, 24px)', 
                    background: 'white', 
                    borderRadius: '4px' 
                  }} />
                </div>
                <h4 style={styles.typography.h5}>{t('contact.email')}</h4>
                <p style={styles.typography.body1}>{t('contact.emailValue')}</p>
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
                    width: 'clamp(16px, 3vw, 24px)', 
                    height: 'clamp(16px, 3vw, 24px)', 
                    background: 'white', 
                    borderRadius: '4px' 
                  }} />
                </div>
                <h4 style={styles.typography.h5}>{t('contact.call')}</h4>
                <p style={styles.typography.body1}>{t('contact.callValue')}</p>
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
                    width: 'clamp(16px, 3vw, 24px)', 
                    height: 'clamp(16px, 3vw, 24px)', 
                    background: 'white', 
                    borderRadius: '4px' 
                  }} />
                </div>
                <h4 style={styles.typography.h5}>{t('contact.visit')}</h4>
                <p style={styles.typography.body1}>{t('contact.visitValue')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{
        ...styles.container,
        paddingTop: 'clamp(40px, 8vw, 80px)',
        paddingBottom: 'clamp(40px, 8vw, 80px)'
      }}>
        <div style={{
          ...styles.paper,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
          padding: 'clamp(32px, 8vw, 64px) clamp(16px, 4vw, 32px)',
          textAlign: 'center'
        }}>
          <h3 style={styles.typography.h3}>
            {t('cta.title')}
          </h3>
          <p style={{
            ...styles.typography.h6,
            marginBottom: 'clamp(16px, 4vw, 32px)'
          }}>
            {t('cta.description')}
          </p>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <AnimatedButton variant="contained">
              {t('cta.join')}
            </AnimatedButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 'clamp(24px, 6vw, 48px) 0'
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
            {t('footer.title')}
          </h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '24px',
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)'
          }}>
            {t('footer.description')}
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: 'clamp(0.75rem, 1vw, 0.875rem)'
          }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
