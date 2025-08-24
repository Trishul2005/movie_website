import React from "react";
import "../../cssFiles/SignupPage.css";

function LoginPage() {
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
        <h2>Login</h2>
        <form className="login-form">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <button type="submit">Login</button>
          <p className="register-link">Don't have an account? <a href="/register">Sign up</a></p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
