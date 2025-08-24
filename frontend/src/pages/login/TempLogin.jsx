import Login from './Login.jsx';
import Register from './Register.jsx';

function TempLogin() {
  return (
    <div className="login-page">
      <div className="login-left">
        <h1>Welcome to MovieRankrr 🎬</h1>
        <p>Discover and rank your favorite movies.</p>
        <img
          src="/illustration.svg" // Replace with your image path
          alt="login visual"
          className="login-illustration"
        />
      </div>
      <div className="login-right">
        <Login />
        <Register />
      </div>
    </div>
  );
}

export default TempLogin;