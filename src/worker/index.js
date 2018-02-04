import Constants from '../constants';

export async function login (email, password) {
  const response = await fetch(`${Constants.AUTH_URL}/local/login`, {
    method: 'POST',
    body: JSON.stringify({
      email, password
    })
  });

  const data = await response.json();

  // bad typing
  if (response.status === 400) {
    return data.error;
  }

  // user does not exist
  if (response.status === 204) {
    return `Cet utilisateur n'existe pas.`;
  }

  // server error
  if (response.status === 500) {
    return data.error
  }

  // user logged, token received
  // should save it into idb since localStore
  // is unavailable in web workers
  // unless I do not use stockroom for that
  return data.token;
}

export async function getResetToken (email) {
  const response = await fetch(`${Constants.AUTH_URL}/local/get-reset-token`, {
    method: 'POST',
    body: JSON.stringify({
      email
    })
  });

  // email does not exist
  if (response.status === 204) {
    return `Cet e-mail n'existe pas.`;
  }

  // reset account failed
  if (response.status === 500) {
    return 'Erreur lors de la demande de changement de mot de passe.';
  }

  // email sent, check it to change your password
  // NOTE: should change from success to message in api response
  const data = await response.json();
  return data.message;
}

export async function register (email, password) {
  const response = await fetch(`${Constants.AUTH_URL}/local/register`, {
    method: 'POST',
    body: JSON.stringify({
      email, password
    })
  });

  const data = await response.json();

  // bad typing, password not strong enough or email already used
  if (response.status === 400) {
    return data.error;
  }

  // server error
  if (response.status === 500) {
    return 'Erreur lors de la création du compte.';
  }

  // user created, mail sent
  return data.message;
}

export async function changePassword (password, token) {
  const response = await fetch(`${Constants.AUTH_URL}/local/reset-password?token=${token}`, {
    method: 'POST',
    body: JSON.stringify({
      password
    })
  });

  // server error
  if (response.status === 500) {
    return 'Erreur lors du changement de mot de passe.';
  }

  const data = await response.json();

  // token invalid or expired
  if (response.status === 400) {
    return data.error;
  }

  // password changed
  return data.message;
}
