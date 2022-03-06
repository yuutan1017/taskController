import React, { useState } from "react";
import styles from "./Auth.module.css";

import { TextField } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  selectIsLoginView,
} from "./authSlice";

const AllAuth: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectIsLoginView);
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
      <div className={styles.card}>
        <h1 className={styles.login_mg}>{isLoginView ? "Login" : "Register"}</h1>
        <TextField
          className={styles.input_name_mg}
          InputLabelProps={{
            shrink: true,
          }}
          label="Username"
          type="text"
          name="username"
          value={credential.username}
          onChange={handleInputChange}
        />
      <br />
        <TextField
          className={styles.input_pass_mg}
          InputLabelProps={{
            shrink: true,
          }}
          label="Password"
          type="password"
          name="password"
          value={credential.password}
          onChange={handleInputChange}
        />
        <button
          className={styles.button}
          onClick={login}
        >
          {isLoginView ? "Login" : "Register"}
        </button>
        <span className={styles.btn_mg} onClick={() => dispatch(toggleMode())}>
        {isLoginView ? "Create new account ?" : "Back to Login"}
        </span>
      </div>
    </div>
  );
};

export default AllAuth;
