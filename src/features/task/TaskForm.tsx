import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Modal,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  fetchAsyncCreateCategory,
  selectUsers,
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import styles from "./TaskForm.module.css";

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
}));

const TaskForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const isDisabled =
    editedTask.task.length === 0 ||
    editedTask.description.length === 0;

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    const name = e.target.name;
    if (name === "estimate") {
      value = Number(value);
    }
    dispatch(editTask({ ...editedTask, [name]: value }));
  };

  const handleSelectStatusChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = e.target.value as string;
    dispatch(editTask({ ...editedTask, status: value }));
  };

  const handleSelectCatChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as number;
    dispatch(editTask({ ...editedTask, category: value }));
  };

  let userOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));
  let catOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <div className={styles.card}>
      <div>
        <h2>{editedTask.id ? "Update Task" : "New Task"}</h2>
        <form>
          <TextField
            className={classes.field}
            label="Deadline"
            type="text"
            name="deadline"
            InputLabelProps={{
              shrink: true,
            }}
            value={editedTask.deadline}
            onChange={handleInputChange}
          />
          <TextField
            className={classes.field}
            InputLabelProps={{
              shrink: true,
            }}
            label="Task"
            type="text"
            name="task"
            value={editedTask.task}
            onChange={handleInputChange}
          />
          <br />
          <TextField
            className={classes.field}
            InputLabelProps={{
              shrink: true,
            }}
            label="Description"
            type="text"
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
          />
          <FormControl className={classes.field}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={editedTask.status}
              onChange={handleSelectStatusChange}
            >
              <MenuItem value={1}>Not started</MenuItem>
              <MenuItem value={2}>On going</MenuItem>
              <MenuItem value={3}>Done</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.field}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={editedTask.category}
              onChange={handleSelectCatChange}
            >
              {catOptions}
            </Select>
          </FormControl>
          <button type="button" onClick={handleOpen} className={styles.addIcon}>
            +
          </button>
          <br />
          <button
            className={styles.save_btn}
            disabled={isDisabled}
            onClick={
              editedTask.id !== 0
                ? () => dispatch(fetchAsyncUpdateTask(editedTask))
                : () => dispatch(fetchAsyncCreateTask(editedTask))
            }
          >
            {editedTask.id !== 0 ? "Update" : "Save"}
          </button>

          <button
            className={styles.cancel_btn}
            onClick={() => {
              dispatch(editTask(initialState.editedTask));
              dispatch(selectTask(initialState.selectedTask));
            }}
          >
            Cancel
          </button>

          <Modal open={open} onClose={handleClose} className={styles.modal_bg}>
            <div className={styles.modal}>
              <TextField
                className={classes.field}
                InputLabelProps={{
                  shrink: true,
                }}
                label="New category"
                type="text"
                value={inputText}
                onChange={handleInputTextChange}
              />
              <button
                type="button"
                className={styles.add_button}
                onClick={() => {
                  dispatch(fetchAsyncCreateCategory(inputText));
                  handleClose();
                }}
              >
                SAVE
              </button>
            </div>
          </Modal>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
