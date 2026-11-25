import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { store } from "./store";

const element = document.getElementById("root");
if (!element) throw new Error("The root element is missing.");
const root = ReactDOM.createRoot(element);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
