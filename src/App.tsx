import { GlobalContext } from "src/context";
import React from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Routes from "./routes.jsx";
import { cesInterceptFetch } from "./services/ces.service";

cesInterceptFetch();

export const App = () => {
  return (
    <GlobalContext>
      <ToastContainer />
      <Routes />
    </GlobalContext>
  );
};
