export function getCookie(cookieName: string) {
  let name = cookieName + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  console.log(decodedCookie, document.cookie)
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
    console.log('c', c);
  }
  return '';
}

export function setCookie(cookieName: string, cookieValue: string) {
  document.cookie = `${cookieName}=${cookieValue};`;
}