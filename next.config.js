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
    BASE_API_URL: 'http://localhost:3001/',
    SIGNUP_DATA: 'signup',
    LOGIN_DATA: 'login',
    OTP_DATA: 'sendotpbysms',
  },
};

module.exports = nextConfig;
