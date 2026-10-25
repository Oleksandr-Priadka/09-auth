'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession } from '@/lib/clientApi';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    checkSession()
      .then((user) => {
        if (user) {
          setUser(user);
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