import { withAuth } from 'next-auth/middleware';

// export default withAuth({
//   pages: {
//     signIn: '/login',
//   },
// });

export default function middleware() {
  return;
}

export const config = {
  matcher: ['/dashboard-disabled/:path*'],
};
