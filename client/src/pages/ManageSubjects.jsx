import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Edit3 } from "lucide-react";
import { toast } from "sonner";

import AdminLayout from "../components/AdminLayout";
import RequireAuth from "../components/RequireAuth";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

import api from "../services/api";

export default function ManageSubjects() {
  return (
    <RequireAuth>
      <AdminLayout>
        <SubjectsManager />
      </AdminLayout>
    </RequireAuth>
  );
}

function SubjectsManager() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteSubject, setDeleteSubject] = useState(null);

  const [form, setForm] = useState({
    subject_name: "",
  });

  async function loadSubjects() {
    try {
      const res = await api.get("/subjects");

      setSubjects(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setSubjects([]);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!deleteSubject) return;

      if (e.key === "Enter") {
        e.preventDefault();
        remove();
      }

      if (e.key === "Escape") {
        setDeleteSubject(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSubject]);

  const filteredSubjects = subjects.filter((subject) =>
    (subject.subject_name || "").toLowerCase().includes(search.toLowerCase()),
  );

  function openCreate() {
    setForm({
      subject_name: "",
    });

    setCreating(true);
  }

  function openEdit(subject) {
    setForm({
      subject_name: subject.subject_name || "",
    });
    setEditing(subject);
  }

  async function save() {
    if (!form.subject_name.trim()) {
      toast.error("Subject name is required.");
      return;
    }

    const payload = {
      subject_name: form.subject_name.trim(),
      display_order: subjects.length + 1,
    };

    try {
      if (editing) {
        await api.put(`/subjects/${editing.id}`, payload);

        toast.success("Subject updated.");
      } else {
        await api.post("/subjects", payload);

        toast.success("Subject created.");
      }

      setEditing(null);
      setCreating(false);

      loadSubjects();
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Failed to save.");
    }
  }

  async function remove() {
    if (!deleteSubject) return;

    try {
      await api.delete(`/subjects/${deleteSubject.id}`);

      toast.success("Subject deleted.");

      setDeleteSubject(null);

      loadSubjects();
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Failed to delete.");
    }
  }

  const dialogOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black">Manage Subjects</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit and remove subjects.
          </p>
        </div>

        <Button onClick={openCreate} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <div className="max-w-xl">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by subject name..."
        />
      </div>

      {filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={search ? "No matching subjects" : "No subjects"}
          description={
            search
              ? "Try a different search term."
              : "Create your first subject to get started."
          }
          action={
            !search && (
              <Button onClick={openCreate} className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Name</th>

                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubjects.map((subject) => (
                <tr
                  key={subject.id}
                  className="
                  border-b
                  border-border/40
                  last:border-0
                  transition-colorsduration-200
                  hover:bg-muted/40"
                >
                  <td className="px-5 py-4 font-medium text-foreground">
                    {subject.subject_name}
                  </td>

                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="
                        rounded-xl
                        transition-all
                        duration-200
                        hover:scale-110
                        hover:bg-primary/10"
                        title="Edit Subject"
                        onClick={() => openEdit(subject)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="
                        rounded-xl
                        text-destructive
                        transition-all
                        duration-200
                        hover:scale-110
                        hover:bg-destructive/10
                        active:scale-95"
                        title="Delete Subject"
                        onClick={() => setDeleteSubject(subject)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setCreating(false);
          }
        }}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Subject" : "Add Subject"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label>Subject Name</Label>

              <Input
                autoFocus
                value={form.subject_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subject_name: e.target.value,
                  })
                }
                placeholder="e.g. Data Structures"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                }}
              >
                Cancel
              </Button>

              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteSubject}
        onOpenChange={(open) => {
          if (!open) setDeleteSubject(null);
        }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl border border-border/60 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-destructive">
              Delete Subject?
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-4 leading-7 text-muted-foreground">
              You're about to permanently delete
              <span className="mx-1 font-semibold text-foreground">
                "{deleteSubject?.subject_name}"
              </span>
              from NotesHub.
              <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-8 flex gap-3">
            <AlertDialogCancel onClick={() => setDeleteSubject(null)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={remove}
              className="
              rounded-xl
              bg-destructive
              text-destructive-foreground
              transition-all
              duration-200
              hover:scale-105
              hover:bg-destructive/90
              active:scale-95"
            >
              Delete Subject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
