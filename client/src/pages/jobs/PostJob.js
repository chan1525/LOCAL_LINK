import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './PostJob.css';

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessData, setBusinessData] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessData = async () => {
      const user = auth.currentUser;
      if (user) {
        const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
        if (businessSnap.exists()) {
          setBusinessData(businessSnap.data());
        }
      }
    };
    fetchBusinessData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');
      
      const businessSnap = await getDoc(doc(db, 'business_owners', user.uid));
      if (!businessSnap.exists()) throw new Error('Only business owners can post jobs');
      const businessName = businessSnap.data().businessName;
      
      await addDoc(collection(db, 'jobs'), {
        ...form,
        uid: user.uid,
        businessName,
        createdAt: serverTimestamp()
      });
      
      navigate('/my-jobs');
    } catch (err) {
      setError(err.message || 'Failed to post job.');
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = (currentStep) => {
    switch (currentStep) {
      case 1:
        return form.title && form.location;
      case 2:
        return form.description && form.requirements;
      case 3:
        return form.salary;
      default:
        return false;
    }
  };

  return (
    <div className="post-job-executive">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="post-job-container">
        {/* Navigation Header */}
        <header className="page-navigation">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            title="Return to dashboard"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
          
          <div className="page-breadcrumb">
            <span className="breadcrumb-item">Dashboard</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item">Recruitment</span>
            <i className="fas fa-chevron-right"></i>
            <span className="breadcrumb-item current">Post Job</span>
          </div>
        </header>

        {/* Page Header */}
        <div className="page-hero">
          <div className="hero-content">
            <div className="hero-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="hero-text">
              <h1 className="hero-title">Post a New Job Opportunity</h1>
              <p className="hero-description">
                Find the perfect candidates for your team by creating detailed job listings 
                that attract top talent from your professional network.
              </p>
            </div>
          </div>
          
          {businessData && (
            <div className="company-preview">
              <div className="company-avatar">
                {businessData.image ? (
                  <img src={businessData.image} alt="Company logo" />
                ) : (
                  <div className="avatar-placeholder">
                    {businessData.businessName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="company-info">
                <span className="company-name">{businessData.businessName}</span>
                <span className="company-type">{businessData.businessType}</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="progress-container">
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-circle">
                <i className="fas fa-info-circle"></i>
              </div>
              <span className="step-label">Job Details</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-circle">
                <i className="fas fa-file-alt"></i>
              </div>
              <span className="step-label">Description</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-circle">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <span className="step-label">Compensation</span>
            </div>
          </div>
        </div>

        {/* Job Form */}
        <main className="form-section">
          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-card">
              {/* Step 1: Job Details */}
              {step === 1 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3>Basic Job Information</h3>
                    <p>Provide the essential details about this position</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="title">Job Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="e.g. Senior Software Engineer"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="location">Location *</label>
                      <div className="input-with-icon">
                        <i className="fas fa-map-marker-alt"></i>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          placeholder="e.g. Bangalore, Karnataka, India"
                          value={form.location}
                          onChange={handleChange}
                          required
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Description & Requirements */}
              {step === 2 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3>Job Description & Requirements</h3>
                    <p>Describe the role and ideal candidate qualifications</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="description">Job Description *</label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="form-textarea"
                      />
                      <div className="char-counter">
                        {form.description.length}/1000 characters
                      </div>
                    </div>
                    
                    <div className="form-group full-width">
                      <label htmlFor="requirements">Requirements *</label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        placeholder="List the required skills, experience, education, and qualifications..."
                        value={form.requirements}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="form-textarea"
                      />
                      <div className="char-counter">
                        {form.requirements.length}/1000 characters
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Compensation */}
              {step === 3 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3>Compensation & Benefits</h3>
                    <p>Specify the salary range and benefits for this position</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="salary">Salary Range *</label>
                      <div className="input-with-icon">
                        <i className="fas fa-rupee-sign"></i>
                        <input
                          type="text"
                          id="salary"
                          name="salary"
                          placeholder="e.g. ₹8,00,000 - ₹12,00,000 per annum"
                          value={form.salary}
                          onChange={handleChange}
                          required
                          className="form-input"
                        />
                      </div>
                    </div>
                    
                    {/* Job Summary Preview */}
                    <div className="job-preview">
                      <h4>Job Preview</h4>
                      <div className="preview-card">
                        <div className="preview-header">
                          <h5>{form.title || 'Job Title'}</h5>
                          <p>{businessData?.businessName}</p>
                        </div>
                        <div className="preview-details">
                          <div className="detail-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{form.location || 'Location'}</span>
                          </div>
                          <div className="detail-item">
                            <i className="fas fa-rupee-sign"></i>
                            <span>{form.salary || 'Salary Range'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="error-alert">
                  <div className="error-content">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <div className="action-buttons-left">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary"
                    >
                      <i className="fas fa-arrow-left"></i>
                      Previous
                    </button>
                  )}
                </div>
                
                <div className="action-buttons-right">
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(step)}
                      className="btn-primary"
                    >
                      Next
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !isStepValid(step)}
                      className={`btn-primary submit ${loading ? 'loading' : ''}`}
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Publishing Job...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          Publish Job
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </main>

        {/* Recruitment Tips */}
        <aside className="recruitment-tips">
          <div className="tips-card">
            <div className="tips-header">
              <div className="tips-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3 className="tips-title">Recruitment Best Practices</h3>
            </div>
            
            <div className="tips-content">
              <div className="tip-category">
                <h4>Writing Effective Job Descriptions</h4>
                <ul>
                  <li>Use clear, specific job titles that candidates search for</li>
                  <li>Highlight growth opportunities and company culture</li>
                  <li>Be specific about required skills and experience levels</li>
                  <li>Include information about your team and work environment</li>
                </ul>
              </div>
              
              <div className="tip-category">
                <h4>Attracting Quality Candidates</h4>
                <ul>
                  <li>Offer competitive compensation packages</li>
                  <li>Emphasize learning and development opportunities</li>
                  <li>Showcase your company's mission and values</li>
                  <li>Mention flexible work arrangements if available</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostJob;
