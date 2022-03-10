import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { Route, BrowserRouter } from "react-router-dom";
import Auth from "./features/auth/Auth";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path="/" component={Auth} />
        <Route exact path="/tasks" component={App} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
