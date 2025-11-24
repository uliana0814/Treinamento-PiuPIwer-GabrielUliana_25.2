import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./auth";
import type { Role } from "./generated/prisma";

// --- CONFIGURAÇÃO DAS ROTAS (MANTIDA) ---
const ROUTE_CONFIG = {
  authRequired: [
    "/aprender",
    "/dashboard",
    "/perfil",
    "/settings",
  ],
  adminRequired: [
    "/admin/**",
  ],
  redirectIfAuth: [
    "/login",
    "/cadastro",
  ],
  specialRoutes: [
    "/admin",
  ]
};

// --- HELPERS (MANTIDOS) ---
function matchesAnyPattern(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('**')) {
      const basePattern = pattern.slice(0, -2);
      return pathname.startsWith(basePattern);
    }
    return pathname === pattern || pathname.startsWith(pattern + '/');
  });
}

function hasRequiredRole(userRole: Role | undefined, requiredRoles: Role[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ==================================================================
  // 1. LÓGICA DE CORS (NOVA - Para o Mobile funcionar)
  // ==================================================================
  
  // Define os headers de CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    "Access-Control-Allow-Credentials": "true",
  };

  // Se for uma rota de API (usada pelo mobile), tratamos o CORS primeiro
  if (pathname.startsWith("/api")) {
    // Trata requisição de Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return NextResponse.json({}, { headers: corsHeaders });
    }

    // Para requisições normais da API, deixamos passar e adicionamos os headers
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // ==================================================================
  // 2. LÓGICA DE PROTEÇÃO DE PÁGINAS (SUA LÓGICA EXISTENTE)
  // Só roda se NÃO for rota de API (para não quebrar o app com redirects HTML)
  // ==================================================================

  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const userRole = session?.role as Role | undefined;
  const isAuthenticated = !!session?.user;

  // Handle /admin special route
  if (pathname === "/admin") {
    if (!isAuthenticated) {
      return NextResponse.next();
    }
    
    if (hasRequiredRole(userRole, ["ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (matchesAnyPattern(pathname, ROUTE_CONFIG.redirectIfAuth)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/aprender", request.url));
    }
    return NextResponse.next();
  }

  if (matchesAnyPattern(pathname, ROUTE_CONFIG.adminRequired)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    if (!hasRequiredRole(userRole, ["ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    return NextResponse.next();
  }

  if (matchesAnyPattern(pathname, ROUTE_CONFIG.authRequired)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};