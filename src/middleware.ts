import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Configuration des routes publiques qui ne nécessitent pas d'authentification
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
  "/register-alt"
];

// Routes d'authentification (login/register) - redirection vers dashboard si déjà connecté
const authRoutes = ["/login", "/register", "/register-alt"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ne jamais intercepter les routes statiques, images ou API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }
  
  // Récupérer le token d'authentification
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;
  
  // Si l'utilisateur est connecté et accède à la racine, le rediriger vers le dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Vérifier si la route nécessite une authentification
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Logique de redirection
  if (isAuthenticated) {
    // Si l'utilisateur est connecté et tente d'accéder aux pages de login/register,
    // le rediriger vers le dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée,
    // le rediriger vers la page de login
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  return NextResponse.next();
}

// Configuration du matcher pour les routes à traiter
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * 1. /api (routes API)
     * 2. /_next (routes Next.js)
     * 3. /_vercel (routes système Vercel)
     * 4. /favicon.ico, /robots.txt, etc.
     */
    '/((?!api|_next|_vercel|favicon.ico|robots.txt).*)',
  ],
};