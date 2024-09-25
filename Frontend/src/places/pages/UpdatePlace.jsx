import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/formHooks";
import { useHttpClient } from "../../shared/hooks/httpHook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/Context/auth-context";

import "./PlaceForm.css";

export default function UpdatePlace() {
  const placeId = useParams().placeId;
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_API_BACKEND_URL}/places/${placeId}`
        );
        if (responseData.place) {
          setFormData(
            {
              title: {
                value: responseData.place.title,
                isValid: true,
              },
              description: {
                value: responseData.place.description,
                isValid: true,
              },
            },
            true
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlace();
  }, [placeId, sendRequest, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${import.meta.env.VITE_API_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const closeSuccessModalHandler = () => {
    setShowSuccessModal(false);
    navigate(`/${auth.userId}/places`);
  };

  const RenderForm = () => (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid Title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="input"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (atleast 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="Submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && RenderForm()}
      <Modal
        onCancel={closeSuccessModalHandler}
        header="Alert"
        show={showSuccessModal}
        footer={<Button onClick={closeSuccessModalHandler}>Okay</Button>}
      >
        <p>Place updated Successfully.</p>
      </Modal>
    </>
  );
}
