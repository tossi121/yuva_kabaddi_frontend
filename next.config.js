/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    BASE_API_URL: 'http://localhost:7011/',
    // BASE_API_URL: 'http://hello-my-yoga.digitaltyari.com/',
    SIGNUP_DATA: 'signup',
    LOGIN_DATA: 'login',
    OTP_DATA: 'sendotpbysms',
    ROLE_DATA: 'admin/role',
    SERIES_DATA: 'series',
    MATCH_DATA: 'series/matchdetails',
    MATCH_PLAYERS: 'match/players',
  },
};

module.exports = nextConfig;
