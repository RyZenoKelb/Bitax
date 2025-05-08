// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Configuration des routes
const publicRoutes = [
  "/", 
  "/login", 
  "/register", 
  "/api/auth", 
  "/guide", 
  "/pricing", 
  "/tarifs", 
  "/fonctionnalites", 
  "/support",
  "/contact",
  "/faq",
  "/cgu",
  "/mentions-legales",
  "/politique-confidentialite"
];

const authRoutes = ["/login", "/register"];

// Routes qui nécessitent un abonnement premium
const premiumRoutes = [
  "/dashboard/premium",
  "/dashboard/rapports/avance",
  "/dashboard/export",
  "/api/premium",
];

// Routes d'API publiques (en plus de /api/auth qui est déjà dans publicRoutes)
const publicApiRoutes = [
  "/api/register"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorer les fichiers statiques et certaines routes API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.includes(".") ||
    publicApiRoutes.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }
  
  // Ignorer toutes les routes API sauf celles qui nécessitent une authentification
  if (pathname.startsWith("/api/") && 
      !pathname.startsWith("/api/user") && 
      !pathname.startsWith("/api/wallet") && 
      !pathname.startsWith("/api/transaction") && 
      !pathname.startsWith("/api/report") && 
      !pathname.startsWith("/api/premium")) {
    return NextResponse.next();
  }
  
  // Récupérer le token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;
  
  // Vérifier si l'utilisateur a un abonnement premium
  const isPremium = token?.isPremium === true;
  
  // Redirection pour les utilisateurs authentifiés accédant à la racine
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Vérifier si la route est une route d'authentification
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Vérifier si la route nécessite un abonnement premium
  const isPremiumRoute = premiumRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Logique de redirection
  if (isAuthenticated) {
    // Si l'utilisateur est connecté et essaie d'accéder à une page login/register
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Si l'utilisateur essaie d'accéder à une fonctionnalité premium sans abonnement
    if (isPremiumRoute && !isPremium) {
      return NextResponse.redirect(new URL("/pricing", request.url));
    }
  } else {
    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!isPublicRoute) {
      // Sauvegarder l'URL de destination pour rediriger après la connexion
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url));
    }
  }
  
  return NextResponse.next();
}

// Configuration du matcher pour le middleware
export const config = {
  matcher: [
    // Inclure toutes les routes sauf certaines exceptions
    '/((?!_next/static|_next/image|favicon.ico|.*\\.ico$|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$).*)',
  ],
};