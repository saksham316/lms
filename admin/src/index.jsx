import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./features/store";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { injectStore } from "./services/axiosInterceptor";
import { injectStore2 } from "./features/actions/Video/videoActions";

const root = ReactDOM.createRoot(document.getElementById("root"));

let persistor = persistStore(store);
injectStore(store);
injectStore2(store);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter
      // basename={
      //   process.env.REACT_APP_WORKING_ENVIRONMENT === "production"
      //     ? "/mern/learning-management-system-admin"
      //     : ""
      // }
//	basename="/admin"
      >
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
