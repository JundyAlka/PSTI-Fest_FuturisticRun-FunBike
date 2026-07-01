"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, Filter, CheckCircle, XCircle, Eye, Download, ChevronLeft, ChevronRight, Mail, CheckSquare, Trash2, AlertTriangle, X } from "lucide-react";
import { getPaymentStatusColor, getPaymentStatusLabel, formatCurrency, CATEGORY_LABELS } from "@/lib/utils";
import LoadingPanel from "@/components/LoadingPanel";

interface Participant {
  id: number; reg_number: string; full_name: string; email: string; phone: string;
  category: string; jersey_size: string; bib_name: string; bib_number: number | null;
  payment_status: string; payment_method: string | null; payment_amount: number;
  payment_proof: string | null; payment_proof_mime: string | null; payment_proof_name: string | null; paid_at: string | null;
  city: string; created_at: string; event_type: string;
  verified_at: string | null; verified_by: string | null; rejection_reason: string | null;
}

interface Meta { total: number; page: number; limit: number; pages: number; }

export default function PesertaPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Participant | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [activeEvent, setActiveEvent] = useState<"futuristic-run" | "fun-bike">("futuristic-run");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ ids: number[]; label: string } | null>(null);

  const reload = async () => {
    const params = new URLSearchParams({ page: String(page), limit: "20", eventType: activeEvent });
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (status !== "all") params.set("status", status);
    const res = await fetch(`/api/admin/participants?${params}`);
    const data = await res.json();
    setParticipants(data.participants ?? []);
    setMeta(data.meta ?? { total: 0, page: 1, limit: 20, pages: 0 });
  };

  const handleBulkVerify = async (newStatus: "verified" | "rejected") => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    await fetch("/api/admin/bulk-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds), status: newStatus }),
    });
    setBulkLoading(false);
    setSelectedIds(new Set());
    await reload();
  };

  const handleResendEmail = async (id: number) => {
    await fetch("/api/admin/resend-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === participants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(participants.map((p) => p.id)));
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "20", eventType: activeEvent });
      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);
      if (status !== "all") params.set("status", status);
      const res = await fetch(`/api/admin/participants?${params}`);
      const data = await res.json();
      setParticipants(data.participants ?? []);
      setMeta(data.meta ?? { total: 0, page: 1, limit: 20, pages: 0 });
      setLoading(false);
    };

    const timeout = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [page, search, category, status, activeEvent]);

  const handleVerify = async (id: number, newStatus: "verified" | "rejected") => {
    if (newStatus === "rejected" && rejectNotes.trim().length < 3) {
      setActionError("Alasan penolakan minimal 3 karakter.");
      return;
    }
    setActionLoading(true);
    setActionError("");
    const response = await fetch("/api/admin/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus, notes: rejectNotes || undefined }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setActionError(body.error ?? "Status pembayaran gagal diperbarui.");
      setActionLoading(false);
      return;
    }
    setActionLoading(false);
    setSelected(null);
    setRejectNotes("");
    await reload();
  };

  const requestDelete = useCallback((idOrIds: number | number[], label?: string) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (ids.length === 0) return;
    setDeleteConfirm({ ids, label: label ?? `${ids.length} data peserta` });
  }, []);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading(true);
    setBulkLoading(true);
    await fetch("/api/admin/participants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: deleteConfirm.ids }),
    });
    setActionLoading(false);
    setBulkLoading(false);
    setSelected(null);
    setSelectedIds(new Set());
    setDeleteConfirm(null);
    await reload();
  };

  return (
    <div className="page-animate p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>PESERTA</h1>
          <p className="text-[#B0C4DE] text-sm mt-1">Total: {meta.total} peserta terdaftar</p>
        </div>
        <a href={`/api/admin/export?eventType=${activeEvent}`} className="btn-outline-neon flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer">
          <Download size={14} /> Export
        </a>
      </div>

      {/* Event Tabs */}
      <div className="card-animated flex gap-2 mb-5 p-1 glass-card rounded-xl border border-[#1E3A5F]">
        {([
          { id: "futuristic-run" as const, label: "Futuristic Run", color: "#00E5FF" },
          { id: "fun-bike" as const, label: "Futuristic Bike", color: "#FF6B2C" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveEvent(tab.id); setCategory("all"); setPage(1); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeEvent === tab.id
                ? "text-[#0A0E27]"
                : "text-[#B0C4DE] hover:text-white"
            }`}
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "1px",
              background: activeEvent === tab.id ? tab.color : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="card-animated flex items-center justify-between p-3 mb-4 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/5">
          <span className="text-sm text-[#00E5FF] font-semibold">{selectedIds.size} peserta dipilih</span>
          <div className="flex gap-2">
            <button
              disabled={bulkLoading}
              onClick={() => handleBulkVerify("verified")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 disabled:opacity-50 transition-all"
            >
              <CheckCircle size={13} /> Verifikasi
            </button>
            <button
              disabled={bulkLoading}
              onClick={() => requestDelete(Array.from(selectedIds))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Trash2 size={13} /> Hapus
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-[#B0C4DE] hover:text-white px-2 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card-animated glass-card rounded-xl p-4 border border-[#1E3A5F] mb-5 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0C4DE]" />
          <input
            className="neon-input w-full rounded-lg pl-9 pr-4 py-2 text-sm"
            placeholder="Cari nama, email, no. reg..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#B0C4DE]" />
          <select className="neon-input rounded-lg px-3 py-2 text-sm" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="all">Semua Peserta</option>
            <option value={activeEvent === "fun-bike" ? "funbike" : "5K"}>{activeEvent === "fun-bike" ? "Fun Ride" : "Run 5K"}</option>
          </select>
          <select className="neon-input rounded-lg px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-animated glass-card rounded-2xl border border-[#1E3A5F] overflow-hidden">
        {loading ? (
          <LoadingPanel label="Memuat peserta" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1280px] text-sm">
              <thead>
                <tr className="border-b border-[#1E3A5F] bg-[#0F1535]">
                  <th className="px-3 py-3 w-8">
                    <button onClick={toggleSelectAll} className="text-[#B0C4DE] hover:text-white transition-colors">
                      <CheckSquare size={14} className={selectedIds.size === participants.length && participants.length > 0 ? "text-[#00E5FF]" : ""} />
                    </button>
                  </th>
                  {["No. Reg", "Nama", "Event", "Kategori", "Jersey", "BIB Name", "Kota", "Total", "Metode", "Status", "Bukti", "Aksi"].map((h) => (
                    <th key={h} className={`px-4 py-3 text-left text-[#B0C4DE] text-xs font-semibold whitespace-nowrap ${h === "Aksi" ? "min-w-28" : ""}`} style={{ fontFamily: "Orbitron, sans-serif" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr><td colSpan={13} className="px-4 py-12 text-center text-[#B0C4DE]">Tidak ada peserta ditemukan</td></tr>
                ) : participants.map((p, i) => (
                  <tr key={p.id} className={`table-row-animated border-b border-[#1E3A5F]/50 hover:bg-white/5 transition-colors ${i % 2 === 1 ? "bg-white/[0.01]" : ""}`}>
                    <td className="px-3 py-3">
                      <button onClick={() => toggleSelect(p.id)} className="text-[#B0C4DE] hover:text-white transition-colors">
                        <CheckSquare size={14} className={selectedIds.has(p.id) ? "text-[#00E5FF]" : ""} />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#00E5FF] text-xs whitespace-nowrap">{p.reg_number}</td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{p.full_name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        background: p.event_type === "fun-bike" ? "rgba(255,107,44,0.1)" : "rgba(0,229,255,0.1)",
                        color: p.event_type === "fun-bike" ? "#FF6B2C" : "#00E5FF",
                        border: `1px solid ${p.event_type === "fun-bike" ? "rgba(255,107,44,0.2)" : "rgba(0,229,255,0.2)"}`,
                      }}>
                        {p.event_type === "fun-bike" ? "Futuristic Bike" : "Run"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>{p.category}</span></td>
                    <td className="px-4 py-3 text-[#B0C4DE]">{p.jersey_size}</td>
                    <td className="px-4 py-3 font-mono text-[#B0C4DE]">{p.bib_name}{p.bib_number ? ` #${p.bib_number}` : ""}</td>
                    <td className="px-4 py-3 text-[#B0C4DE] whitespace-nowrap">{p.city}</td>
                    <td className="px-4 py-3 text-[#FFD700] font-semibold text-xs whitespace-nowrap">{formatCurrency(p.payment_amount ?? 0)}</td>
                    <td className="px-4 py-3 text-[#B0C4DE] text-xs uppercase whitespace-nowrap">{p.payment_method ?? "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold" style={{ color: getPaymentStatusColor(p.payment_status) }}>
                        ● {getPaymentStatusLabel(p.payment_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {p.payment_proof ? (
                        <a href={p.payment_proof} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-[#00E5FF] hover:text-white">
                          <Eye size={13} /> Lihat
                        </a>
                      ) : <span className="text-xs text-[#5A7899]">Belum ada</span>}
                    </td>
                    <td className="min-w-28 px-4 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button
                          title="Lihat Detail"
                          aria-label={`Lihat detail ${p.full_name}`}
                          onClick={() => { setSelected(p); setRejectNotes(""); setActionError(""); }}
                          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[#00E5FF] transition-colors hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/15 hover:text-white"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Hapus Peserta"
                          aria-label={`Hapus peserta ${p.full_name}`}
                          onClick={() => requestDelete(p.id, p.full_name)}
                          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E3A5F]">
            <span className="text-[#B0C4DE] text-xs">Hal. {meta.page} dari {meta.pages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-[#1E3A5F] text-[#B0C4DE] hover:text-white hover:border-[#00E5FF]/50 disabled:opacity-30 transition-all">
                <ChevronLeft size={14} />
              </button>
              <button disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-[#1E3A5F] text-[#B0C4DE] hover:text-white hover:border-[#00E5FF]/50 disabled:opacity-30 transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail / Verify Modal */}
      {selected && createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] pb-6 px-4 sm:px-6 overflow-y-auto" style={{ background: "rgba(5,8,22,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }} onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="w-full max-w-lg max-h-[84vh] flex flex-col rounded-2xl border border-[#1E3A5F]/80 shadow-[0_8px_64px_rgba(0,229,255,0.08),0_0_0_1px_rgba(30,58,95,0.5)] overflow-hidden" style={{ background: "linear-gradient(180deg, #0D1330 0%, #0A0E27 100%)", animation: "modalSlideUp .25s cubic-bezier(.22,1,.36,1)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3A5F]/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
                  <Eye size={14} className="text-[#00E5FF]" />
                </div>
                <h3 className="text-white font-bold text-xs tracking-[0.15em]" style={{ fontFamily: "Orbitron, sans-serif" }}>DETAIL PESERTA</h3>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg border border-[#1E3A5F] flex items-center justify-center text-[#5A7899] hover:text-white hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/5 transition-all cursor-pointer"><X size={16} /></button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                {[
                  { label: "No. Reg", value: selected.reg_number, accent: true },
                  { label: "Nama", value: selected.full_name, accent: false },
                  { label: "Email", value: selected.email, accent: false },
                  { label: "HP", value: selected.phone, accent: false },
                  { label: "Kategori", value: CATEGORY_LABELS[selected.category] ?? selected.category, accent: false },
                  { label: "Jersey", value: selected.jersey_size, accent: false },
                  { label: "BIB Name", value: selected.bib_name, accent: false },
                  { label: "BIB No.", value: selected.bib_number ? `#${selected.bib_number}` : "—", accent: false },
                  { label: "Metode", value: selected.payment_method?.toUpperCase() ?? "—", accent: false },
                  { label: "Biaya", value: formatCurrency(selected.payment_amount ?? 0), accent: false },
                  { label: "Status", value: getPaymentStatusLabel(selected.payment_status), accent: false },
                  { label: "Kota", value: selected.city, accent: false },
                ].map((row) => (
                  <div key={row.label} className="rounded-lg bg-white/[0.03] border border-white/[0.04] px-3 py-2.5">
                    <div className="text-[#5A7899] text-[10px] font-semibold tracking-wider uppercase mb-1">{row.label}</div>
                    <div className={`text-sm font-semibold truncate ${row.accent ? "text-[#00E5FF] font-mono" : "text-white"}`}>{row.value}</div>
                  </div>
                ))}
              </div>

              {/* Proof image */}
              {selected.payment_proof && (
                <div className="rounded-xl border border-[#1E3A5F]/60 bg-white/[0.02] p-4">
                  <div className="text-[#5A7899] text-[10px] font-semibold tracking-wider uppercase mb-2.5">Bukti Pembayaran</div>
                  {selected.payment_proof_mime === "application/pdf" || /\.pdf(?:$|\?)/i.test(decodeURIComponent(selected.payment_proof)) ? (
                    <a href={selected.payment_proof} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#00E5FF] text-xs font-semibold hover:underline">
                      Lihat PDF Bukti Pembayaran
                    </a>
                  ) : (
                    <a href={selected.payment_proof} target="_blank" rel="noopener noreferrer" className="block">
                      <img src={selected.payment_proof} alt="Bukti bayar" className="max-h-40 w-auto max-w-full rounded-lg border border-[#1E3A5F]/50 hover:border-[#00E5FF]/50 transition-colors object-contain bg-black/30" />
                    </a>
                  )}
                </div>
              )}

              {/* Rejection notes */}
              {selected.payment_status === "pending" && (
                <div>
                  <label className="block text-[#5A7899] text-[10px] font-semibold tracking-wider uppercase mb-1.5">Alasan Penolakan (wajib jika ditolak)</label>
                  <textarea className="neon-input w-full rounded-xl px-3.5 py-2.5 text-sm" rows={2} placeholder="Alasan penolakan..." value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} />
                </div>
              )}

              {actionError && <p className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">{actionError}</p>}

              {selected.payment_status !== "pending" && (
                <div className="rounded-xl border border-[#1E3A5F]/40 bg-white/[0.02] p-4 text-center">
                  <span className="text-xs font-bold" style={{ color: getPaymentStatusColor(selected.payment_status) }}>
                    ● {getPaymentStatusLabel(selected.payment_status)}
                    {selected.verified_by && ` — by ${selected.verified_by}`}
                  </span>
                  {selected.rejection_reason && (
                    <p className="text-[#B0C4DE] text-[11px] mt-1.5">Catatan: {selected.rejection_reason}</p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-[#1E3A5F]/60 shrink-0 space-y-3" style={{ background: "rgba(10,14,39,0.95)" }}>
              {selected.payment_status === "pending" && (
                <div className="flex gap-3">
                  <button
                    disabled={actionLoading || !selected.payment_proof}
                    onClick={() => handleVerify(selected.id, "verified")}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <CheckCircle size={14} /> Verifikasi
                  </button>
                  <button
                    disabled={actionLoading || !selected.payment_proof || rejectNotes.trim().length < 3}
                    onClick={() => handleVerify(selected.id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#FF006E]/10 border border-[#FF006E]/30 text-[#FF006E] hover:bg-[#FF006E]/20 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <XCircle size={14} /> Tolak
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleResendEmail(selected.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-semibold border border-[#1E3A5F] text-[#B0C4DE] hover:text-white hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/5 transition-all cursor-pointer">
                  <Mail size={13} /> Kirim Email
                </button>
                <button disabled={actionLoading} onClick={() => requestDelete(selected.id, selected.full_name)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer disabled:opacity-40">
                  <Trash2 size={13} /> Hapus Data
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && createPortal(
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh] px-4" style={{ background: "rgba(5,8,22,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }} onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 shadow-[0_8px_64px_rgba(239,68,68,0.12),0_0_0_1px_rgba(30,58,95,0.4)] overflow-hidden" style={{ background: "linear-gradient(180deg, #12101F 0%, #0A0E27 100%)", animation: "modalSlideUp .2s cubic-bezier(.22,1,.36,1)" }}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "0.08em" }}>KONFIRMASI HAPUS</h3>
              <p className="text-[#B0C4DE] text-sm leading-relaxed">Apakah Anda yakin ingin menghapus <span className="text-white font-semibold">{deleteConfirm.label}</span>?</p>
              <p className="text-red-400/70 text-xs mt-2">Data yang dihapus tidak dapat dikembalikan.</p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-[#1E3A5F] text-[#B0C4DE] hover:text-white hover:border-[#5A7899] transition-all cursor-pointer">Batal</button>
              <button disabled={actionLoading} onClick={confirmDelete} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-all cursor-pointer disabled:opacity-40">
                {actionLoading ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : <Trash2 size={14} />}
                Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
