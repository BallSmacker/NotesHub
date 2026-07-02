import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, KeyRound } from "lucide-react";
import { toast } from "sonner";

import AdminLayout from "../components/AdminLayout";
import RequireAuth from "../components/RequireAuth";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import api from "../services/api";
import { clearToken } from "../services/auth";

export default function Settings() {
  return (
    <RequireAuth>
      <AdminLayout>
        <SettingsPage />
      </AdminLayout>
    </RequireAuth>
  );
}

function SettingsPage() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function change(e) {
    e.preventDefault();

    if (next !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    setSaving(true);

    try {
      await api.post("/auth/change-password", {
        currentPassword: current,
        newPassword: next,
      });

      toast.success("Password updated");

      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black">Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your admin account.
        </p>
      </div>

      <form
        onSubmit={change}
        className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
      >
        <div className="mb-2 flex items-center gap-2 font-display text-lg font-bold">
          <KeyRound className="h-5 w-5 text-primary" />
          Change Password
        </div>

        <div className="space-y-2">
          <Label>Current Password</Label>

          <Input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>New Password</Label>

          <Input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Confirm Password</Label>

          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {saving ? "Saving..." : "Update Password"}
        </Button>
      </form>

      <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display font-bold">Sign Out</div>

            <div className="text-sm text-muted-foreground">
              End your admin session on this device.
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={logout}
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
