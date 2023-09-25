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
    SERIES_DATA: 'tournaments',
    MATCH_DATA: 'teams',
    PLAYER_TRANSACTION_CREATED_DATA: 'createplayertransaction',
    MATCH_PLAYERS_DATA: 'players',
    PRICE_MONEY_DATA: 'pricedetail',
    WITHDRAWN_REQUESTS_OF_USER_DATA: 'getplayerwithdrawnrequestslistforuser',
    CURRENT_USER_DATA: 'getcurrentuserdetails',
    CITY_BY_STATE_DATA: 'citiesbystate',
    STATE_LIST_DATA: 'states',
    UPDATE_USER_DETAILS_DATA: 'updateuserdetails',
    // super admin
    ADMIN_PRICE_MONEY_DATA: 'admin/pricedetailalltotal',
    ADMIN_WITHDRAWN_REQUESTS_OF_USER_DATA: 'admin/getplayerwithdrawnrequestslist',
    ADMIN_ALL_USER_DATA: 'admin/getallusers',
    ADMIN_USER_DELETE_DATA: 'admin/deleteUser',
    ADMIN_CURRENT_USER_DATA: 'admin/getcurrentuserdetailsbyid',
    ADMIN_UPDATE_USER_DATA: 'admin/updateuserdetailsadmin',
    ADMIN_VERIFY_ACCOUNT_DATA:'admin/verifyaccount',
    ADMIN_VERIFY_USER_DATA: 'admin/verifyuser',
    ADMIN_TDS_CONFIG_DATA: 'admin/tdsconfig',
    ADMIN_GET_TDS_CONFIG_DATA: 'admin/gettdsconfig',
    ADMIN_PLAYER_WITHDRAW_REQUESTS_LIST_DATA: 'admin/getplayerwithdrawnrequestslist',
    ADMIN_UPDATE_PLAYER_TRANSACTION_STATUS: 'admin/updateplayertransactionstatus',
  },
};

module.exports = nextConfig;
