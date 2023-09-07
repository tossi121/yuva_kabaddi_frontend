import { fetcher } from '@/_helper/apiBase';

export async function getOtp(params) {
  try {
    const response = await fetcher('POST', process.env.OTP_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function checkMobileNumber(params) {
  try {
    const response = await fetcher('POST', process.env.CHECK_MOBILE_NUMBER_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function checkUser(params) {
  try {
    const response = await fetcher('POST', process.env.CHECK_EXISTING_USERS_DATA, params);
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

export async function getLogin(params) {
  try {
    const response = await fetcher('POST', process.env.LOGIN_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function updateUserDetails(params) {
  try {
    const response = await fetcher('POST', process.env.UPDATE_USER_DETAILS, params);
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
    const url = `${process.env.MATCH_PLAYERS_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getPriceMoney(params) {
  try {
    const response = await fetcher('GET', process.env.PRICE_MONEY_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getEarnings(params) {
  try {
    const response = await fetcher('GET', process.env.PRICE_MONEY_ALL_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getWithdrawnRequests(params) {
  try {
    const response = await fetcher('GET', process.env.WITHDRAWN_REQUESTS_OF_USER_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function getCurrentUserDetails(params) {
  try {
    const response = await fetcher('GET', process.env.CURRENT_USER, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function stateListData(params) {
  try {
    const response = await fetcher('GET', process.env.STATE_LIST, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function cityListData(id)
 {
  try {
    const url = `${process.env.CITY_BY_STATE}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}
