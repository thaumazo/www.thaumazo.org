import { multiPipeline } from '@kenstack/lib/api';
import { NextRequest } from 'next/server';
import { loginPipeline } from '@kenstack/auth/handlers/login';
import { logoutPipeline } from '@kenstack/auth/handlers/logout';
import { resetPasswordPipeline } from '@kenstack/auth/handlers/resetPassword';
import { forgottenPasswordPipeline } from '@kenstack/auth/handlers/forgottenPassword';

// import Email, { attachments } from '@kenstack/auth/email/ForgotPassword';

export const POST = (request: NextRequest) =>
  multiPipeline({ request }, [
    ['login', loginPipeline()],
    ['logout', logoutPipeline()],
    [
      'forgot-password',
      forgottenPasswordPipeline({
        // Email: Email,
        // attachments,
        from: 'Thaumazo Unmonitored <unmonitored@thaumazo.org>',
      }),
    ],
    ['reset-password', resetPasswordPipeline()],
  ]);
