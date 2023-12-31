import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    //Check if the data passed is valid or not
    if (!validateInput(formData)) {
      return false;
    }
    // start loading
    setIsLoading(true);
    try {
      console.log("fromData", formData);
      let data = {
        username: formData.username,
        password: formData.password,
      };
      let response = await axios.post(`${config.endpoint}/auth/register`, data);
      // console.log("response", response);
      history.push("/login");

      // if post call successful
      if (response.status === 201 && response.data.success) {
        // If username is already exist
        enqueueSnackbar("Registered Successfully", { variant: "success" });
      }
    } catch (error) {
      // console.log("error",error);
      // other error
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and return the valid JSON",
          { variant: "error" }
        );
      }
    }

    // End loading
    setIsLoading(false);
    //removing the added data from register form
    setFormData({ username: "", password: "", confirmPassword: "" });
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    // validate the username
    if (data.username === undefined || data.username.trim === "") {
      enqueueSnackbar("Username is required field", { variant: "error" });
      setFormData({});
      return false;
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
      setFormData({});
      return false;
    }

    // Validate the password
    if (data.password === undefined || data.password.trim === "") {
      enqueueSnackbar("Password is required field", { variant: "error" });
      setFormData({});
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
      setFormData({});
      return false;
    }

    // validate the confirm Password
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Password do not match", { variant: "error" });
      setFormData({});
      return false;
    }

    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formData.username || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password || ""}
            onChange={handleChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
            fullWidth
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => {
              register(formData);
            }}
          >
            {/* Register Now */}
            {isLoading ? <CircularProgress /> : "Register Now"}
          </Button>
          <p className="secondary-action">
            Already have an account? {/* <a className="link" href="#"> */}
            <Link className="link" to="/login">
              Login here
            </Link>
            {/* </a> */}
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
