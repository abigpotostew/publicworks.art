/*
 * General utils for managing cookies in Typescript.
 */

import { deleteCookie, getCookie } from "src/util/cookie";

export function getToken() {
  return getCookie("PWToken");
}

export function deleteToken() {
  deleteCookie("PWToken");
}
