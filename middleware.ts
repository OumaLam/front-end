import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    return decoded;
  } catch (err) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const fonction = request.cookies.get("fonction")?.value?.toLowerCase();
  const deviceId = request.cookies.get("deviceId")?.value;
  const pathname = request.nextUrl.pathname;

  console.log("Token in middleware:", token);
  console.log("Fonction in middleware:", fonction);
  console.log("DeviceId in middleware:", deviceId);
  console.log("Pathname:", pathname);

  // ✅ Vérifier si le token est expiré
  if (token) {
    const decoded = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000); // en secondes
    if (!decoded || decoded.exp < currentTime) {
      console.log("Token expiré");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("fonction");
      response.cookies.delete("deviceId");
      return response;
    }
  }

  // Cas 1 : Rediriger vers /login si infos manquantes (sauf si déjà sur /login)
  if ((!token || !fonction || !deviceId) && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Cas 2 : Rediriger vers dashboard si déjà connecté et essaie d'accéder à /login
  if (pathname === "/login" && token && fonction && deviceId) {
    return NextResponse.redirect(new URL(`/dashboard-${fonction}`, request.url));
  }

  // Cas 3 : Si l'utilisateur essaie d'accéder à un dashboard qui ne correspond pas à son rôle
  if (pathname.startsWith("/dashboard")) {
    const expectedPrefix = `/dashboard-${fonction}`;
    if (!pathname.startsWith(expectedPrefix)) {
      return NextResponse.redirect(new URL(expectedPrefix, request.url));
    }
  }

  // Cas 4 : Accès autorisé
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard-admin/:path*", "/login"],
};
