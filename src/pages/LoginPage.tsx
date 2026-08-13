import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRef, useState, type FormEvent } from 'react';
import { btnPrimary } from '../styles/ui';

function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  if (currentUser) {
    return (
      <div className="p-page">
        <p>You are already logged in.</p>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

  const inputClass =
    'block mb-4 py-3 px-4 w-full border border-success rounded-button bg-surface-raised text-foreground cursor-pointer';

  return (
    <div className="p-page max-w-92.5">
      <h1 className="m-0 text-3xl font-bold text-foreground">Login</h1>
      <p className="mt-1 text-muted">
        Fake login for Stage 3 — use an email and password from local storage (e.g.
        arjunsharma@demo.com / 123).
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email" className="block mt-4 mb-1 text-sm font-medium text-foreground">
          Email
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        </label>
        <input
          required
          className={inputClass}
          type="email"
          placeholder="Enter your email"
          id="login-email"
          ref={usernameRef}
          autoComplete="email"
        />
        <label htmlFor="login-password" className="block mt-4 mb-1 text-sm font-medium text-foreground">
          Password
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        </label>
        <input
          required
          className={inputClass}
          type="password"
          placeholder="Enter your password"
          id="login-password"
          ref={passwordRef}
          autoComplete="current-password"
        />
        {error ? (
          <p id="login-error" className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={`${btnPrimary} block w-full mt-4`}>
          Log in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
