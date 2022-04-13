import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";

import {
  selectLoginUser,
  selectProfiles,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
} from "./features/auth/authSlice";
import {
  initialState,
  fetchAsyncGetTasks,
  fetchAsyncGetUsers,
  selectTask,
  editTask,
  fetchAsyncGetCategory,
} from "./features/task/taskSlice";
import styles from "./App.module.css";

import TaskList from "./features/task/TaskList";
import { TaskForm } from "./features/task/Form";
import { AppDispatch } from "./app/store";

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  const loginProfile = profiles.filter(
    (prof) => prof.user_profile === loginUser.id
  )[0];
  console.log(loginProfile);

  const Logout = () => {
    localStorage.removeItem("localJWT");
    window.location.href = "/";
  };
  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  useEffect(() => {
    const fetchLoader = async () => {
      await dispatch(fetchAsyncGetTasks());
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetUsers());
      await dispatch(fetchAsyncGetCategory());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchLoader();
  }, [dispatch]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.button_style}>
          <button
            className={styles.add_button}
            onClick={() => {
              dispatch(
                editTask({
                  id: 0,
                  task: "",
                  description: "",
                  status: "1",
                  category: 1,
                  deadline: "",
                  owner: loginUser.id,
                })
              );
              dispatch(selectTask(initialState.selectedTask));
            }}
          >
            Add new task
          </button>
        </div>
        <div className={styles.title}>
          <h1 className={styles.color}>Task Controller</h1>
        </div>

        <div className={styles.icons}>
          <button className={styles.logoutIcon} onClick={Logout}>
            <ExitToApp fontSize="large" />
          </button>

          <input
            type="file"
            id="imageInput"
            hidden={true}
            onChange={(e) =>
              dispatch(
                fetchAsyncUpdateProf({
                  id: loginProfile.id,
                  img: e.target.files !== null ? e.target.files[0] : null,
                })
              )
            }
          />
          <button className={styles.avatar} onClick={handlerEditPicture}>
            <Avatar
              alt="avatar"
              src={loginProfile?.img !== null ? loginProfile?.img : undefined}
            />
          </button>
        </div>
      </div>
      <div className={styles.new}>
        <TaskForm />
      </div>
      <div className={styles.main}>
        <TaskList />
      </div>
    </>
  );
};

export default App;
