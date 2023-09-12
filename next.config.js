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
    CHECK_MOBILE_NUMBER_DATA: 'checkmobileno',
    CHECK_EXISTING_USERS_DATA: 'checkexistingusers',
    ROLE_DATA: 'admin/role',
    SERIES_DATA: 'series',
    MATCH_DATA: 'series/matchdetails',
    MATCH_PLAYERS_DATA: 'match/players',
    PRICE_MONEY_DATA: 'pricedetail',
    PRICE_MONEY_ALL_DATA: 'pricedetailtotal',
    WITHDRAWN_REQUESTS_OF_USER_DATA: 'getplayerwithdrawnrequestslistforuser',
    CURRENT_USER_DATA: 'getcurrentuserdetails',
    CITY_BY_STATE_DATA: 'citiesbystate',
    STATE_LIST_DATA: 'states',
    UPDATE_USER_DETAILS_DATA: 'updateuserdetails',
    // super admin
    ADMIN_PRICE_MONEY_DATA: 'admin/pricedetailalltotal',
    ADMIN_WITHDRAWN_REQUESTS_OF_USER_DATA: 'admin/getplayerwithdrawnrequestslist',
  },
};

module.exports = nextConfig;
