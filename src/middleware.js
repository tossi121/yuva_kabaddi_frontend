// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const path = request.nextUrl.pathname;
//   const tokenRole = request.cookies.get('yuva_kabaddi_role')?.value || '';
//   const token = request.cookies.get('yuva_kabaddi_token')?.value || '';

//   if (isPublicPath(path) && token) {
//     return NextResponse.redirect(new URL('/', request.nextUrl));
//   }

//   if (!isPublicPath(path) && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }
//   function isPublicPath(path) {
//     return path === '/login' || path === '/signup';
//   }

//   // if (tokenRole === 'COACH' || tokenRole === 'PLAYER') {
//   //   if (request.nextUrl.pathname.startsWith('/super-admin/dashboard')) {
//   //     return NextResponse.redirect(new URL('/', request.url));
//   //   }
//   // }

//   if (tokenRole === 'SUPER_ADMIN') {
//     return handleSuperAdminRequest(request);
//   } else if (tokenRole === 'COACH' || tokenRole === 'PLAYER') {
//     return NextResponse.next();
//   } else {
//     return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
//   }
//   function handleSuperAdminRequest(request) {
//     const path = request.nextUrl.pathname;

//     if (path.startsWith('/dashboard')) {
//       return NextResponse.redirect(new URL('/super-admin/dashboard', request.nextUrl));
//     }
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ['/super-admin/:path*', '/dashboard/:path*', '/login', '/signup'],
// };

// import { NextResponse } from 'next/server';

// export function middleware(request) {
//   const path = request.nextUrl.pathname;
//   const token = request.cookies.get('yuva_kabaddi_role')?.value || '';

//   console.log(token);

//   if (isPublicPath(path) && token) {
//     return NextResponse.redirect(new URL('/', request.nextUrl));
//   }

//   if (!isPublicPath(path) && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }

//   if (token === 'SUPER_ADMIN') {
//     // Handling for SUPER_ADMIN role
//     return handleSuperAdminRequest(request);
//   } else if (token === 'COACH' || token === 'PLAYER') {
//     // Handling for COACH and PLAYER roles
//     return handleCoachPlayerRequest(request);
//   } else {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }
// }

// function isPublicPath(path) {
//   return path === '/login' || path === '/signup';
// }

// function handleSuperAdminRequest(request) {
//   const path = request.nextUrl.pathname;

//   if (path.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }

//   // Add your logic for SUPER_ADMIN here
//   return NextResponse.next();
// }

// function handleCoachPlayerRequest(request) {
//   // Handling for COACH and PLAYER
//   // Add your logic for COACH and PLAYER here
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/super-admin/:path*', '/dashboard/:path*', '/login', '/signup'],
// };

import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const publicPath = path === '/login' || path === '/signup';
  const token = request.cookies.get('yuva_kabaddi_role')?.value || '';

  if (publicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!publicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (token === 'SUPER_ADMIN') {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (token === 'COACH' || token === 'PLAYER') {
    if (request.nextUrl.pathname.startsWith('/super-admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // if (token === 'COACH' || token === 'PLAYER') {
  //   if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //     return NextResponse.redirect(new URL('/', request.nextUrl));
  //   }
  // }

  // if (token === 'COACH' || token === 'PLAYER') {
  //   if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //     return NextResponse.redirect(new URL('/', request.nextUrl));
  //   }
  // }

  // if (!token === 'COACH' || !token === 'PLAYER') {
  //   if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //     return NextResponse.redirect(new URL('/', request.nextUrl));
  //   }
  // }

  // if (!token === 'SUPER_ADMIN') {
  //   if (request.nextUrl.pathname.startsWith('/super-admin/dashboard')) {
  //     return NextResponse.redirect(new URL('/', request.nextUrl));
  //   }
  // }
}

export const config = {
  matcher: ['/super-admin/:path*', '/dashboard/:path*', '/login', '/signup'],
};
