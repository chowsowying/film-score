import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#c91e35",
          colorBorder: "#c91e35",
        },
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);
