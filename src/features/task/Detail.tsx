import React from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";

import { selectSelectedTask } from "./taskSlice";
import styles from "./Detail.module.css";

export const TaskDetail = () => {
  const selectedTask = useSelector(selectSelectedTask);
  const rows = [
    { item: "タスク", data: selectedTask.task },
    { item: "説明", data: selectedTask.description },
    { item: "責任者", data: selectedTask.owner_username },
    { item: "期限日", data: selectedTask.deadline },
    { item: "カテゴリー", data: selectedTask.category_item },
    { item: "状態", data: selectedTask.status_name },
    { item: "作成日", data: selectedTask.created_at },
    { item: "更新日", data: selectedTask.updated_at },
  ];

  if (!selectedTask.task) {
    return null;
  }

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.title}>Task Details</h2>
        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.item}>
                <TableCell align="center">
                  <strong>{row.item}</strong>
                </TableCell>
                <TableCell align="center">{row.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

