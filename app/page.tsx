"use client";
import { useState, useEffect } from "react";
import { Container, Typography, List, Box } from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import SearchForm from "./components/SearchForm";
import SearchItem from "./components/SearchItem";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchInput, setSearchInput] = useState("")
  const [completedTime, setCompletedTime] = useState("")

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskText: string) => {
    const newTask = { id: Date.now(), text: taskText, completed: false, time: "" };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId: number) => {
    const taskToToggle = tasks.find((task) => task.id === taskId);

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const hours = now.getHours();
    const minutes = now.getUTCMinutes();


    if (taskToToggle) {
      // remove task from pending list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      // add task to completed list
      setCompletedTasks((prevCompletedTasks) => [
        ...prevCompletedTasks,
        { ...taskToToggle, completed: true, time: `${year}/${month}/${day} ${hours}:${minutes}` },
      ]);

      // setCompletedTime(`${year}/${month}/${day} ${hours}:${minutes}`)
    } 
  };

  const filteredTasks = completedTasks.filter((task) =>
    task.text.toLowerCase().includes(searchInput.toLowerCase())
  );

  const undoTask = (taskId: number) => {
    const confirmUndo = confirm("Are you sure you want to undo this task?")

    const removeFromCompleted = completedTasks.find(
      (task) => task.id === taskId
    );

    if (confirmUndo) {
      // remove task from completed list
      setCompletedTasks((prevCompletedTasks) =>
        prevCompletedTasks.filter((task) => task.id !== taskId)
      );
  
      // add task to pending list
      setTasks((prevTasks) => [
        ...prevTasks,
        { ...removeFromCompleted, completed: false },
      ]);
    }

  }

  const editTask = (taskId: number) => {
    const newText = prompt("Edit task");
    if (newText) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, text: newText } : task
        )
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "80vh",
        paddingTop: "50px",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Pending Tasks
        </Typography>
        <Box
          sx={{
            minHeight: "80vh",
            padding: "20px",
          }}
        >
          <TaskForm onAdd={addTask} />
          <List>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onComplete={toggleComplete}
                onEdit={editTask}
              />
            ))}
          </List>
        </Box>
      </Container>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Completed
        </Typography>

        <Box
          sx={{
            backgroundColor: "#FFE9E4",
            minHeight: "80vh",
            padding: "20px",
          }}
        >
          <SearchForm onSearch={addTask} input={searchInput} setInput={setSearchInput} />
          <List>
            {filteredTasks.map((task) => (
              <SearchItem key={task.id} task={task} onUndo={undoTask} />
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
}
