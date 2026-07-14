import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/layout/Layout";
import { TaskProvider } from "@/context/TaskContext";
import Dashboard from "@/pages/Dashboard";
import TaskList from "@/pages/TaskList";
import TaskDetails from "@/pages/TaskDetails";
import Kanban from "@/pages/Kanban";

export default function App() {
  return (
    <TaskProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/kanban" element={<Kanban />} />
        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </TaskProvider>
  );
}
