import { useState, useEffect, useCallback } from "react";

let autoLogoutTimerId;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationTime, setTokenExpirationTime] = useState();

  const logInHandler = useCallback((userId, token, oldExpirationTime) => {
    setToken(token);
    setUserId(userId);
    const tokenExpirationTime =
      oldExpirationTime || new Date(Date.now() + 1000 * 60 * 60); // to get 1 hour ahead time from login time
    setTokenExpirationTime(tokenExpirationTime);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId,
        token,
        expiration: tokenExpirationTime.toISOString(),
      })
    );
  }, []);
  const logOutHandler = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationTime(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
      autoLogoutTimerId = setTimeout(logOutHandler, remainingTime);
    } else {
      clearTimeout(autoLogoutTimerId);
    }
  }, [logOutHandler, token, tokenExpirationTime]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      logInHandler(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [logInHandler]);

  return { token, userId, logInHandler, logOutHandler };
};
