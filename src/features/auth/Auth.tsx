import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Auth.module.css";
import { AppDispatch } from "../../app/store";
import {
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  selectLoginView,
} from "./authSlice";


const Auth: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectLoginView);
  const [credential, setCredential] = useState({ username: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setCredential({ ...credential, [name]: value });
  };
  const login = async () => {
    if (isLoginView) {
      await dispatch(fetchAsyncLogin(credential));
    } else {
      const result = await dispatch(fetchAsyncRegister(credential));
      if (fetchAsyncRegister.fulfilled.match(result)) {
        await dispatch(fetchAsyncLogin(credential));
        await dispatch(fetchAsyncCreateProf());
      }
    }
  };

  return (
    <div className={styles.back}>
      <form className={styles.card}>
        <h1 className={styles.login_tx}>
          {isLoginView ? "Login" : "Register"}
        </h1>
        <input
          id="username"
          placeholder="username"
          className={styles.input_name}
          type="text"
          name="username"
          value={credential.username}
          onChange={handleInputChange}
        />
        <br />
        <input
          id="password"
          placeholder="password"
          className={styles.input_pass}
          type="password"
          name="password"
          value={credential.password}
          onChange={handleInputChange}
        />
        <button className={styles.button} type="button" onClick={login}>
          {isLoginView ? "Login" : "Register"}
        </button>
        <span className={styles.span_tx} onClick={() => dispatch(toggleMode())}>
          {isLoginView ? "Create new account ?" : "Back to Login"}
        </span>
      </form>
    </div>
  );
};

export default Auth;
