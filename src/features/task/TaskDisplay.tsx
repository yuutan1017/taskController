import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedTask } from './taskSlice';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import styles from "./TaskDisplay.module.css";

const TaskDisplay: React.FC = () => {
  const selectedTask = useSelector(selectSelectedTask);
  const rows = [
    { item: "タスク", data: selectedTask.task },
    { item: "説明", data: selectedTask.description },
    { item: "オーナー", data: selectedTask.owner_username },
    { item: "責任者", data: selectedTask.responsible_username },
    { item: "期限日数", data: selectedTask.estimate },
    { item: "カテゴリー", data: selectedTask.category_item },
    { item: "現状", data: selectedTask.status_name },
    { item: "作成日", data: selectedTask.created_at },
    { item: "更新日", data: selectedTask.update_at },
  ];

  if (!selectedTask.task) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h2>Task details</h2>
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
  )
}

export default TaskDisplay;
