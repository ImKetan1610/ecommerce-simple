import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    // console.log(formData)
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    // console.log("login", formData);

    // Validate the formData
    if (!validateInput(formData)) {
      return false;
    }

    // start loading
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${config.endpoint}/auth/login`,
        formData
      );
      // console.log("login",response)
      //need to store the token, balance and username at the local storage
      persistLogin(
        response.data.token,
        response.data.username,
        response.data.balance
      );
      // redirect to the product page
      history.push("/");
      // reset the form data after clicking on the login to qkart button
      // if success
      if (response.data.success) {
        enqueueSnackbar("Logged in Successfully", { variant: "success" });
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and return a valid JSON",
          { variant: "error" }
        );
      }
    }

    // stop loading
    setIsLoading(false);

    // form reset
    setFormData({});
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    // console.log("validateInput", data);
    // check the username should be empty or undefined
    if (data.username === undefined || data.username.trim() === "") {
      enqueueSnackbar("Username is required field", { variant: "error" });
      // reset the formData to original state
      setFormData({});
      //  return false statement
      return false;
    }
    // check that password is valid i.e., check that it should not be undefined and empty
    if (data.password === undefined || data.password.trim() === "") {
      enqueueSnackbar("Password is required field", { variant: "error" });
      // reset the formData to initial state
      setFormData({});
      //  return false statement
      return false;
    }

    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    // console.log(
    //   "persistLogin",
    //   "\n",
    //   "token:",
    //   token,
    //   "\n",
    //   "username:",
    //   username,
    //   "\n",
    //   "balance:",
    //   balance
    // );
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="username"
            name="username"
            placeholder="Please Enter Your Username"
            fullWidth
            value={formData.username || ""}
            onChange={handleChange}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            title="password"
            placeholder="Enter Password"
            fullWidth
            value={formData.password || ""}
            onChange={handleChange}
          />
          <Button
            className="button"
            variant="contained"
            onClick={async () => {
              await login(formData);
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login to Qkart"
            )}
          </Button>
          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" to="/register">
              Register Here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
