import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        about: 'About',
        features: 'Features',
        testimonials: 'Testimonials',
        contact: 'Contact',
        login: 'Login',
        signup: 'Signup',
      },
      hero: {
        title: 'Empower Your',
        subtitle: 'Local Business Network',
        description: 'The professional network for local businesses, entrepreneurs, and skilled professionals. Connect, collaborate, and grow your business with LOCAL LINK.',
        startNetworking: 'Start Networking',
        businessLogin: 'Business Login',
        stats: {
          professionals: 'Professionals',
          businesses: 'Businesses',
          cities: 'Cities',
        },
      },
      about: {
        title: 'About LOCAL LINK',
        description: 'LOCAL LINK is the professional networking platform designed for tier 2 and tier 3 cities—connecting local businesses, entrepreneurs, skilled professionals, and service providers. Whether you\'re seeking business partnerships, hiring talent, or expanding your professional network, LOCAL LINK is your gateway to local business growth.'
      },
      features: {
        title: 'Our Features',
        list: [
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
        ]
      },
      testimonials: {
        title: 'What Our Users Say',
        list: [
          {
            name: 'Priya K.',
            role: 'Small Business Owner',
            quote: "LOCAL LINK helped me hire trustworthy staff for my boutique and discover local suppliers I'd never met before. It's a must-have!"
          },
          {
            name: 'Rohit Sharma',
            role: 'Freelance Designer',
            quote: "I started getting project invites from local companies. Easy, secure, and all in my own language!"
          },
          {
            name: 'Deepika N.',
            role: 'Startup Founder',
            quote: "Networking used to be hard in my town. Now my business found real partners and talent to grow."
          }
        ]
      },
      contact: {
        title: 'Get In Touch',
        email: 'Email Us',
        call: 'Call Us',
        visit: 'Visit Us',
        emailValue: 'contact@locallink.com',
        callValue: '+91 98765 43210',
        visitValue: 'Business District, Tech City',
        description: 'Ready to transform your local business network? Get in touch with us today and join the LOCAL LINK community.'
      },
      cta: {
        title: 'Ready to Expand Your Professional Network?',
        description: 'Join thousands of local businesses and professionals already growing together',
        join: 'Join the Network'
      },
      footer: {
        title: 'LOCAL LINK',
        description: 'Professional networking • Business growth • Local connections',
        copyright: '© {{year}} LOCAL LINK. Empowering professional communities worldwide.'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        about: 'परिचय',
        features: 'विशेषताएँ',
        testimonials: 'प्रशंसापत्र',
        contact: 'संपर्क',
        login: 'लॉगिन',
        signup: 'साइन अप',
      },
      hero: {
        title: 'सशक्त बनाएं',
        subtitle: 'स्थानीय व्यवसाय नेटवर्क',
        description: 'स्थानीय व्यवसायों, उद्यमियों और कुशल पेशेवरों के लिए पेशेवर नेटवर्क। LOCAL LINK के साथ अपने व्यवसाय को जोड़ें, सहयोग करें और बढ़ाएं।',
        startNetworking: 'नेटवर्किंग शुरू करें',
        businessLogin: 'व्यवसाय लॉगिन',
        stats: {
          professionals: 'पेशेवर',
          businesses: 'व्यवसाय',
          cities: 'शहर',
        },
      },
      about: {
        title: 'LOCAL LINK के बारे में',
        description: 'LOCAL LINK एक पेशेवर नेटवर्किंग प्लेटफॉर्म है जो टियर 2 और टियर 3 शहरों के लिए डिज़ाइन किया गया है—स्थानीय व्यवसायों, उद्यमियों, कुशल पेशेवरों और सेवा प्रदाताओं को जोड़ता है। चाहे आप व्यवसाय साझेदारी, प्रतिभा की भर्ती, या अपने पेशेवर नेटवर्क का विस्तार करना चाहते हों, LOCAL LINK आपके स्थानीय व्यवसाय विकास का द्वार है।'
      },
      features: {
        title: 'हमारी विशेषताएँ',
        list: [
          {
            title: 'व्यवसाय नेटवर्किंग',
            description: 'स्थानीय व्यवसायों, आपूर्तिकर्ताओं और संभावित भागीदारों के साथ जुड़ें और अपने पेशेवर नेटवर्क का विस्तार करें।'
          },
          {
            title: 'प्रतिभा अधिग्रहण',
            description: 'व्यवसाय मालिक नौकरी पोस्ट कर सकते हैं, पेशेवर अपनी विशेषज्ञता दिखा सकते हैं, और सभी को स्थानीय प्रतिभा मिलती है।'
          },
          {
            title: 'पेशेवर संचार',
            description: 'व्यवसाय संचार और परियोजना समन्वय के लिए सुव्यवस्थित संदेश और सहयोग उपकरण।'
          },
          {
            title: 'बहुभाषी समर्थन',
            description: 'अंग्रेज़ी, हिंदी या कन्नड़ में व्यवसाय करें और अपने स्थानीय बाज़ार तक पहुँचें।'
          },
          {
            title: 'एंटरप्राइज सुरक्षा',
            description: 'पेशेवर उपयोग के लिए एन्क्रिप्टेड संचार और सुरक्षित डेटा हैंडलिंग के साथ सुरक्षा और गोपनीयता।'
          }
        ]
      },
      testimonials: {
        title: 'हमारे उपयोगकर्ता क्या कहते हैं',
        list: [
          {
            name: 'प्रिया के.',
            role: 'छोटे व्यवसाय की मालिक',
            quote: 'LOCAL LINK ने मेरी बुटीक के लिए भरोसेमंद स्टाफ खोजने और स्थानीय आपूर्तिकर्ताओं से मिलने में मदद की। यह जरूरी है!'
          },
          {
            name: 'रोहित शर्मा',
            role: 'फ्रीलांस डिज़ाइनर',
            quote: 'मुझे स्थानीय कंपनियों से प्रोजेक्ट निमंत्रण मिलने लगे। आसान, सुरक्षित, और मेरी अपनी भाषा में!'
          },
          {
            name: 'दीपिका एन.',
            role: 'स्टार्टअप संस्थापक',
            quote: 'मेरे शहर में नेटवर्किंग कठिन थी। अब मेरे व्यवसाय को असली साझेदार और प्रतिभा मिली है।'
          }
        ]
      },
      contact: {
        title: 'संपर्क करें',
        email: 'हमें ईमेल करें',
        call: 'हमें कॉल करें',
        visit: 'हमसे मिलें',
        emailValue: 'contact@locallink.com',
        callValue: '+91 98765 43210',
        visitValue: 'बिजनेस डिस्ट्रिक्ट, टेक सिटी',
        description: 'क्या आप अपने स्थानीय व्यवसाय नेटवर्क को बदलने के लिए तैयार हैं? आज ही हमसे संपर्क करें और LOCAL LINK समुदाय में शामिल हों।'
      },
      cta: {
        title: 'क्या आप अपने पेशेवर नेटवर्क का विस्तार करना चाहते हैं?',
        description: 'हजारों स्थानीय व्यवसायों और पेशेवरों के साथ जुड़ें',
        join: 'नेटवर्क से जुड़ें'
      },
      footer: {
        title: 'LOCAL LINK',
        description: 'पेशेवर नेटवर्किंग • व्यवसाय विकास • स्थानीय कनेक्शन',
        copyright: '© {{year}} LOCAL LINK. पेशेवर समुदायों को सशक्त बनाना।'
      }
    }
  },
  kn: {
    translation: {
      nav: {
        about: 'ಪರಿಚಯ',
        features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
        testimonials: 'ಪ್ರಶಂಸೆಗಳು',
        contact: 'ಸಂಪರ್ಕ',
        login: 'ಲಾಗಿನ್',
        signup: 'ಸೈನ್ ಅಪ್',
      },
      hero: {
        title: 'ಶಕ್ತಿಮಾಡಿ ನಿಮ್ಮ',
        subtitle: 'ಸ್ಥಳೀಯ ವ್ಯವಹಾರ ಜಾಲ',
        description: 'ಸ್ಥಳೀಯ ವ್ಯವಹಾರಗಳು, ಉದ್ಯಮಿಗಳು ಮತ್ತು ನಿಪುಣ ವೃತ್ತಿಪರರಿಗಾಗಿ ವೃತ್ತಿಪರ ಜಾಲ. LOCAL LINK ಮೂಲಕ ನಿಮ್ಮ ವ್ಯವಹಾರವನ್ನು ಸಂಪರ್ಕಿಸಿ, ಸಹಕರಿಸಿ ಮತ್ತು ಬೆಳೆಯಿರಿ.',
        startNetworking: 'ಜಾಲ ಆರಂಭಿಸಿ',
        businessLogin: 'ವ್ಯವಹಾರ ಲಾಗಿನ್',
        stats: {
          professionals: 'ವೃತ್ತಿಪರರು',
          businesses: 'ವ್ಯವಹಾರಗಳು',
          cities: 'ನಗರಗಳು',
        },
      },
      about: {
        title: 'LOCAL LINK ಬಗ್ಗೆ',
        description: 'LOCAL LINK ಅನ್ನು ಟಿಯರ್ 2 ಮತ್ತು ಟಿಯರ್ 3 ನಗರಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ—ಸ್ಥಳೀಯ ವ್ಯವಹಾರಗಳು, ಉದ್ಯಮಿಗಳು, ನಿಪುಣ ವೃತ್ತಿಪರರು ಮತ್ತು ಸೇವಾ ಪೂರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ. ನೀವು ವ್ಯವಹಾರ ಪಾಲುದಾರಿಕೆ, ಪ್ರತಿಭೆ ನೇಮಕಾತಿ ಅಥವಾ ನಿಮ್ಮ ವೃತ್ತಿಪರ ಜಾಲವನ್ನು ವಿಸ್ತರಿಸಲು ಬಯಸಿದರೂ, LOCAL LINK ನಿಮ್ಮ ಸ್ಥಳೀಯ ವ್ಯವಹಾರ ಬೆಳವಣಿಗೆಯ ದ್ವಾರ.'
      },
      features: {
        title: 'ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳು',
        list: [
          {
            title: 'ವ್ಯವಹಾರ ಜಾಲ',
            description: 'ಸ್ಥಳೀಯ ವ್ಯವಹಾರಗಳು, ಪೂರೈಕೆದಾರರು ಮತ್ತು ಭಾಗೀದಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ನಿಮ್ಮ ವೃತ್ತಿಪರ ಜಾಲವನ್ನು ವಿಸ್ತರಿಸಿ.'
          },
          {
            title: 'ಪ್ರತಿಭೆ ಹಂಚಿಕೆ',
            description: 'ವ್ಯವಹಾರ ಮಾಲೀಕರು ಉದ್ಯೋಗಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಬಹುದು, ವೃತ್ತಿಪರರು ತಮ್ಮ ಪರಿಣತಿಯನ್ನು ತೋರಿಸಬಹುದು, ಮತ್ತು ಎಲ್ಲರೂ ಸ್ಥಳೀಯ ಪ್ರತಿಭೆಯಿಂದ ಲಾಭ ಪಡೆಯುತ್ತಾರೆ.'
          },
          {
            title: 'ವೃತ್ತಿಪರ ಸಂವಹನ',
            description: 'ವ್ಯವಹಾರ ಸಂವಹನ ಮತ್ತು ಯೋಜನೆ ಸಂಯೋಜನೆಗಾಗಿ ಸುಗಮ ಸಂದೇಶ ಮತ್ತು ಸಹಕಾರ ಸಾಧನಗಳು.'
          },
          {
            title: 'ಬಹುಭಾಷಾ ಬೆಂಬಲ',
            description: 'ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ವ್ಯವಹಾರ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಗೆ ತಲುಪಿರಿ.'
          },
          {
            title: 'ಎಂಟರ್‌ಪ್ರೈಸ್ ಭದ್ರತೆ',
            description: 'ವೃತ್ತಿಪರ ಬಳಕೆಗೆ ಎನ್‌ಕ್ರಿಪ್ಟೆಡ್ ಸಂವಹನ ಮತ್ತು ಸುರಕ್ಷಿತ ಡೇಟಾ ಹ್ಯಾಂಡ್ಲಿಂಗ್‌ನೊಂದಿಗೆ ಭದ್ರತೆ ಮತ್ತು ಗೌಪ್ಯತೆ.'
          }
        ]
      },
      testimonials: {
        title: 'ನಮ್ಮ ಬಳಕೆದಾರರು ಏನು ಹೇಳುತ್ತಾರೆ',
        list: [
          {
            name: 'ಪ್ರಿಯಾ ಕೆ.',
            role: 'ಸಣ್ಣ ವ್ಯವಹಾರ ಮಾಲಕಿ',
            quote: 'LOCAL LINK ನನ್ನ ಬಟಿಕ್‌ಗೆ ನಂಬಿಗಸ್ತ ಸಿಬ್ಬಂದಿಯನ್ನು ನೇಮಿಸಲು ಮತ್ತು ಸ್ಥಳೀಯ ಪೂರೈಕೆದಾರರನ್ನು ಕಂಡುಹಿಡಿಯಲು ಸಹಾಯ ಮಾಡಿತು. ಇದು ಅಗತ್ಯವಿದೆ!'
          },
          {
            name: 'ರೋಹಿತ್ ಶರ್ಮಾ',
            role: 'ಫ್ರೀಲಾನ್ಸ್ ಡಿಸೈನರ್',
            quote: 'ನನಗೆ ಸ್ಥಳೀಯ ಕಂಪನಿಗಳಿಂದ ಪ್ರಾಜೆಕ್ಟ್ ಆಹ್ವಾನಗಳು ಬರಲು ಆರಂಭವಾಯಿತು. ಸುಲಭ, ಸುರಕ್ಷಿತ, ಮತ್ತು ನನ್ನ ಭಾಷೆಯಲ್ಲಿ!'
          },
          {
            name: 'ದೀಪಿಕಾ ಎನ್.',
            role: 'ಸ್ಟಾರ್ಟಪ್ ಸ್ಥಾಪಕಿ',
            quote: 'ನನ್ನ ಪಟ್ಟಣದಲ್ಲಿ ಜಾಲವ್ಯಾಪ್ತಿ ಕಷ್ಟವಾಗಿತ್ತು. ಈಗ ನನ್ನ ವ್ಯವಹಾರಕ್ಕೆ ನಿಜವಾದ ಪಾಲುದಾರರು ಮತ್ತು ಪ್ರತಿಭೆ ಸಿಕ್ಕಿವೆ.'
          }
        ]
      },
      contact: {
        title: 'ಸಂಪರ್ಕಿಸಿ',
        email: 'ನಮಗೆ ಇಮೇಲ್ ಮಾಡಿ',
        call: 'ನಮಗೆ ಕರೆ ಮಾಡಿ',
        visit: 'ನಮ್ಮನ್ನು ಭೇಟಿಮಾಡಿ',
        emailValue: 'contact@locallink.com',
        callValue: '+91 98765 43210',
        visitValue: 'ಬಿಸಿನೆಸ್ ಡಿಸ್ಟ್ರಿಕ್ಟ್, ಟೆಕ್ ಸಿಟಿ',
        description: 'ನೀವು ನಿಮ್ಮ ಸ್ಥಳೀಯ ವ್ಯವಹಾರ ಜಾಲವನ್ನು ಪರಿವರ್ತಿಸಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಾ? ಇಂದು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ ಮತ್ತು LOCAL LINK ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ.'
      },
      cta: {
        title: 'ನೀವು ನಿಮ್ಮ ವೃತ್ತಿಪರ ಜಾಲವನ್ನು ವಿಸ್ತರಿಸಲು ಸಿದ್ಧವೇ?',
        description: 'ಸಾವಿರಾರು ಸ್ಥಳೀಯ ವ್ಯವಹಾರಗಳು ಮತ್ತು ವೃತ್ತಿಪರರೊಂದಿಗೆ ಸೇರಿ',
        join: 'ಜಾಲಕ್ಕೆ ಸೇರಿ'
      },
      footer: {
        title: 'LOCAL LINK',
        description: 'ವೃತ್ತಿಪರ ಜಾಲ • ವ್ಯವಹಾರ ಬೆಳವಣಿಗೆ • ಸ್ಥಳೀಯ ಸಂಪರ್ಕಗಳು',
        copyright: '© {{year}} LOCAL LINK. ವೃತ್ತಿಪರ ಸಮುದಾಯಗಳನ್ನು ಶಕ್ತಿಮಾಡುವುದು.'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 