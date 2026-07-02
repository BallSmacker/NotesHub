import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Semester from "./pages/Semester";
import Subject from "./pages/Subject";
import Search from "./pages/Search";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Upload from "./pages/Upload";
import ManageSubjects from "./pages/ManageSubjects";
import ManagePdfs from "./pages/ManagePdfs";
import Settings from "./pages/Settings";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/semester/:id" element={<Semester />} />
        <Route path="/subject/:id" element={<Subject />} />

        {/* Admin */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/upload" element={<Upload />} />
        <Route path="/admin/manage-subjects" element={<ManageSubjects />} />
        <Route path="/admin/manage-pdfs" element={<ManagePdfs />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Redirect */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
