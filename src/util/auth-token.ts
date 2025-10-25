/*
 * General utils for managing cookies in Typescript.
 */

import { deleteCookie, getCookie } from "src/util/cookie";

export function getToken() {
  return typeof document !== "undefined" && getCookie("PWToken");
}

export function deleteToken() {
  deleteCookie("PWToken");
}
