const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const NAME_REGEX = /^[a-zA-Z ]+$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const MOBILE_REGEX = /^\d{10}$/;
const WITHDRAWAL_AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
const BANK_IFSC_REGEX = /^\d+(\.\d{1,2})?$/;
const BANK_ACCOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

export function maxLengthCheck(object) {
  if (object.target.value.length > object.target.maxLength) {
    object.target.value = object.target.value.slice(0, object.target.maxLength);
  }
}

export function validName(name) {
  return NAME_REGEX.test(name);
}

export function validEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

export function validPAN(pan) {
  return PAN_REGEX.test(pan);
}

export function validMobile(mobile) {
  return MOBILE_REGEX.test(mobile);
}
export function validWithdrawalAmount(amount) {
  return WITHDRAWAL_AMOUNT_REGEX.test(amount);
}

export function validBankIFSC(ifsc) {
  return BANK_IFSC_REGEX.test(ifsc);
}

export function validAccountNumber(accountNumber) {
  return BANK_ACCOUNT_REGEX.test(accountNumber);
}
