"use client";

import { useEffect, useState, useCallback } from "react";

type Status = "NEW" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

interface Application {
  id: string;
  fullName: string;
  age: number;
  city: string;
  email: string;
  whatsapp: string;
  instagram: string;
  goals: string;
  project?: string | null;
  status: Status;
  createdAt: string;
}

const STATUS_LABELS: Record<Status, string> = {
  NEW:          "New",
  UNDER_REVIEW: "Under Review",
  APPROVED:     "Approved",
  REJECTED:     "Rejected",
};

const STATUS_COLORS: Record<Status, string> = {
  NEW:          "text-blue-400   border-blue-400/30   bg-blue-400/10",
  UNDER_REVIEW: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  APPROVED:     "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  REJECTED:     "text-red-400    border-red-400/30    bg-red-400/10",
};

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<Status | "">("");
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter) params.set("status", filter);
    const res = await fetch(`/api/admin/applications?${params.toString()}`);
    const data = await res.json();
    setApplications(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, filter]);

  useEffect(() => {
    const timeout = setTimeout(fetchApplications, 300);
    return () => clearTimeout(timeout);
  }, [fetchApplications]);

  async function updateStatus(id: string, status: Status) {
    setUpdating(id);
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    await fetchApplications();
  }

  const statusCounts = (Object.keys(STATUS_LABELS) as Status[]).map((s) => ({
    status: s,
    count: applications.filter((a) => a.status === s).length,
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e8e4]" style={{ fontFamily: "ui-monospace, monospace" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 pb-6 border-b border-white/[0.07]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#444] mb-3">The Circle</p>
            <h1 className="text-2xl text-[#e8e8e4]" style={{ fontStyle: "italic", fontWeight: 400 }}>
              Admin Dashboard
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="text-center">
                <p className={`text-lg font-light ${STATUS_COLORS[status].split(" ")[0]}`}>{count}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#444]">{STATUS_LABELS[status]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search by name, email, city, instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-[13px] text-[#e8e8e4] placeholder-[#444] focus:outline-none focus:border-white/20 transition-colors"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Status | "")}
            className="bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-[13px] text-[#e8e8e4] focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
          >
            <option value="" style={{ background: "#050505" }}>All statuses</option>
            {(Object.entries(STATUS_LABELS) as [Status, string][]).map(([val, label]) => (
              <option key={val} value={val} style={{ background: "#050505" }}>{label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-24 text-center text-[#444] text-sm tracking-widest uppercase">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="py-24 text-center text-[#333] text-sm tracking-widest uppercase">No applications found.</div>
        ) : (
          <div>
            {/* Column headers */}
            <div className="hidden md:grid gap-4 px-4 py-3 text-[9px] uppercase tracking-[0.25em] text-[#444] border-b border-white/[0.06]"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto" }}>
              <span>Applicant</span>
              <span>Age · City</span>
              <span>Instagram</span>
              <span>Date</span>
              <span>Status</span>
              <span />
            </div>

            <div className="divide-y divide-white/[0.04]">
              {applications.map((app) => (
                <div key={app.id}>
                  {/* Row */}
                  <div
                    className="grid gap-4 px-4 py-4 cursor-pointer hover:bg-white/[0.015] transition-colors duration-300"
                    style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto" }}
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#e8e8e4] truncate">{app.fullName}</p>
                      <p className="text-[11px] text-[#555] mt-0.5 truncate">{app.email}</p>
                    </div>
                    <p className="text-[13px] text-[#888] self-center">{app.age} · {app.city}</p>
                    <p className="text-[13px] text-[#888] self-center truncate">{app.instagram}</p>
                    <p className="text-[11px] text-[#555] self-center">
                      {new Date(app.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="self-center">
                      <span className={`inline-block px-2 py-1 rounded-sm border text-[9px] uppercase tracking-wider ${STATUS_COLORS[app.status]}`}>
                        {STATUS_LABELS[app.status]}
                      </span>
                    </div>
                    <span className="text-[#333] text-xs self-center select-none">
                      {expanded === app.id ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {expanded === app.id && (
                    <div className="px-4 pb-8 pt-4 border-t border-white/[0.04] bg-white/[0.01]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-[#444] mb-1.5">WhatsApp</p>
                          <p className="text-[13px] text-[#aaa]">{app.whatsapp}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-[#444] mb-1.5">Instagram</p>
                          <p className="text-[13px] text-[#aaa]">{app.instagram}</p>
                        </div>
                        {app.project && (
                          <div className="col-span-2">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#444] mb-1.5">Project / Company</p>
                            <p className="text-[13px] text-[#aaa]">{app.project}</p>
                          </div>
                        )}
                      </div>

                      <div className="mb-6">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#444] mb-2">Goals</p>
                        <p className="text-[13px] text-[#888] leading-relaxed max-w-2xl">{app.goals}</p>
                      </div>

                      {/* Status actions */}
                      <div className="pt-4 border-t border-white/[0.05]">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#444] mb-3">Update status</p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                            <button
                              key={s}
                              disabled={app.status === s || updating === app.id}
                              onClick={(e) => { e.stopPropagation(); updateStatus(app.id, s); }}
                              className={`px-3 py-1.5 text-[9px] uppercase tracking-wider border transition-all duration-300 ${
                                app.status === s
                                  ? `${STATUS_COLORS[s]} cursor-default`
                                  : "border-white/[0.08] text-[#555] hover:border-white/20 hover:text-[#e8e8e4] cursor-pointer"
                              } disabled:opacity-40`}
                            >
                              {updating === app.id ? "..." : STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-6 text-[9px] uppercase tracking-widest text-[#333] text-right">
              {applications.length} result{applications.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
