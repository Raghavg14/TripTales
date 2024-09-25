import { useCallback, useState } from "react";

export function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { method, body, headers });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || "Request failed!");
        }

        return responseData;
      } catch (error) {
        setError(error.message || "Something went wrong, please try again.");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError };
}
