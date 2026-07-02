import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import Logo from "../components/Logo";

import api from "../services/api";
import { setToken, setUser } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const data = res.data;
      console.log("Login response:", data);

      const token = data?.token || data?.accessToken || data?.access_token;
      console.log("Extracted token:", token);

      if (!token) {
        throw new Error("No token returned");
      }

      setToken(token, remember);

      if (data.user) {
        setUser(data.user);
      }

      toast.success("Welcome back, Admin");

      navigate("/admin");
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || err?.message || "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="grid min-h-screen place-items-center px-4"
      style={{
        background: "var(--background)",
        backgroundImage: "var(--gradient-hero)",
      }}
    >
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        <div className="mb-8 flex justify-center">
          <Logo size={44} />
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
          <h1 className="font-display text-2xl font-bold">Admin sign in</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage subjects, uploads and settings.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 rounded-xl pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={remember}
                onCheckedChange={(value) => setRemember(value === true)}
              />
              Remember me
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
