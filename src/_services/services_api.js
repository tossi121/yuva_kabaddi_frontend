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
export async function getRole(params) {
  try {
    const response = await fetcher('GET', process.env.ROLE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getSeries(params) {
  try {
    const response = await fetcher('GET', process.env.SERIES_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getMatchDetails(id) {
  try {
    const url = `${process.env.MATCH_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getMatchPlayers(id) {
  try {
    const url = `${process.env.MATCH_PLAYERS}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}
