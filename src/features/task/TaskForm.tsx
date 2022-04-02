import React, { useState } from "react";
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
  selectEditedTask,
  selectCategory,
  editTask,
  selectTask,
} from "./taskSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import styles from "./TaskForm.module.css";

const TaskForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
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
    editedTask.task.length === 0 || editedTask.description.length === 0;

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    const name = e.target.name;
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

  let catOptions = category.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {editedTask.id ? "Update Task" : "New Task"}
        </h2>
        <form className={styles.form}>
          <TextField
            className={styles.grid_1}
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
            className={styles.grid_2}
            InputLabelProps={{
              shrink: true,
            }}
            label="Task"
            type="text"
            name="task"
            value={editedTask.task}
            onChange={handleInputChange}
          />
          <TextField
            className={styles.grid_1}
            InputLabelProps={{
              shrink: true,
            }}
            label="Description"
            type="text"
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
          />
          <FormControl className={styles.grid_2}>
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
          <FormControl className={styles.grid_3}>
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
                className={styles.field}
                InputLabelProps={{
                  shrink: true,
                }}
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
    </>
  );
};

export default TaskForm;
