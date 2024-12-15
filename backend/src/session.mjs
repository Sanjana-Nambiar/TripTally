// SessionManager Class
class SessionManager {
    static startSession(req, user) {
      req.session.user = user;
    }
  
    static destroySession(req) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Failed to destroy session:', err);
        }
      });
    }
  
    static checkSession(req) {
      return req.session.user || null;
    }
  }
  
  export { SessionManager };