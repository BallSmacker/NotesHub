import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  HardDrive,
  Upload,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import RequireAuth from "../components/RequireAuth";

import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

import api from "../services/api";

export default function AdminDashboard() {
  return (
    <RequireAuth>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </RequireAuth>
  );
}

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [subjectsRes, pdfsRes] = await Promise.all([
          api.get("/subjects"),
          api.get("/pdfs"),
        ]);

        setSubjects(
          Array.isArray(subjectsRes.data)
            ? subjectsRes.data
            : subjectsRes.data.data || [],
        );

        setPdfs(
          Array.isArray(pdfsRes.data) ? pdfsRes.data : pdfsRes.data.data || [],
        );
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const totalStorage = useMemo(() => {
    return pdfs.reduce((sum, pdf) => sum + (Number(pdf.size) || 0), 0);
  }, [pdfs]);

  const storageGb = totalStorage / 1024 ** 3;
  const storageCap = 10;

  const storagePercentage = Math.min(
    100,
    Math.round((storageGb / storageCap) * 100),
  );

  const recentUploads = useMemo(() => {
    return [...pdfs]
      .sort((a, b) => {
        const ad = new Date(a.uploadedAt || a.createdAt || 0).getTime();

        const bd = new Date(b.uploadedAt || b.createdAt || 0).getTime();

        return bd - ad;
      })
      .slice(0, 5);
  }, [pdfs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black">
          Welcome back, Admin 👋
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your notes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Subjects"
          value={subjects.length}
          sub="Total Subjects"
          tone="primary"
        />

        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Notes (PDFs)"
          value={pdfs.length}
          sub="Total PDFs"
          tone="accent"
        />

        <StatCard
          icon={<HardDrive className="h-5 w-5" />}
          label="Storage"
          value={`${storageGb.toFixed(1)} GB`}
          sub={`of ${storageCap} GB`}
          tone="primary"
        />

        <StatCard
          icon={<Upload className="h-5 w-5" />}
          label="Recent"
          value={recentUploads.length}
          sub="Uploads"
          tone="accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent Uploads</h2>

            <Link
              to="/admin/manage-subjects"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {recentUploads.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No uploads yet.
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {recentUploads.map((pdf) => {
                const date = pdf.uploadedAt || pdf.createdAt;

                return (
                  <li key={pdf.id} className="flex items-center gap-3 py-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {pdf.name || pdf.title || pdf.filename}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Module {pdf.module ?? pdf.moduleNumber ?? "—"}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {date ? new Date(date).toLocaleDateString() : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-lg font-bold">Storage Used</h2>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black">
                {storageGb.toFixed(1)} GB
              </span>

              <span className="text-sm text-muted-foreground">
                {storagePercentage}%
              </span>
            </div>

            <Progress value={storagePercentage} className="mt-3" />

            <p className="mt-2 text-xs text-muted-foreground">
              of {storageCap} GB
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-lg font-bold">Quick Actions</h2>

            <div className="mt-4 flex flex-col gap-2">
              <Button
                asChild
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/admin/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PDF
                </Link>
              </Button>

              <Button asChild variant="secondary" className="rounded-xl">
                <Link to="/admin/manage-subjects">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, tone }) {
  const bg =
    tone === "primary"
      ? "bg-primary/15 text-primary"
      : "bg-accent/15 text-accent";

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2">
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${bg}`}>
          {icon}
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>

      <div className="mt-3 font-display text-3xl font-black">{value}</div>

      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
