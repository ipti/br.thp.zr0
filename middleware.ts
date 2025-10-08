import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // adiciona o path atual no header
  response.headers.set("x-path", request.nextUrl.pathname);

  return response;
}

// define em quais rotas aplicar
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], 
};
