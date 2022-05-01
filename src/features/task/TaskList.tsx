import React, { useState, useEffect } from "react";
import styles from "./TaskList.module.css";

import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {
  Avatar,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableSortLabel,
  Modal,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncDeleteTask,
  selectTasks,
  editTask,
  selectTask,
} from "./taskSlice";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import { SORT_STATE, READ_TASK } from "../types";
import { TaskDetail } from "./Detail";

const TaskList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);
  const columns = tasks[0] && Object.keys(tasks[0]);

  const [state, setState] = useState<SORT_STATE>({
    rows: tasks,
    order: "desc",
    activeKey: "",
  });

  const handleClickSortColumn = (column: keyof READ_TASK) => {
    const isDesc = column === state.activeKey && state.order === "desc";
    const newOrder = isDesc ? "asc" : "desc";
    const sortedRows = Array.from(state.rows).sort((x, y) => {
      if (x[column] > y[column]) {
        return newOrder === "asc" ? 1 : -1;
      } else if (x[column] < y[column]) {
        return newOrder === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });

    setState({
      rows: sortedRows,
      order: newOrder,
      activeKey: column,
    });
  };

  useEffect(() => {
    setState((state) => ({
      ...state,
      rows: tasks,
    }));
  }, [tasks]);

  const renderSwitch = (statusName: string) => {
    switch (statusName) {
      case "Before started":
        return <div className={styles.red}>{statusName}</div>;
      case "On going":
        return <div className={styles.blue}>{statusName}</div>;
      case "Finished":
        return <div className={styles.green}>{statusName}</div>;
      default:
        return null;
    }
  };

  const conditionalSrc = (user: number) => {
    const loginProfile = profiles.filter(
      (prof) => prof.user_profile === user
    )[0];
    return loginProfile?.img ? loginProfile?.img : undefined;
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const openModal = () => {
    setShowModal((e) => !e);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.table}>
          {tasks[0]?.task && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map(
                    (column, colIndex) =>
                      (column === "task" ||
                        column === "status" ||
                        column === "category" ||
                        column === "deadline" ||
                        column === "owner") && (
                        <TableCell align="center" key={colIndex}>
                          <TableSortLabel
                            active={state.activeKey === column}
                            direction={state.order}
                            onClick={() => handleClickSortColumn(column)}
                          >
                            <strong>{column}</strong>
                          </TableSortLabel>
                        </TableCell>
                      )
                  )}
                  <TableCell>
                    <div className={styles.edit_delete}>delete/edit</div>
                  </TableCell>
                  <TableCell align="center">
                    <div className={styles.edit_delete}>detail</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.rows.map((row, rowIndex) => (
                  <TableRow hover key={rowIndex}>
                    {Object.keys(row).map(
                      (key, colIndex) =>
                        (key === "task" ||
                          key === "status_name" ||
                          key === "category_item" ||
                          key === "deadline") && (
                          <TableCell
                            align="center"
                            className={styles.list_hover}
                            key={`${rowIndex}+${colIndex}`}
                            onClick={() => {
                              dispatch(editTask(initialState.editedTask));
                            }}
                          >
                            {key === "status_name" ? (
                              renderSwitch(row[key])
                            ) : (
                              <span>{row[key]}</span>
                            )}
                          </TableCell>
                        )
                    )}
                    <TableCell>
                      <Avatar
                        className={styles.avatar}
                        alt="owner"
                        src={conditionalSrc(row["owner"])}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <button
                        className={styles.list_icon}
                        onClick={() => {
                          dispatch(fetchAsyncDeleteTask(row.id));
                        }}
                        disabled={row["owner_username"] !== loginUser.username}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </button>
                      <button
                        className={styles.list_icon}
                        onClick={() => dispatch(editTask(row))}
                        disabled={row["owner_username"] !== loginUser.username}
                      >
                        <EditOutlinedIcon />
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        className={styles.detail}
                        onClick={() => {
                          openModal();
                          dispatch(selectTask(row));
                        }}
                      >
                        detail
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <Modal open={showModal} onClose={openModal} className={styles.bg}>
        <div className={styles.overlay}>
          <TaskDetail />
        </div>
      </Modal>
    </>
  );
};

export default TaskList;
