import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRef, useState, type FormEvent } from 'react';

function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  if (currentUser) {
    return (
      <div className="page">
        <p>You are already logged in.</p>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Stop the browser from reloading the page (default form submit).
    // A reload remounts React and wipes in-memory login state.
    event.preventDefault();
    setError('');

    const username = usernameRef.current?.value.trim() ?? '';
    const password = passwordRef.current?.value ?? '';
    const ok = login(username, password);

    if (!ok) {
      setError('Invalid email or password');
      return;
    }

    navigate('/add');
  }

  return (
    <div className="page login-page">
      <h1 className="page-title">Login</h1>
      <p className="page-subtitle">
        Fake login for Stage 3 — use an email and password from local storage (e.g.
        arjunsharma@demo.com / 123).
      </p>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          required
          className="form-input"
          type="email"
          placeholder="Enter your email"
          ref={usernameRef}
        />
        <input
          required
          className="form-input"
          type="password"
          placeholder="Enter your password"
          ref={passwordRef}
        />
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button type="submit" className="btn btn-primary login-btn">
          Log in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
