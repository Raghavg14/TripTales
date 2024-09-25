import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/formHooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/Context/auth-context";
import { useHttpClient } from "../../shared/hooks/httpHook";

import "./Auth.css";

export default function Auth() {
  const Navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [inLoginMode, setInLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!inLoginMode) {
      //Switching Back to Login Mode
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      //Switching Back to Signup Mode
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setInLoginMode((prevState) => !prevState);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (inLoginMode) {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_API_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
        Navigate("/");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value),
          formData.append("email", formState.inputs.email.value),
          formData.append("password", formState.inputs.password.value),
          formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          import.meta.env.VITE_API_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.userId, responseData.token);
        Navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>
          {inLoginMode
            ? "Enter Credentials to Login"
            : "Enter Credentials to Signup"}
        </h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!inLoginMode && (
            <Input
              id="name"
              element="input"
              label="Name"
              type="text"
              placeholder="RajKumar Rao"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid Name."
              onInput={inputHandler}
            />
          )}
          {!inLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="*Image Required"
            />
          )}
          <Input
            id="email"
            element="input"
            label="Email"
            type="email"
            placeholder="Raj@gmail.com"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid Email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            label="Passowrd"
            type="password"
            placeholder="123456"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid Password (atleast 6 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {inLoginMode ? "Login" : "Signup"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Click to {inLoginMode ? "Signup" : "Login"}
        </Button>
      </Card>
    </>
  );
}
