// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Configuration des routes publiques
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
  "/register-alt",
  "/api-test",
  "/register-debug"
];

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // MODIFICATION CRUCIALE: Ne jamais intercepter les routes API (commençant par /api)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/api/") ||  // Ajouter cette ligne pour exclure toutes les API
    pathname.includes("api-test")
  ) {
    return NextResponse.next();
  }
  
  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Check if the user is authenticated
  const isAuthenticated = !!token;
  
  // Nouvelle redirection: Si l'utilisateur est connecté et accède à la racine, le rediriger vers le dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // Check if the route needs authentication
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Redirect logic
  if (isAuthenticated) {
    // If user is logged in and trying to access login/register page,
    // redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // If user is not logged in and trying to access a protected route,
    // redirect to login page
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclut toutes les routes commençant par /api/
    "/((?!api/).*)(.+)",
  ],
};