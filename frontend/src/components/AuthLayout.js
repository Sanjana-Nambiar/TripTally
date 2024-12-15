const AuthLayout = ({ children, imageSrc }) => {
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
    },
    imageContainer: {
      flex: 1.5, // Slightly larger for the image
      position: 'relative',
      backgroundImage: `url(${imageSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to right, rgba(0, 0, 0, 0.5), #121212)',
    },
    formContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212',
      padding: '2rem',
    },
    formCard: {
      width: '100%',
      maxWidth: '400px',
      padding: '2rem',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <div style={styles.gradientOverlay} />
      </div>
      <div style={styles.formContainer}>
        <div style={styles.formCard}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
