import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/httpHook";

export default function Users() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_API_BACKEND_URL + "/users"
        );
        setUsersList(responseData.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [sendRequest]);

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <UsersList items={usersList} />
    </>
  );
}
