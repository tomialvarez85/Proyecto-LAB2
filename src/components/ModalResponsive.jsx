import React, { useState, useEffect } from 'react';

const ModalResponsive = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true 
}) => {
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const getModalConfig = () => {
    const baseConfig = {
      mobile: {
        width: '95%',
        maxWidth: '95%',
        height: '90vh',
        maxHeight: '90vh',
        padding: '20px',
        borderRadius: '15px',
        fontSize: '0.9rem',
        titleSize: '1.2rem',
        closeButtonSize: '24px'
      },
      tablet: {
        width: '80%',
        maxWidth: '600px',
        height: '80vh',
        maxHeight: '80vh',
        padding: '25px',
        borderRadius: '20px',
        fontSize: '1rem',
        titleSize: '1.4rem',
        closeButtonSize: '28px'
      },
      desktop: {
        width: size === 'small' ? '400px' : size === 'large' ? '800px' : '600px',
        maxWidth: size === 'small' ? '400px' : size === 'large' ? '800px' : '600px',
        height: 'auto',
        maxHeight: '90vh',
        padding: '30px',
        borderRadius: '25px',
        fontSize: '1.1rem',
        titleSize: '1.6rem',
        closeButtonSize: '32px'
      }
    };

    return baseConfig[screenSize];
  };

  const config = getModalConfig();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: screenSize === 'mobile' ? '10px' : '20px',
      boxSizing: 'border-box'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: config.borderRadius,
        padding: config.padding,
        width: config.width,
        maxWidth: config.maxWidth,
        height: config.height,
        maxHeight: config.maxHeight,
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #e9ecef'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: config.titleSize,
            fontWeight: 'bold',
            color: '#333',
            flex: 1
          }}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: config.closeButtonSize,
                cursor: 'pointer',
                color: '#666',
                padding: '5px',
                borderRadius: '50%',
                width: config.closeButtonSize,
                height: config.closeButtonSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.color = '#333';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#666';
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          fontSize: config.fontSize,
          lineHeight: '1.6'
        }}>
          {children}
        </div>
      </div>

      {/* CSS para animaciones */}
      <style jsx global>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ModalResponsive;
