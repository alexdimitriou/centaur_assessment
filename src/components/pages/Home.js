import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AlertContext from "../../modules/AlertsContextProvider";
import Navbar from "../Navbar";
import Silo from "../Silo";

export default function Home() {
  const alerts = React.useContext(AlertContext);
  //   useEffect(() => {
  //     console.log(localStorage.getItem("centaur_token"));
  //   });
  useEffect(() => {
    fetch("http://localhost:3001/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("centaur_token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            alerts.error("You must be logged in to access this resource!");
            setTimeout(() => {
              window.location.replace("http://localhost:3000/login");
            }, 2000);
            throw new Error(text);
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        // alerts.success(`Logged in successfully`);
      })
      .catch((error) => {
        console.log(error);
        alerts.error("Error while fetching users");
      });
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Container sx={{ mt: 3 }} maxWidth="xl">
        <Silo />
      </Container>
    </React.Fragment>
  );
}
