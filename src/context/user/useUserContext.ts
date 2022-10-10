import { useContext } from "react";
import UserContext from "src/context/user/UserContext";

export default function useUserContext() {
  const value = useContext(UserContext);
  return value;
}
