import {
  createBrowserRouter,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router';

import { Token } from './utils/token.ts';

import { NotFound } from './pages/NotFound/index.tsx';
import { Home } from './pages/Home/index.tsx';
import { BalanceSheet } from './pages/BalanceSheet/index.tsx';
import { Login } from './pages/Login/index.tsx';
import { Register } from './pages/Register/index.tsx';
import { EmailVerify } from './pages/EmailVerify/index.tsx';
import { PasswordReset } from './pages/PasswordReset/index.tsx';

export const router = createBrowserRouter(
  [
    // Public Routes
    {
      path: '/',
      Component: Home,
    },
    {
      path: '/login',
      Component: Login,
    },
    {
      path: '/register',
      Component: Register,
    },
    {
      path: '/users/email-verify',
      Component: EmailVerify,
    },
    {
      path: '/users/password-reset',
      Component: PasswordReset,
    },

    // Private Routes
    {
      path: '/',
      Component: PrivateRoutes,
      children: [
        {
          path: '/balance',
          Component: BalanceSheet,
        },
      ],
    },

    // Not Found Page
    {
      path: '*',
      Component: NotFound,
    },
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME,
  },
);

function PrivateRoutes() {
  const { pathname } = useLocation();
  if (!Token.get())
    return <Navigate to='/login' replace state={{ previusPath: pathname }} />;
  return <Outlet />;
}
