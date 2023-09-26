import { fetcher, filesFetch } from '@/_helper/apiBase';

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
    const response = await fetcher('GET', process.env.CURRENT_USER_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function playerTransactionCreated(params) {
  try {
    const response = await fetcher('POST', process.env.PLAYER_TRANSACTION_CREATED_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updateUserDetails(params) {
  try {
    const response = await filesFetch('POST', process.env.UPDATE_USER_DETAILS_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function stateListData(params) {
  try {
    const response = await fetcher('GET', process.env.STATE_LIST_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function cityListData(id) {
  try {
    const url = `${process.env.CITY_BY_STATE_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

// super admin
export async function getSpent(params) {
  try {
    const response = await fetcher('GET', process.env.ADMIN_PRICE_MONEY_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function getWithdrawnRequestsList(params) {
  try {
    const response = await fetcher('GET', process.env.ADMIN_WITHDRAWN_REQUESTS_OF_USER_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function getUsersList(params) {
  try {
    const response = await fetcher('GET', process.env.ADMIN_ALL_USER_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function deleteUser(params) {
  try {
    const response = await fetcher('POST', process.env.ADMIN_USER_DELETE_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function updateUser(params) {
  try {
    const response = await fetcher('POST', process.env.ADMIN_UPDATE_USER_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function getCurrentUsers(id) {
  try {
    const url = `${process.env.ADMIN_CURRENT_USER_DATA}/${id}`;
    const response = await fetcher('GET', url);
    return response;
  } catch (err) {
    return null;
  }
}

export async function verifyUser(params) {
  try {
    const response = await fetcher('POST', process.env.ADMIN_VERIFY_USER_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function verifyAccount(params) {
  try {
    const response = await fetcher('POST', process.env.ADMIN_VERIFY_ACCOUNT_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}
export async function getTdsData(params) {
  try {
    const response = await fetcher('GET', process.env.ADMIN_GET_TDS_CONFIG_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function tdsDataUpdate(params) {
  try {
    const response = await fetcher('POST', process.env.ADMIN_TDS_CONFIG_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function playerWithdrawRequestsList(params) {
  try {
    const response = await fetcher('GET', process.env.ADMIN_PLAYER_WITHDRAW_REQUESTS_LIST_DATA, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function updatePlayerTransactionStatus(params) {
  try {
    const response = await fetcher('POST', process.env.ADMIN_UPDATE_PLAYER_TRANSACTION_STATUS, params);
    return response;
  } catch (err) {
    return null;
  }
}

export async function addUser(params) {
  try {
    const response = await fetcher('POST', process.env.ADMIN_ADD_USER, params);
    return response;
  } catch (err) {
    return null;
  }
}
