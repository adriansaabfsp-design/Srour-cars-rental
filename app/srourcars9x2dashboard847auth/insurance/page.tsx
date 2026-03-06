"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface InsuranceCompany {
  id: string;
  name: string;
  createdAt: number;
}

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

export default function InsurancePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [patients, setPatients] = useState<InsurancePatient[]>([]);
  const [loading, setLoading] = useState(true);

  // Company form
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [savingCompany, setSavingCompany] = useState(false);

  // Patient form
  const [showPatientForm, setShowPatientForm] = useState<string | null>(null); // companyId
  const [patientForm, setPatientForm] = useState({
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
  const [savingPatient, setSavingPatient] = useState(false);

  // Expanded company
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<string | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<string | null>(null);

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

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesSnap, patientsSnap] = await Promise.all([
        getDocs(query(collection(db, "insuranceCompanies"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "insurancePatients"), orderBy("createdAt", "desc"))),
      ]);
      setCompanies(
        companiesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as InsuranceCompany))
      );
      setPatients(
        patientsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as InsurancePatient))
      );
    } catch (err) {
      console.error("Error fetching insurance data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add company
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setSavingCompany(true);
    try {
      await addDoc(collection(db, "insuranceCompanies"), {
        name: newCompanyName.trim(),
        createdAt: Date.now(),
      });
      setNewCompanyName("");
      setShowCompanyForm(false);
      await fetchData();
    } catch (err) {
      console.error("Error adding company:", err);
      alert("Failed to add company.");
    } finally {
      setSavingCompany(false);
    }
  };

  // Delete company
  const handleDeleteCompany = async (company: InsuranceCompany) => {
    const companyPatients = patients.filter((p) => p.companyId === company.id);
    if (
      !confirm(
        `Delete "${company.name}"?${
          companyPatients.length > 0
            ? ` This will also delete ${companyPatients.length} patient(s).`
            : ""
        } This cannot be undone.`
      )
    )
      return;
    setDeletingCompany(company.id);
    try {
      // Delete all patients under this company
      for (const patient of companyPatients) {
        await deleteDoc(doc(db, "insurancePatients", patient.id));
      }
      await deleteDoc(doc(db, "insuranceCompanies", company.id));
      await fetchData();
    } catch (err) {
      console.error("Error deleting company:", err);
      alert("Failed to delete company.");
    } finally {
      setDeletingCompany(null);
    }
  };

  // Add patient
  const handleAddPatient = async (e: React.FormEvent, companyId: string) => {
    e.preventDefault();
    if (!patientForm.name.trim()) return;
    setSavingPatient(true);
    const company = companies.find((c) => c.id === companyId);
    try {
      await addDoc(collection(db, "insurancePatients"), {
        name: patientForm.name.trim(),
        phone: patientForm.phone.trim(),
        companyId,
        companyName: company?.name || "",
        sessionsTotal: Number(patientForm.sessionsTotal) || 0,
        sessionsUsed: Number(patientForm.sessionsUsed) || 0,
        policyNumber: patientForm.policyNumber.trim(),
        startDate: patientForm.startDate,
        endDate: patientForm.endDate,
        coverageType: patientForm.coverageType.trim(),
        notes: patientForm.notes.trim(),
        createdAt: Date.now(),
      });
      setPatientForm({
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
      setShowPatientForm(null);
      await fetchData();
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient.");
    } finally {
      setSavingPatient(false);
    }
  };

  // Delete patient
  const handleDeletePatient = async (patient: InsurancePatient) => {
    if (!confirm(`Delete patient "${patient.name}"? This cannot be undone.`)) return;
    setDeletingPatient(patient.id);
    try {
      await deleteDoc(doc(db, "insurancePatients", patient.id));
      await fetchData();
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient.");
    } finally {
      setDeletingPatient(null);
    }
  };

  const getCompanyPatients = (companyId: string) =>
    patients.filter((p) => p.companyId === companyId);

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

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/srourcars9x2dashboard847auth"
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-navy hover:text-navy-light transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Dashboard
              </Link>
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              INSURANCE COMPANIES
            </h1>
            <p className="mt-1 text-sm text-gray-900/30">
              Manage insurance companies & patient coverages
            </p>
          </div>
          <button
            onClick={() => setShowCompanyForm(!showCompanyForm)}
            className={`px-6 py-3 text-[12px] font-bold tracking-[0.15em] uppercase transition-all ${
              showCompanyForm
                ? "border border-luxury-border bg-luxury-card text-gray-900/50 hover:bg-luxury-dark"
                : "bg-navy text-white hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.25)]"
            }`}
          >
            {showCompanyForm ? "Cancel" : "+ Add Company"}
          </button>
        </div>

        {/* Add Company Form */}
        {showCompanyForm && (
          <form
            onSubmit={handleAddCompany}
            className="mb-8 border border-luxury-border bg-luxury-card p-6"
          >
            <h2 className="mb-4 font-serif text-lg font-bold text-gray-900">ADD INSURANCE COMPANY</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className={labelCls}>Company Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AXA, Allianz, MEDGULF..."
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className={inputCls}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingCompany}
                  className="bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light disabled:opacity-50"
                >
                  {savingCompany ? "Saving..." : "Add Company"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCompanyForm(false); setNewCompanyName(""); }}
                  className="border border-luxury-border bg-white px-6 py-3 text-[12px] font-bold text-gray-900/40 transition-colors hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Companies List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-luxury-border bg-luxury-card p-6">
                <div className="h-5 w-1/3 bg-luxury-border lux-pulse" />
                <div className="mt-2 h-3 w-1/5 bg-luxury-border lux-pulse" />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-luxury-border bg-luxury-card py-24">
            <svg className="h-16 w-16 text-gray-900/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
              NO INSURANCE COMPANIES
            </h3>
            <p className="mt-1 text-sm text-gray-900/30">
              Add your first insurance company
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => {
              const companyPatients = getCompanyPatients(company.id);
              const isExpanded = expandedCompany === company.id;

              return (
                <div
                  key={company.id}
                  className="border border-luxury-border bg-luxury-card transition-all hover:border-navy/20"
                >
                  {/* Company Header */}
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer"
                    onClick={() => setExpandedCompany(isExpanded ? null : company.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center border border-navy/20 bg-navy/5">
                        <svg className="h-5 w-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-gray-900">{company.name}</h3>
                        <p className="text-[11px] text-gray-900/30">
                          {companyPatients.length} patient{companyPatients.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCompany(company);
                        }}
                        disabled={deletingCompany === company.id}
                        className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {deletingCompany === company.id ? "..." : "Delete"}
                      </button>
                      <svg
                        className={`h-5 w-5 text-gray-900/30 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded: Patients List */}
                  {isExpanded && (
                    <div className="border-t border-luxury-border">
                      {/* Add Patient Button */}
                      <div className="flex items-center justify-between px-5 py-3 bg-luxury-dark/50">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900/25">
                          Patients under {company.name}
                        </span>
                        <button
                          onClick={() =>
                            setShowPatientForm(
                              showPatientForm === company.id ? null : company.id
                            )
                          }
                          className="text-[10px] font-bold uppercase tracking-wider text-navy hover:text-navy-light transition-colors"
                        >
                          {showPatientForm === company.id ? "Cancel" : "+ Add Patient"}
                        </button>
                      </div>

                      {/* Add Patient Form */}
                      {showPatientForm === company.id && (
                        <form
                          onSubmit={(e) => handleAddPatient(e, company.id)}
                          className="border-t border-luxury-border bg-luxury-dark/30 px-5 py-5"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className={labelCls}>Patient Name *</label>
                              <input
                                required
                                type="text"
                                placeholder="Full name"
                                value={patientForm.name}
                                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Phone</label>
                              <input
                                type="text"
                                placeholder="e.g. 96170123456"
                                value={patientForm.phone}
                                onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Policy Number</label>
                              <input
                                type="text"
                                placeholder="Policy #"
                                value={patientForm.policyNumber}
                                onChange={(e) => setPatientForm({ ...patientForm, policyNumber: e.target.value })}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Coverage Type</label>
                              <input
                                type="text"
                                placeholder="e.g. Full, Partial, Basic"
                                value={patientForm.coverageType}
                                onChange={(e) => setPatientForm({ ...patientForm, coverageType: e.target.value })}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Total Sessions</label>
                              <input
                                type="number"
                                min="0"
                                value={patientForm.sessionsTotal}
                                onChange={(e) => setPatientForm({ ...patientForm, sessionsTotal: Number(e.target.value) })}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Sessions Used</label>
                              <input
                                type="number"
                                min="0"
                                value={patientForm.sessionsUsed}
                                onChange={(e) => setPatientForm({ ...patientForm, sessionsUsed: Number(e.target.value) })}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Start Date</label>
                              <input
                                type="date"
                                value={patientForm.startDate}
                                onChange={(e) => setPatientForm({ ...patientForm, startDate: e.target.value })}
                                className={inputCls + " [color-scheme:light]"}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>End Date</label>
                              <input
                                type="date"
                                value={patientForm.endDate}
                                onChange={(e) => setPatientForm({ ...patientForm, endDate: e.target.value })}
                                className={inputCls + " [color-scheme:light]"}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className={labelCls}>Notes</label>
                              <textarea
                                rows={2}
                                placeholder="Additional notes..."
                                value={patientForm.notes}
                                onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                                className={inputCls}
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button
                              type="submit"
                              disabled={savingPatient}
                              className="bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light disabled:opacity-50"
                            >
                              {savingPatient ? "Saving..." : "Add Patient"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPatientForm(null)}
                              className="border border-luxury-border bg-white px-6 py-3 text-[12px] font-bold text-gray-900/40 transition-colors hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Patients */}
                      {companyPatients.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                          <p className="text-[11px] text-gray-900/25">
                            No patients registered under this company yet
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-luxury-border">
                          {companyPatients.map((patient) => {
                            const sessionsRemaining = Math.max(
                              0,
                              patient.sessionsTotal - patient.sessionsUsed
                            );
                            const sessionsPercent =
                              patient.sessionsTotal > 0
                                ? (patient.sessionsUsed / patient.sessionsTotal) * 100
                                : 0;

                            return (
                              <div
                                key={patient.id}
                                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-luxury-dark/30"
                              >
                                <Link
                                  href={`/srourcars9x2dashboard847auth/insurance/${patient.id}`}
                                  className="flex-1 min-w-0 group"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-luxury-border bg-white text-[11px] font-bold text-gray-900/40">
                                      {patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-serif font-bold text-gray-900 group-hover:text-navy transition-colors truncate">
                                        {patient.name}
                                      </h4>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        {patient.policyNumber && (
                                          <span className="text-[10px] text-gray-900/30">
                                            Policy: {patient.policyNumber}
                                          </span>
                                        )}
                                        <span
                                          className={`text-[10px] font-bold ${
                                            sessionsRemaining <= 0
                                              ? "text-red-400"
                                              : sessionsRemaining <= 3
                                              ? "text-amber-500"
                                              : "text-green-500"
                                          }`}
                                        >
                                          {sessionsRemaining} session{sessionsRemaining !== 1 ? "s" : ""} left
                                        </span>
                                        {/* Mini progress bar */}
                                        {patient.sessionsTotal > 0 && (
                                          <div className="hidden sm:block w-20 h-1.5 bg-luxury-border overflow-hidden">
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
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                                <div className="flex items-center gap-2 ml-3">
                                  <Link
                                    href={`/srourcars9x2dashboard847auth/insurance/${patient.id}`}
                                    className="border border-navy/30 bg-navy/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-navy transition-colors hover:bg-navy/20"
                                  >
                                    Coverage
                                  </Link>
                                  <button
                                    onClick={() => handleDeletePatient(patient)}
                                    disabled={deletingPatient === patient.id}
                                    className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                                  >
                                    {deletingPatient === patient.id ? "..." : "Delete"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
