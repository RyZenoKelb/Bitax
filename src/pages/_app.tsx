// Vérifier si nous sommes sur une page avec un layout personnalisé
const isDashboardLayout = router.pathname === '/dashboard' || 
                         router.pathname.startsWith('/dashboard/') ||
                         router.pathname === '/wallet' ||
                         router.pathname === '/transactions' || 
                         router.pathname === '/reports';

// Si la page a un layout personnalisé, on ne rend que le contenu de la page, sans le layout standard
if (isDashboardLayout) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}