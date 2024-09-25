import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/formHooks";
import { useHttpClient } from "../../shared/hooks/httpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/Context/auth-context";
import Modal from "../../shared/components/UIElements/Modal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./PlaceForm.css";

export default function NewPlace() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value),
      formData.append("description", formState.inputs.description.value),
      formData.append("address", formState.inputs.address.value),
      formData.append("image", formState.inputs.image.value);
    event.preventDefault();
    try {
      await sendRequest(
        import.meta.env.VITE_API_BACKEND_URL + "/places",
        "POST",
        formData,
        {
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
    navigate("/");
  };

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Title"
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (atleast 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="*Image Required"
        />
        <Button type="Submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
      <Modal
        onCancel={closeSuccessModalHandler}
        header="Alert"
        show={showSuccessModal}
        footer={<Button onClick={closeSuccessModalHandler}>Okay</Button>}
      >
        <p>Place created Successfully.</p>
      </Modal>
      ;
    </>
  );
}
