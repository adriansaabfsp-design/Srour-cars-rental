"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  Car,
  BRANDS,
  FUEL_TYPES,
  TRANSMISSIONS,
  PHOTO_SLOTS,
  CarPhotos,
  PhotoSlotKey,
  CAR_CATEGORIES,
  ROAD_TYPES,
  TRIP_CATEGORIES,
  CAR_FEATURES,
} from "@/lib/types";
import { useOwner } from "@/components/OwnerContext";
import CarCalendar from "@/components/CarCalendar";

/* ── styles (same as admin) ── */
const inputCls =
  "w-full border border-luxury-border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-navy focus:ring-1 focus:ring-navy/20";
const labelCls =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/35";

const EMPTY_FORM = {
  name: "",
  brand: "Toyota",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel: "Petrol",
  transmission: "Automatic",
  seats: 5,
  description: "",
  whatsapp: "",
  photos: { main: "", front: "", back: "", left: "", right: "" } as CarPhotos,
  available: true,
  videoUrl: "",
  category: "Sedan",
  roadTypes: [] as string[],
  tripCategory: "None",
  features: [] as string[],
  customFeature: "",
  minDays: 1,
  blockedDates: [] as string[],
};

export default function OwnerPortalPage() {
  const { isOwner, owner, login, signup, logout } = useOwner();

  /* ── Auth state ── */
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    password: "",
    displayName: "",
    companyName: "",
    phone: "",
    email: "",
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  /* ── Dashboard state ── */
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<
    Partial<Record<PhotoSlotKey, File>>
  >({});
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [calendarCarId, setCalendarCarId] = useState<string | null>(null);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);

  const brandsWithoutAll = BRANDS.filter((b) => b !== "All");

  useEffect(() => {
    if (!isOwner || !owner) {
      setCars([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(collection(db, "cars"), where("ownerId", "==", owner.id));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const nextCars = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Car[];
        nextCars.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setCars(nextCars);
        setLoading(false);
      },
      (err) => {
        console.error("Error subscribing to owner cars:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOwner, owner]);

  /* ── Auth handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const err = await login(loginForm.username, loginForm.password);
    if (err) setAuthError(err);
    setAuthLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const err = await signup(signupForm);
    if (err) setAuthError(err);
    setAuthLoading(false);
  };

  /* ── Upload helpers ── */
  const uploadPhoto = async (file: File, slotKey: string): Promise<string> => {
    const storageRef = ref(
      storage,
      `cars/${Date.now()}-${slotKey}-${file.name}`
    );
    const snap = await uploadBytes(storageRef, file);
    return getDownloadURL(snap.ref);
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `videos/${Date.now()}-${file.name}`);
    const snap = await uploadBytes(storageRef, file);
    return getDownloadURL(snap.ref);
  };

  /* ── Submit car ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner) return;
    setUploading(true);

    try {
      const photos = { ...form.photos };
      for (const [key, file] of Object.entries(photoFiles)) {
        if (file) {
          photos[key as PhotoSlotKey] = await uploadPhoto(file, key);
        }
      }

      const imageUrls = [
        photos.main,
        photos.front,
        photos.back,
        photos.left,
        photos.right,
      ].filter(Boolean) as string[];

      const galleryUrls = [...existingGallery];
      for (const file of galleryFiles) {
        const url = await uploadPhoto(file, "gallery");
        galleryUrls.push(url);
      }

      let videoUrl = form.videoUrl;
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
      }

      const priceNum = Number(form.price);
      const existing = editingId ? cars.find((c) => c.id === editingId) : null;
      const priorOwnerPrice = existing?.ownerPrice ?? existing?.price;
      const priceChanged = editingId && priorOwnerPrice !== priceNum;
      const now = Date.now();

      let carData: Record<string, unknown>;

      if (editingId) {
        // Edit flow — only owner-side fields are updated. Public fields (price, description,
        // photos, gallery, name, etc.) stay frozen at whatever admin has set.
        carData = {
          ownerPrice: priceNum,
          ownerDescription: form.description,
          ownerPhotos: photos,
          ownerGallery: galleryUrls,
          whatsapp: form.whatsapp, // owner contact (admin reference only)
          blockedDates: form.blockedDates,
          ownerPriceUpdatedAt: priceChanged ? now : undefined,
        };
      } else {
        // New submission — public and owner-side fields start mirrored; admin can diverge later.
        carData = {
          name: form.name,
          brand: form.brand,
          year: Number(form.year),
          price: priceNum,
          mileage: Number(form.mileage),
          fuel: form.fuel,
          transmission: form.transmission,
          seats: Number(form.seats),
          description: form.description,
          whatsapp: form.whatsapp,
          images: imageUrls,
          photos,
          available: form.available,
          videoUrl: videoUrl || "",
          category: form.category,
          roadTypes: form.roadTypes,
          tripCategory: form.tripCategory === "None" ? "" : form.tripCategory,
          features: form.features,
          minDays: Number(form.minDays) || 1,
          gallery: galleryUrls,
          blockedDates: form.blockedDates,
          ownerId: owner.id,
          ownerName: owner.displayName,
          status: "pending",
          ownerPrice: priceNum,
          ownerDescription: form.description,
          ownerPhotos: photos,
          ownerGallery: galleryUrls,
          ownerPriceReviewedAt: now,
        };
      }

      const cleanData = Object.fromEntries(
        Object.entries(carData).filter(([, v]) => v !== undefined)
      );

      if (editingId) {
        await updateDoc(doc(db, "cars", editingId), cleanData);
      } else {
        await addDoc(collection(db, "cars"), {
          ...cleanData,
          createdAt: Date.now(),
        });
      }

      setForm(EMPTY_FORM);
      setPhotoFiles({});
      setGalleryFiles([]);
      setExistingGallery([]);
      setVideoFile(null);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Error saving car. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ── Edit car ── */
  const handleEdit = (car: Car) => {
    // Owner always sees their own submitted version — never admin's public edits.
    const ownerPhotos = car.ownerPhotos || car.photos || {
      main: car.images?.[0] || "",
      front: car.images?.[1] || "",
      back: car.images?.[2] || "",
      left: car.images?.[3] || "",
      right: car.images?.[4] || "",
    };
    setForm({
      name: car.name,
      brand: car.brand,
      year: car.year,
      price: car.ownerPrice ?? car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      seats: car.seats,
      description: car.ownerDescription ?? car.description,
      whatsapp: car.whatsapp,
      photos: ownerPhotos,
      available: car.available !== false,
      videoUrl: car.videoUrl || "",
      category: car.category || "Sedan",
      roadTypes: car.roadTypes || [],
      tripCategory: car.tripCategory || "None",
      features: car.features || [],
      customFeature: "",
      minDays: car.minDays || 1,
      blockedDates: car.blockedDates || [],
    });
    setEditingId(car.id);
    setPhotoFiles({});
    setGalleryFiles([]);
    setExistingGallery(car.ownerGallery ?? car.gallery ?? []);
    setVideoFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Delete car ── */
  const handleDelete = async (car: Car) => {
    if (!confirm(`Delete "${car.name}"? This cannot be undone.`)) return;
    setDeleting(car.id);
    try {
      if (car.photos) {
        for (const url of Object.values(car.photos)) {
          if (url) {
            try {
              await deleteObject(ref(storage, url));
            } catch {}
          }
        }
      }
      if (car.videoUrl) {
        try {
          await deleteObject(ref(storage, car.videoUrl));
        } catch {}
      }
      if (car.gallery) {
        for (const url of car.gallery) {
          try {
            await deleteObject(ref(storage, url));
          } catch {}
        }
      }
      await deleteDoc(doc(db, "cars", car.id));
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting car.");
    } finally {
      setDeleting(null);
    }
  };

  /* ── Calendar save ── */
  const saveBlockedDates = async (carId: string, dates: string[]) => {
    try {
      await updateDoc(doc(db, "cars", carId), { blockedDates: dates });
      setCars((prev) =>
        prev.map((c) => (c.id === carId ? { ...c, blockedDates: dates } : c))
      );
    } catch (err) {
      console.error("Error updating blocked dates:", err);
    }
  };

  /* ── Remove photo slot ── */
  const removePhoto = (key: PhotoSlotKey) => {
    setForm((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: "" },
    }));
    setPhotoFiles((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  /* ── Status badge ── */
  const statusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-block rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-700">
            Pending
          </span>
        );
    }
  };

  /* ────────────────────────── AUTH SCREEN ────────────────────────── */
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="border border-luxury-border bg-luxury-card p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-navy/30 bg-navy/5">
                  <svg
                    className="h-6 w-6 text-navy"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">
                  OWNER PORTAL
                </h1>
                <p className="mt-1 text-[11px] text-gray-900/30">
                  Submit &amp; manage your car listings
                </p>
              </div>

              {/* Tabs */}
              <div className="mb-6 flex gap-1 border-b border-luxury-border">
                <button
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError("");
                  }}
                  className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                    authTab === "login"
                      ? "border-b-2 border-navy text-navy"
                      : "text-gray-900/40 hover:text-gray-900/60"
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthTab("signup");
                    setAuthError("");
                  }}
                  className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                    authTab === "signup"
                      ? "border-b-2 border-navy text-navy"
                      : "text-gray-900/40 hover:text-gray-900/60"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {authError && (
                <div className="mb-4 border border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-600">
                  {authError}
                </div>
              )}

              {authTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={labelCls}>Username</label>
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, username: e.target.value })
                      }
                      className={inputCls}
                      placeholder="Your username"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      className={inputCls}
                      placeholder="Your password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-navy py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light disabled:opacity-50"
                  >
                    {authLoading ? "Logging in..." : "Log In"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Username</label>
                      <input
                        type="text"
                        value={signupForm.username}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            username: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="Choose username"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Password</label>
                      <input
                        type="password"
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            password: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="Min 6 characters"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Display Name</label>
                    <input
                      type="text"
                      value={signupForm.displayName}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          displayName: e.target.value,
                        })
                      }
                      className={inputCls}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Company Name (optional)</label>
                    <input
                      type="text"
                      value={signupForm.companyName}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          companyName: e.target.value,
                        })
                      }
                      className={inputCls}
                      placeholder="Rental company name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input
                        type="tel"
                        value={signupForm.phone}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            phone: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="+961..."
                        required
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email (optional)</label>
                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            email: e.target.value,
                          })
                        }
                        className={inputCls}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-navy py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light disabled:opacity-50"
                  >
                    {authLoading ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────── DASHBOARD ────────────────────────── */
  const totalCars = cars.length;
  const approvedCount = cars.filter((c) => c.status === "approved").length;
  const pendingCount = cars.filter((c) => !c.status || c.status === "pending").length;
  const unavailableCount = cars.filter((c) => c.available === false).length;

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ─── Header band ─── */}
      <section className="relative overflow-hidden border-b border-luxury-border bg-luxury-card">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-navy blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-navy blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-navy" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy sm:text-[11px]">
                  Owner Portal
                </p>
              </div>
              <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-gray-900 sm:text-5xl">
                Welcome, {owner?.displayName?.split(" ")[0] || "Owner"}.
              </h1>
              <p className="mt-2 text-sm text-gray-900/40 sm:text-base">
                {owner?.companyName ? `${owner.companyName} · ` : ""}
                {owner?.phone ? `${owner.phone} · ` : ""}
                Submit &amp; manage your fleet.
              </p>
            </div>
            <button
              onClick={logout}
              className="self-start rounded-sm border border-luxury-border bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900/60 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:self-auto"
            >
              Log Out
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-12 sm:grid-cols-4 sm:gap-3">
            {[
              { label: "Total Listings", value: totalCars },
              { label: "Approved", value: approvedCount },
              { label: "Pending Review", value: pendingCount },
              { label: "Unavailable", value: unavailableCount },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-sm border border-luxury-border bg-white px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-900/40 sm:text-[10px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* My Listings action bar */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-navy" />
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-navy">
                My Listings
              </p>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              {editingId ? "Editing Car" : showForm ? "New Submission" : `${totalCars} Car${totalCars === 1 ? "" : "s"}`}
            </h2>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setForm(EMPTY_FORM);
                setEditingId(null);
                setPhotoFiles({});
                setVideoFile(null);
                setGalleryFiles([]);
                setExistingGallery([]);
              }
            }}
            className={`rounded-sm px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all sm:px-7 sm:py-3.5 sm:text-[12px] ${
              showForm
                ? "border border-luxury-border bg-white text-gray-900/60 hover:border-gray-400 hover:text-gray-900"
                : "bg-navy text-white shadow-lg shadow-navy/20 hover:bg-navy-light hover:shadow-navy/30"
            }`}
          >
            {showForm
              ? "Cancel"
              : editingId
              ? "Cancel Edit"
              : "+ Submit New Car"}
          </button>
        </div>

        {/* ── CAR FORM ── */}
        {showForm && (
          <div className="mb-10 overflow-hidden rounded-sm border border-luxury-border bg-luxury-card">
            <div className="border-b border-luxury-border bg-white px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-navy" />
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-navy">
                  {editingId ? "Editing" : "New Submission"}
                </p>
              </div>
              <h2 className="mt-2 font-serif text-xl font-bold text-gray-900 sm:text-2xl">
                {editingId ? "Update Car Details" : "Submit Your Car"}
              </h2>
              <p className="mt-1.5 text-[12px] text-gray-900/40 sm:text-sm">
                {editingId
                  ? "Changes apply immediately. Availability changes may require admin review."
                  : "Your listing will be reviewed and approved within 24 hours before going live."}
              </p>
            </div>
            <div className="p-6 sm:p-8">

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Name / Brand / Year */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Car Name *</label>
                  <input
                    className={inputCls}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                    placeholder="e.g. Corolla 2024"
                  />
                </div>
                <div>
                  <label className={labelCls}>Brand *</label>
                  <select
                    className={inputCls}
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                  >
                    {brandsWithoutAll.map((b) => (
                      <option key={b} value={b} className="text-gray-900 bg-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Year *</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.year}
                    onChange={(e) =>
                      setForm({ ...form, year: Number(e.target.value) })
                    }
                    min={2000}
                    max={2030}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Price / Min Days / Mileage */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Price / Day (USD) *</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.price || ""}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Min Rental Days</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.minDays}
                    onChange={(e) =>
                      setForm({ ...form, minDays: Number(e.target.value) })
                    }
                    min={1}
                  />
                </div>
                <div>
                  <label className={labelCls}>Mileage (km)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.mileage || ""}
                    onChange={(e) =>
                      setForm({ ...form, mileage: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              {/* Row 3: Fuel / Transmission / Seats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Fuel Type</label>
                  <select
                    className={inputCls}
                    value={form.fuel}
                    onChange={(e) =>
                      setForm({ ...form, fuel: e.target.value })
                    }
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f} className="text-gray-900 bg-white">
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Transmission</label>
                  <select
                    className={inputCls}
                    value={form.transmission}
                    onChange={(e) =>
                      setForm({ ...form, transmission: e.target.value })
                    }
                  >
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t} className="text-gray-900 bg-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Seats</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.seats}
                    onChange={(e) =>
                      setForm({ ...form, seats: Number(e.target.value) })
                    }
                    min={1}
                    max={20}
                  />
                </div>
              </div>

              {/* Category / Trip Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    className={inputCls}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {CAR_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c} className="text-gray-900 bg-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Trip Category</label>
                  <select
                    className={inputCls}
                    value={form.tripCategory}
                    onChange={(e) =>
                      setForm({ ...form, tripCategory: e.target.value })
                    }
                  >
                    {TRIP_CATEGORIES.map((t) => (
                      <option key={t} value={t} className="text-gray-900 bg-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Road Types */}
              <div>
                <label className={labelCls}>Road Types</label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {ROAD_TYPES.map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          roadTypes: prev.roadTypes.includes(rt)
                            ? prev.roadTypes.filter((r) => r !== rt)
                            : [...prev.roadTypes, rt],
                        }))
                      }
                      className={`border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                        form.roadTypes.includes(rt)
                          ? "border-navy bg-navy/10 text-navy"
                          : "border-luxury-border text-gray-900/40 hover:text-gray-900/60"
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className={labelCls}>
                  Car Features ({form.features.length} selected)
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {CAR_FEATURES.map((feat) => (
                    <button
                      key={feat}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          features: prev.features.includes(feat)
                            ? prev.features.filter((f) => f !== feat)
                            : [...prev.features, feat],
                        }))
                      }
                      className={`border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        form.features.includes(feat)
                          ? "border-navy bg-navy/10 text-navy"
                          : "border-luxury-border text-gray-900/30 hover:text-gray-900/50"
                      }`}
                    >
                      {feat}
                    </button>
                  ))}
                </div>
                {/* Custom feature */}
                <div className="mt-2 flex gap-2">
                  <input
                    className={inputCls + " flex-1"}
                    value={form.customFeature}
                    onChange={(e) =>
                      setForm({ ...form, customFeature: e.target.value })
                    }
                    placeholder="Add custom feature…"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = form.customFeature.trim();
                      if (val && !form.features.includes(val)) {
                        setForm((prev) => ({
                          ...prev,
                          features: [...prev.features, val],
                          customFeature: "",
                        }));
                      }
                    }}
                    className="border border-navy px-3 text-[11px] font-bold text-navy hover:bg-navy/5"
                  >
                    Add
                  </button>
                </div>
                {/* Show custom features as removable tags */}
                {form.features
                  .filter(
                    (f) => !CAR_FEATURES.includes(f as (typeof CAR_FEATURES)[number])
                  )
                  .map((f) => (
                    <span
                      key={f}
                      className="mt-1.5 mr-1.5 inline-flex items-center gap-1 border border-navy/30 bg-navy/5 px-2 py-0.5 text-[10px] text-navy"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            features: prev.features.filter((x) => x !== f),
                          }))
                        }
                        className="ml-0.5 text-navy/50 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>

              {/* WhatsApp */}
              <div>
                <label className={labelCls}>WhatsApp Number</label>
                <input
                  className={inputCls}
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, whatsapp: e.target.value })
                  }
                  placeholder="+961..."
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className={labelCls}>Video (optional)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-900/50 file:mr-3 file:border file:border-luxury-border file:bg-white file:px-3 file:py-2 file:text-[11px] file:font-medium file:text-gray-900/60"
                />
                {form.videoUrl && !videoFile && (
                  <p className="mt-1 text-[10px] text-green-600">
                    ✓ Video already uploaded
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  className={inputCls + " h-24 resize-none"}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe your car…"
                />
              </div>

              {/* Available toggle */}
              <div className="flex items-center gap-3">
                <label className={labelCls + " mb-0"}>Available</label>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, available: !form.available })
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.available ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.available ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Photos */}
              <div>
                <label className={labelCls}>Photos</label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {PHOTO_SLOTS.map(({ key, label, required: req }) => (
                    <div
                      key={key}
                      className="border border-luxury-border bg-white p-2"
                    >
                      <p className="mb-1 text-[9px] font-bold uppercase text-gray-900/30">
                        {label}
                        {req ? " *" : ""}
                      </p>
                      {form.photos[key] || photoFiles[key] ? (
                        <div className="relative">
                          <img
                            src={
                              photoFiles[key]
                                ? URL.createObjectURL(photoFiles[key]!)
                                : form.photos[key]
                            }
                            alt={label}
                            className="h-20 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(key)}
                            className="absolute right-0 top-0 bg-red-500 px-1.5 text-[10px] text-white"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-20 cursor-pointer items-center justify-center border border-dashed border-luxury-border text-[10px] text-gray-900/20 hover:bg-gray-50">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f)
                                setPhotoFiles((prev) => ({
                                  ...prev,
                                  [key]: f,
                                }));
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <label className={labelCls}>
                  Gallery ({existingGallery.length + galleryFiles.length} images)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setGalleryFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files || []),
                    ])
                  }
                  className="block w-full text-sm text-gray-900/50 file:mr-3 file:border file:border-luxury-border file:bg-white file:px-3 file:py-2 file:text-[11px] file:font-medium file:text-gray-900/60"
                />
                {(existingGallery.length > 0 || galleryFiles.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {existingGallery.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Gallery ${i + 1}`}
                          className="h-16 w-16 object-cover border border-luxury-border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setExistingGallery((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {galleryFiles.map((f, i) => (
                      <div key={`new-${i}`} className="relative">
                        <img
                          src={URL.createObjectURL(f)}
                          alt={`New ${i + 1}`}
                          className="h-16 w-16 object-cover border border-navy/30"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setGalleryFiles((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Calendar for blocked dates (only on edit) */}
              {editingId && (
                <div>
                  <label className={labelCls}>
                    Blocked Dates (click dates to block/unblock)
                  </label>
                  <CarCalendar
                    blockedDates={form.blockedDates}
                    onChange={(dates) =>
                      setForm({ ...form, blockedDates: dates })
                    }
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-navy py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : editingId
                  ? "Update Car"
                  : "Submit Car for Review"}
              </button>
            </form>
            </div>
          </div>
        )}

        {/* ── CAR LIST ── */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-sm border border-luxury-border bg-luxury-card p-5">
                <div className="flex gap-4">
                  <div className="h-24 w-32 rounded-sm bg-luxury-border lux-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-2/3 rounded-sm bg-luxury-border lux-pulse" />
                    <div className="h-3 w-1/2 rounded-sm bg-luxury-border lux-pulse" />
                    <div className="h-3 w-1/3 rounded-sm bg-luxury-border lux-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="rounded-sm border border-dashed border-luxury-border bg-luxury-card px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-navy/20 bg-navy/5">
              <svg className="h-6 w-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
              </svg>
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">
              No listings yet
            </h3>
            <p className="mt-1.5 text-sm text-gray-900/40">
              Submit your first car and it&apos;ll be reviewed within 24 hours.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-sm bg-navy px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-navy-light hover:shadow-lg hover:shadow-navy/25"
            >
              + Submit Your First Car
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cars.map((car) => {
              // Owner view: always show owner-submitted values, never admin's public edits.
              const ownerPrice = car.ownerPrice ?? car.price;
              const ownerPhotosMain = car.ownerPhotos?.main;
              const thumb = ownerPhotosMain || car.photos?.main || car.images?.[0];
              return (
                <div
                  key={car.id}
                  className={`group relative flex flex-col overflow-hidden rounded-sm border bg-luxury-card transition-all hover:border-navy/30 hover:shadow-lg hover:shadow-black/5 ${
                    car.available === false ? "border-red-500/20" : "border-luxury-border"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={car.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-900/10">
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V9a2 2 0 012-2h3l2-3h4l2 3h3a2 2 0 012 2v7.5M3 16.5A1.5 1.5 0 004.5 18h15a1.5 1.5 0 001.5-1.5M3 16.5v.25" />
                        </svg>
                      </div>
                    )}
                    {/* Status chips overlay */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {statusBadge(car.status)}
                      {car.available === false && (
                        <span className="inline-block rounded bg-gray-900/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-navy/60">
                          {car.brand} · {car.year}
                        </p>
                        <h3 className="mt-1 truncate font-serif text-lg font-bold text-gray-900">
                          {car.name}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-serif text-xl font-bold text-gray-900">
                          ${ownerPrice}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-900/30">
                          / day
                        </p>
                      </div>
                    </div>

                    {car.status === "rejected" && (
                      <div className="mt-3 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
                        Rejected by admin. Edit and resubmit for review.
                      </div>
                    )}
                    {(!car.status || car.status === "pending") && (
                      <div className="mt-3 rounded-sm border border-yellow-200 bg-yellow-50 px-3 py-2 text-[11px] text-yellow-800">
                        Awaiting admin review. You&apos;ll see it on the site once approved.
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-luxury-border pt-4">
                      <a
                        href={`/manage-calendar/${car.id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-luxury-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-900/60 transition-colors hover:border-navy/40 hover:bg-navy/5 hover:text-navy"
                        title="Manage availability calendar"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendar
                      </a>
                      <button
                        onClick={() => handleEdit(car)}
                        className="flex items-center gap-1.5 rounded-sm border border-navy/30 bg-navy/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-navy transition-colors hover:bg-navy/10"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car)}
                        disabled={deleting === car.id}
                        className="flex items-center gap-1.5 rounded-sm border border-red-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                        </svg>
                        {deleting === car.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
