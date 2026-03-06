"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";

interface InsurancePatient {
  id: string;
  name: string;
  phone: string;
  companyId: string;
  companyName: string;
  sessionsTotal: number;
  sessionsUsed: number;
  policyNumber: string;
  startDate: string;
  endDate: string;
  coverageType: string;
  notes: string;
  createdAt: number;
}

const inputCls =
  "w-full border border-luxury-border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-navy focus:ring-1 focus:ring-navy/20";
const labelCls =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/35";

export default function PatientCoveragePage() {
  const params = useParams();
  const patientId = params.patientId as string;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [patient, setPatient] = useState<InsurancePatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable form
  const [form, setForm] = useState({
    name: "",
    phone: "",
    sessionsTotal: 0,
    sessionsUsed: 0,
    policyNumber: "",
    startDate: "",
    endDate: "",
    coverageType: "",
    notes: "",
  });

  // Auth
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "1") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "srourcars@rentals") {
      setIsAuthenticated(true);
      setAuthError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_auth", "1");
      }
    } else {
      setAuthError(true);
    }
  };

  // Fetch patient
  useEffect(() => {
    if (isAuthenticated && patientId) {
      fetchPatient();
    }
  }, [isAuthenticated, patientId]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "insurancePatients", patientId));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as InsurancePatient;
        setPatient(data);
        setForm({
          name: data.name,
          phone: data.phone || "",
          sessionsTotal: data.sessionsTotal || 0,
          sessionsUsed: data.sessionsUsed || 0,
          policyNumber: data.policyNumber || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          coverageType: data.coverageType || "",
          notes: data.notes || "",
        });
      }
    } catch (err) {
      console.error("Error fetching patient:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patient) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "insurancePatients", patient.id), {
        name: form.name.trim(),
        phone: form.phone.trim(),
        sessionsTotal: Number(form.sessionsTotal) || 0,
        sessionsUsed: Number(form.sessionsUsed) || 0,
        policyNumber: form.policyNumber.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        coverageType: form.coverageType.trim(),
        notes: form.notes.trim(),
      });
      await fetchPatient();
      setEditing(false);
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="border border-luxury-border bg-luxury-card p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-navy/30 bg-navy/5">
                  <svg className="h-6 w-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">ADMIN ACCESS</h1>
                <p className="mt-1 text-[11px] text-gray-900/30">Enter password to continue</p>
              </div>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                  placeholder="Password"
                  autoFocus
                  className={`w-full border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-navy focus:ring-1 focus:ring-navy/20 ${
                    authError ? "border-red-500/50" : "border-luxury-border"
                  }`}
                />
                {authError && (
                  <p className="mt-2 text-[11px] text-red-400">Incorrect password</p>
                )}
                <button
                  type="submit"
                  className="mt-4 w-full bg-navy py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.25)]"
                >
                  Enter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-luxury-border lux-pulse" />
            <div className="border border-luxury-border bg-luxury-card p-8">
              <div className="h-8 w-1/2 bg-luxury-border lux-pulse" />
              <div className="mt-4 h-4 w-1/3 bg-luxury-border lux-pulse" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 bg-luxury-border lux-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center border border-luxury-border bg-luxury-card py-24">
            <svg className="h-16 w-16 text-gray-900/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
              PATIENT NOT FOUND
            </h3>
            <p className="mt-1 text-sm text-gray-900/30">
              This patient record may have been deleted
            </p>
            <Link
              href="/srourcars9x2dashboard847auth/insurance"
              className="mt-6 bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light"
            >
              Back to Insurance
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sessionsRemaining = Math.max(0, patient.sessionsTotal - patient.sessionsUsed);
  const sessionsPercent =
    patient.sessionsTotal > 0
      ? (patient.sessionsUsed / patient.sessionsTotal) * 100
      : 0;
  const isExpired = patient.endDate && new Date(patient.endDate + "T00:00:00") < new Date();
  const daysUntilExpiry = patient.endDate
    ? Math.ceil(
        (new Date(patient.endDate + "T00:00:00").getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Link
            href="/srourcars9x2dashboard847auth"
            className="text-gray-900/30 hover:text-navy transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-gray-900/15">/</span>
          <Link
            href="/srourcars9x2dashboard847auth/insurance"
            className="text-gray-900/30 hover:text-navy transition-colors"
          >
            Insurance
          </Link>
          <span className="text-gray-900/15">/</span>
          <span className="text-navy">{patient.name}</span>
        </div>

        {/* Patient Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              {patient.name}
            </h1>
            <p className="mt-1 text-sm text-gray-900/30">
              {patient.companyName} &middot; Patient Coverage Details
            </p>
          </div>
          <button
            onClick={() => {
              if (editing) {
                // Reset form
                setForm({
                  name: patient.name,
                  phone: patient.phone || "",
                  sessionsTotal: patient.sessionsTotal || 0,
                  sessionsUsed: patient.sessionsUsed || 0,
                  policyNumber: patient.policyNumber || "",
                  startDate: patient.startDate || "",
                  endDate: patient.endDate || "",
                  coverageType: patient.coverageType || "",
                  notes: patient.notes || "",
                });
              }
              setEditing(!editing);
            }}
            className={`px-6 py-3 text-[12px] font-bold tracking-[0.15em] uppercase transition-all ${
              editing
                ? "border border-luxury-border bg-luxury-card text-gray-900/50 hover:bg-luxury-dark"
                : "bg-navy text-white hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.25)]"
            }`}
          >
            {editing ? "Cancel" : "Edit Details"}
          </button>
        </div>

        {/* Status Cards Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Sessions Remaining */}
          <div className="border border-luxury-border bg-luxury-card p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">
              Sessions Left
            </p>
            <p
              className={`mt-2 font-serif text-3xl font-bold ${
                sessionsRemaining <= 0
                  ? "text-red-400"
                  : sessionsRemaining <= 3
                  ? "text-amber-500"
                  : "text-green-500"
              }`}
            >
              {sessionsRemaining}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-900/30">
              of {patient.sessionsTotal} total
            </p>
            {/* Progress bar */}
            <div className="mt-3 h-2 w-full overflow-hidden bg-luxury-border">
              <div
                className={`h-full transition-all ${
                  sessionsPercent >= 100
                    ? "bg-red-400"
                    : sessionsPercent >= 75
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, sessionsPercent)}%` }}
              />
            </div>
          </div>

          {/* Sessions Used */}
          <div className="border border-luxury-border bg-luxury-card p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">
              Sessions Used
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-gray-900">
              {patient.sessionsUsed}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-900/30">
              {sessionsPercent.toFixed(0)}% used
            </p>
          </div>

          {/* Coverage Status */}
          <div className="border border-luxury-border bg-luxury-card p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">
              Status
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isExpired
                    ? "bg-red-400"
                    : sessionsRemaining <= 0
                    ? "bg-red-400"
                    : "bg-green-500"
                }`}
              />
              <span
                className={`font-serif text-lg font-bold ${
                  isExpired || sessionsRemaining <= 0
                    ? "text-red-400"
                    : "text-green-500"
                }`}
              >
                {isExpired ? "Expired" : sessionsRemaining <= 0 ? "Depleted" : "Active"}
              </span>
            </div>
            {daysUntilExpiry !== null && !isExpired && (
              <p className="mt-0.5 text-[10px] text-gray-900/30">
                {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""} remaining
              </p>
            )}
          </div>

          {/* Coverage Type */}
          <div className="border border-luxury-border bg-luxury-card p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">
              Coverage Type
            </p>
            <p className="mt-2 font-serif text-lg font-bold text-gray-900">
              {patient.coverageType || "—"}
            </p>
            {patient.policyNumber && (
              <p className="mt-0.5 text-[10px] text-gray-900/30">
                Policy: {patient.policyNumber}
              </p>
            )}
          </div>
        </div>

        {/* Details Section */}
        {editing ? (
          <div className="border border-luxury-border bg-luxury-card p-6 sm:p-8">
            <h2 className="mb-6 font-serif text-xl font-bold text-gray-900">EDIT COVERAGE DETAILS</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Patient Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Policy Number</label>
                <input
                  type="text"
                  value={form.policyNumber}
                  onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Coverage Type</label>
                <input
                  type="text"
                  value={form.coverageType}
                  onChange={(e) => setForm({ ...form, coverageType: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Total Sessions</label>
                <input
                  type="number"
                  min="0"
                  value={form.sessionsTotal}
                  onChange={(e) => setForm({ ...form, sessionsTotal: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Sessions Used</label>
                <input
                  type="number"
                  min="0"
                  value={form.sessionsUsed}
                  onChange={(e) => setForm({ ...form, sessionsUsed: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className={inputCls + " [color-scheme:light]"}
                />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className={inputCls + " [color-scheme:light]"}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.3)] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border border-luxury-border bg-white px-6 py-3 text-[12px] font-bold text-gray-900/40 transition-colors hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-luxury-border bg-luxury-card p-6 sm:p-8">
            <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900/40">
              Coverage Information
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Patient Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">Patient Name</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">Phone</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm text-gray-900">{patient.phone || "—"}</p>
                    {patient.phone && (
                      <a
                        href={`https://wa.me/${patient.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-500 transition-colors hover:bg-green-500/20"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                        </svg>
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">Insurance Company</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{patient.companyName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">Policy Number</p>
                  <p className="mt-1 text-sm text-gray-900">{patient.policyNumber || "—"}</p>
                </div>
              </div>

              {/* Coverage Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">Coverage Type</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{patient.coverageType || "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">Sessions</p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="font-bold">{patient.sessionsUsed}</span> used of{" "}
                    <span className="font-bold">{patient.sessionsTotal}</span> total &middot;{" "}
                    <span
                      className={`font-bold ${
                        sessionsRemaining <= 0
                          ? "text-red-400"
                          : sessionsRemaining <= 3
                          ? "text-amber-500"
                          : "text-green-500"
                      }`}
                    >
                      {sessionsRemaining} remaining
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25">Coverage Period</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {patient.startDate
                      ? new Date(patient.startDate + "T00:00:00").toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}{" "}
                    →{" "}
                    {patient.endDate
                      ? new Date(patient.endDate + "T00:00:00").toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                  {isExpired && (
                    <p className="mt-1 text-[10px] font-bold text-red-400">Coverage has expired</p>
                  )}
                  {!isExpired && daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
                    <p className="mt-1 text-[10px] font-bold text-amber-500">
                      Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {patient.notes && (
              <div className="mt-6 border-t border-luxury-border pt-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/25 mb-2">Notes</p>
                <p className="text-sm text-gray-900/60 whitespace-pre-wrap">{patient.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
