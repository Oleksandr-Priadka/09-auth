'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    checkSession()
      .then(async (isValid) => {
        if (isValid) {
          try {
            const userData = await getMe();
            setUser(userData);
          } catch {
            clearIsAuthenticated();
          }
        } else {
          clearIsAuthenticated();
        }
      })
      .catch(() => {
        clearIsAuthenticated();
      });
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}