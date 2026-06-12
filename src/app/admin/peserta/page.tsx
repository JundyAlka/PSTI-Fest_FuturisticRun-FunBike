"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Search, Filter, CheckCircle, XCircle, Eye, Download, ChevronLeft, ChevronRight, Mail, CheckSquare } from "lucide-react";
import { getPaymentStatusColor, getPaymentStatusLabel, formatCurrency, CATEGORY_LABELS } from "@/lib/utils";
import LoadingPanel from "@/components/LoadingPanel";

interface Participant {
  id: number; reg_number: string; full_name: string; email: string; phone: string;
  category: string; jersey_size: string; bib_name: string; bib_number: number | null;
  payment_status: string; payment_method: string | null; payment_amount: number;
  payment_proof: string | null; city: string; created_at: string; event_type: string;
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
  const [rejectNotes, setRejectNotes] = useState("");
  const [activeEvent, setActiveEvent] = useState<"futuristic-run" | "fun-bike">("futuristic-run");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

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
    setActionLoading(true);
    await fetch("/api/admin/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus, notes: rejectNotes || undefined }),
    });
    setActionLoading(false);
    setSelected(null);
    setRejectNotes("");
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
          { id: "futuristic-run" as const, label: "FUTURISTIC RUN", color: "#00E5FF" },
          { id: "fun-bike" as const, label: "FUN BIKE", color: "#FF6B2C" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveEvent(tab.id); setPage(1); }}
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
              onClick={() => handleBulkVerify("rejected")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#FF006E] text-[#FF006E] hover:bg-[#FF006E]/10 disabled:opacity-50 transition-all"
            >
              <XCircle size={13} /> Tolak
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
            <option value="5K">Run 5K</option>
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
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E3A5F] bg-[#0F1535]">
                  <th className="px-3 py-3 w-8">
                    <button onClick={toggleSelectAll} className="text-[#B0C4DE] hover:text-white transition-colors">
                      <CheckSquare size={14} className={selectedIds.size === participants.length && participants.length > 0 ? "text-[#00E5FF]" : ""} />
                    </button>
                  </th>
                  {["No. Reg", "Nama", "Event", "Kategori", "Jersey", "BIB Name", "Kota", "Pembayaran", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[#B0C4DE] text-xs font-semibold whitespace-nowrap" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-[#B0C4DE]">Tidak ada peserta ditemukan</td></tr>
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
                        {p.event_type === "fun-bike" ? "Fun Bike" : "Run"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>{p.category}</span></td>
                    <td className="px-4 py-3 text-[#B0C4DE]">{p.jersey_size}</td>
                    <td className="px-4 py-3 font-mono text-[#B0C4DE]">{p.bib_name}{p.bib_number ? ` #${p.bib_number}` : ""}</td>
                    <td className="px-4 py-3 text-[#B0C4DE] whitespace-nowrap">{p.city}</td>
                    <td className="px-4 py-3 text-[#FFD700] font-semibold text-xs whitespace-nowrap">{formatCurrency(p.payment_amount ?? 0)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold" style={{ color: getPaymentStatusColor(p.payment_status) }}>
                        ● {getPaymentStatusLabel(p.payment_status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(p); setRejectNotes(""); }} className="text-[#00E5FF] hover:text-white transition-colors p-1">
                        <Eye size={15} />
                      </button>
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
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="modal-animate glass-card rounded-2xl border border-[#1E3A5F] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
              <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>
                DETAIL PESERTA
              </h3>
              <button onClick={() => setSelected(null)} className="text-[#B0C4DE] hover:text-white text-lg">✕</button>
            </div>
            <div className="p-5 space-y-4">
              {/* Info grid */}
              <div className="stagger-list grid grid-cols-2 gap-3">
                {[
                  { label: "No. Reg", value: selected.reg_number },
                  { label: "Nama", value: selected.full_name },
                  { label: "Email", value: selected.email },
                  { label: "HP", value: selected.phone },
                  { label: "Kategori", value: CATEGORY_LABELS[selected.category] ?? selected.category },
                  { label: "Jersey", value: selected.jersey_size },
                  { label: "BIB Name", value: selected.bib_name },
                  { label: "BIB No.", value: selected.bib_number ? `#${selected.bib_number}` : "-" },
                  { label: "Metode", value: selected.payment_method?.toUpperCase() ?? "-" },
                  { label: "Biaya", value: formatCurrency(selected.payment_amount ?? 0) },
                  { label: "Status", value: getPaymentStatusLabel(selected.payment_status) },
                  { label: "Kota", value: selected.city },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="text-[#B0C4DE] text-xs mb-0.5">{row.label}</div>
                    <div className="text-white text-sm font-medium">{row.value}</div>
                  </div>
                ))}
              </div>

              {/* Proof image */}
              {selected.payment_proof && (
                <div>
                  <div className="text-[#B0C4DE] text-xs mb-2">Bukti Pembayaran</div>
                  {selected.payment_proof.endsWith(".pdf") ? (
                    <a
                      href={selected.payment_proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#00E5FF] text-sm underline"
                    >
                      Lihat PDF Bukti Pembayaran
                    </a>
                  ) : (
                    <a href={selected.payment_proof} target="_blank" rel="noopener noreferrer">
                      <img src={selected.payment_proof} alt="Bukti bayar" className="w-full rounded-xl border border-[#1E3A5F] hover:border-[#00E5FF]/50 transition-colors" />
                    </a>
                  )}
                </div>
              )}

              {/* Rejection notes */}
              {selected.payment_status === "pending" && (
                <div>
                  <label className="block text-[#B0C4DE] text-xs mb-1.5">Catatan Penolakan (opsional)</label>
                  <textarea
                    className="neon-input w-full rounded-xl px-4 py-2 text-sm"
                    rows={2}
                    placeholder="Alasan penolakan..."
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                  />
                </div>
              )}

              {/* Actions */}
              {selected.payment_status === "pending" && (
                <div className="flex gap-3">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleVerify(selected.id, "verified")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all disabled:opacity-50"
                  >
                    <CheckCircle size={16} /> Verifikasi
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleVerify(selected.id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-[#FF006E] text-[#FF006E] hover:bg-[#FF006E]/10 transition-all disabled:opacity-50"
                  >
                    <XCircle size={16} /> Tolak
                  </button>
                </div>
              )}

              {selected.payment_status !== "pending" && (
                <div className="text-center">
                  <span className="text-sm font-semibold" style={{ color: getPaymentStatusColor(selected.payment_status) }}>
                    ● {getPaymentStatusLabel(selected.payment_status)}
                    {selected.verified_by && ` — by ${selected.verified_by}`}
                  </span>
                  {selected.rejection_reason && (
                    <p className="text-[#B0C4DE] text-xs mt-1">Catatan: {selected.rejection_reason}</p>
                  )}
                </div>
              )}

              {/* Resend email */}
              <button
                onClick={() => handleResendEmail(selected.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-[#1E3A5F] text-[#B0C4DE] hover:text-white hover:border-[#00E5FF]/50 transition-all"
              >
                <Mail size={14} /> Kirim Ulang Email Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
