// src/pages/index.tsx
// Ce fichier sert uniquement à rediriger vers la route /dashboard

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null; // Ne rend rien, car la redirection se fait instantanément
}