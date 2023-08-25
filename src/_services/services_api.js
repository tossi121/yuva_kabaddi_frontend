import { fetcher } from '@/_helper/apiBase';

export async function getOtp(params) {
  try {
    const response = await fetcher('POST', process.env.OTP_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function getSignup(params) {
  try {
    const response = await fetcher('POST', process.env.SIGNUP_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
