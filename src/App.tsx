import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Avatar } from "@material-ui/core";
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
  selectEditedTask,
  selectTasks,
  selectTask,
  editTask,
  fetchAsyncGetCategory,
} from "./features/task/taskSlice";
import styles from "./App.module.css";

import TaskList from "./features/task/TaskList";
import TaskDisplay from "./features/task/TaskDisplay";
import TaskForm from "./features/task/TaskForm";
import { AppDispatch } from "./app/store";


const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const editedTask = useSelector(selectEditedTask);
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  const loginProfile = profiles.filter(
    (prof) => prof.user_profile === loginUser.id
  )[0];
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
      <div className={styles.app_root}>
        <Grid container>
          <Grid item xs={4}>
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
          </Grid>

          <Grid item xs={4}>
            <h1>Task Controller</h1>
          </Grid>

          <Grid item xs={4}>
            <div className={styles.app_logout}>
              <button className={styles.app_logoutIcon} onClick={Logout}>
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
              <button
                className={styles.app_button}
                onClick={handlerEditPicture}
              >
                <Avatar
                  alt="avatar"
                  src={
                    loginProfile?.img !== null ? loginProfile?.img : undefined
                  }
                />
              </button>
            </div>
          </Grid>

          <Grid item xs={6}>
            {tasks[0]?.task && <TaskList />}
          </Grid>

          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "80vh" }}
            >
              <Grid item>
                {editedTask.status ? <TaskForm /> : <TaskDisplay />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
  );
};

export default App;
