import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useRef, useState, type FormEvent } from 'react';
import { btnPrimary } from '../styles/ui';

function LoginPage() {
  const { t } = useTranslation();
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [hasError, setHasError] = useState(false);

  if (currentUser) {
    return (
      <div className="p-page">
        <p>{t('login.alreadyLoggedIn')}</p>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasError(false);

    const username = usernameRef.current?.value.trim() ?? '';
    const password = passwordRef.current?.value ?? '';
    const ok = login(username, password);

    if (!ok) {
      setHasError(true);
      return;
    }

    navigate('/add');
  }

  const inputClass =
    'block mb-4 py-3 px-4 w-full border border-success rounded-button bg-surface-raised text-foreground cursor-pointer';

  return (
    <div className="p-page max-w-92.5">
      <h1 className="m-0 text-3xl font-bold text-foreground">
        {t('login.title')}
      </h1>
      <p className="mt-1 text-muted">{t('login.instructions')}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email" className="block mt-4 mb-1 text-sm font-medium text-foreground">
          {t('login.email')}
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        </label>
        <input
          required
          className={inputClass}
          type="email"
          placeholder={t('login.emailPlaceholder')}
          id="login-email"
          ref={usernameRef}
          autoComplete="email"
        />
        <label htmlFor="login-password" className="block mt-4 mb-1 text-sm font-medium text-foreground">
          {t('login.password')}
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        </label>
        <input
          required
          className={inputClass}
          type="password"
          placeholder={t('login.passwordPlaceholder')}
          id="login-password"
          ref={passwordRef}
          autoComplete="current-password"
        />
        {hasError ? (
          <p id="login-error" className="mt-3 text-sm text-danger" role="alert">
            {t('login.invalidCredentials')}
          </p>
        ) : null}
        <button type="submit" className={`${btnPrimary} block w-full mt-4`}>
          {t('login.submit')}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
