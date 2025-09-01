import Login from './Login.jsx';
import Register from './Register.jsx';
import { useState } from 'react';

function TempLogin() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      {/* Branding / Intro */}
      <div className="auth-header">
        <h1><span className="brand-title">MovieRankrr</span></h1>
        <p className="tagline">Find your next fave with the help of custom AI recommendations made just for you.</p>
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Join Today'}</h2>
        {isLogin ? <Login /> : <Register />}
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </div>

      {/* Footer */}
      <p className="auth-footer">
      </p>
    </div>
  );
}

export default TempLogin;
