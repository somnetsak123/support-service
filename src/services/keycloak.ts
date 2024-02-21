import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://id.frappet.synology.me',
  realm: 'bma-ehr',
  clientId: 'bma-ehr',
});

let init = false;

export async function login(cb?: (...args: unknown[]) => void) {
  const auth = !init
    ? await keycloak
        .init({
          onLoad: 'login-required',
          responseMode: 'query',
          checkLoginIframe: false,
        })
        .catch((e) => console.dir(e))
    : await keycloak.login().catch((e) => console.dir(e));

  if (auth) init = true;
  if (auth && cb) cb();
}

export async function logout() {
  await keycloak.logout();
}

export async function getToken() {
  await keycloak.updateToken(60).catch(() => login());
  return keycloak.token;
}

export function getUsername(): string {
  return keycloak.tokenParsed?.preferred_username;
}

export function getName(): string {
  return keycloak.tokenParsed?.name;
}

export function getEmail(): string {
  return keycloak.tokenParsed?.email;
}

export function getRole(): string[] {
  const decoded = keycloak.tokenParsed;

  if (decoded && decoded.resource_access && decoded.azp) {
    return decoded.resource_access[decoded.azp].roles;
  }

  return [];
}

export function isLoggedIn() {
  return !!keycloak.token;
}
