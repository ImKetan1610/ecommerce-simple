import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  // console.log("Header", children, hasHiddenAuthButtons);
  const username = localStorage.getItem("username");
  const balance = localStorage.getItem("balance");
  const token = localStorage.getItem("token");
  // console.log("username", username, balance, token);

  const handleLogout = () => {
    // remove username, balance, token from the local storage after log out
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    localStorage.removeItem("token");

    // redirect to same page
    history.push("/");

    // refresh the page
    // history.go()
  };

  const history = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      ) : !username ? (
        <>
          <Box width={"30vw"}>{children}</Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              className="button"
              variant="contained"
              onClick={() => {
                history.push("/login");
              }}
            >
              Login
            </Button>
            <Button
              className="button"
              variant="contained"
              onClick={() => {
                history.push("/register");
              }}
            >
              Register
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Box width={"30vw"}>{children}</Box>
          <Stack direction="row" spacing={1} alignItems={"center"}>
            <Avatar alt={username} src="../../public/avatar.png" />
            <p>{username}</p>
            <Button
              className="button"
              variant="contained"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Header;
