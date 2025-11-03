window.onerror = (msg, src, line, col, err) => {
  console.group("🚨 Global Error Caught");
  console.error("Message:", msg);
  console.error("Source:", src);
  console.error("Line:", line, "Column:", col);
  console.error("Error object:", err);
  console.groupEnd();
};
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import  store  from "./redux/store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
