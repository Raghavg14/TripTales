import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/httpHook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/Context/auth-context";
import { useNavigate } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";

export default function UserPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_API_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  const closeErrorModalHandler = () => {
    clearError();
    navigate("/");
  };

  return (
    <>
      {error && auth.userId !== userId && (
        <Modal
          onCancel={closeErrorModalHandler}
          header="Alert"
          show={!!error}
          footer={<Button onClick={closeErrorModalHandler}>Okay</Button>}
        >
          <p>User have not uploaded any places.</p>
        </Modal>
      )}
      {/* {error && <ErrorModal error={error} onClear={clearError} />} */}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList
          items={loadedPlaces}
          onDeletePlace={placeDeletedHandler}
          userId={userId}
        />
      )}
    </>
  );
}
