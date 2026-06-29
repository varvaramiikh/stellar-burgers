import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { forgotPasswordApi } from '@api';

export const ForgotPassword: FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((error) => {
        setErrorText(error.message || 'Ошибка восстановления пароля');
      });
  };

  return (
    <ForgotPasswordUI
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      errorText={errorText}
    />
  );
};
