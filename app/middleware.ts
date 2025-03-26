// middleware.ts (côté serveur)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérification de la présence du cookie "access_token"
  const token = request.cookies.get('access_token');
  
  // Si l'utilisateur n'a pas de token, redirige vers la page de connexion
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si l'utilisateur a un token, la requête continue normalement
  return NextResponse.next();
}

// Configuration du middleware pour toutes les routes protégées
export const config = {
  matcher: ['/profile', '/dashboard'], // Routes protégées
};
