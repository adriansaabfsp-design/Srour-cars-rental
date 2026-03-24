"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
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
  generateCarSlug,
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

  /* ── Fetch owner's cars ── */
  const fetchCars = async () => {
    if (!owner) return;
    try {
      const q = query(
        collection(db, "cars"),
        where("ownerId", "==", owner.id),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setCars(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Car[]);
    } catch (err) {
      console.error("Error fetching owner cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner && owner) fetchCars();
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

      const carData: Record<string, unknown> = {
        name: form.name,
        brand: form.brand,
        year: Number(form.year),
        price: Number(form.price),
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
        status: editingId ? undefined : "pending",
      };

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
      await fetchCars();
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Error saving car. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ── Edit car ── */
  const handleEdit = (car: Car) => {
    setForm({
      name: car.name,
      brand: car.brand,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      seats: car.seats,
      description: car.description,
      whatsapp: car.whatsapp,
      photos: car.photos || {
        main: car.images?.[0] || "",
        front: car.images?.[1] || "",
        back: car.images?.[2] || "",
        left: car.images?.[3] || "",
        right: car.images?.[4] || "",
      },
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
    setExistingGallery(car.gallery || []);
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
      await fetchCars();
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
  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              OWNER PORTAL
            </h1>
            <p className="mt-1 text-sm text-gray-900/30">
              Welcome, {owner?.displayName}
              {owner?.companyName ? ` — ${owner.companyName}` : ""}
            </p>
          </div>
          <button
            onClick={logout}
            className="border border-luxury-border px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-900/50 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            Log Out
          </button>
        </div>

        {/* Add Car Button */}
        <div className="mb-6 flex justify-end">
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
            className={`px-6 py-3 text-[12px] font-bold tracking-[0.15em] uppercase transition-all ${
              showForm
                ? "border border-luxury-border bg-luxury-card text-gray-900/50 hover:bg-luxury-dark"
                : "bg-navy text-white hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.25)]"
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
          <div className="mb-8 border border-luxury-border bg-luxury-card p-6">
            <h2 className="mb-6 text-lg font-bold text-gray-900">
              {editingId ? "Edit Car" : "Submit New Car"}
            </h2>
            <p className="mb-4 text-[11px] text-gray-500">
              {editingId
                ? "Update your car details below."
                : "New cars will be reviewed and approved by the admin before going live."}
            </p>

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
        )}

        {/* ── CAR LIST ── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin border-2 border-navy border-t-transparent" />
          </div>
        ) : cars.length === 0 ? (
          <div className="border border-luxury-border bg-luxury-card p-12 text-center">
            <p className="text-gray-900/30 text-sm">
              You haven&apos;t submitted any cars yet.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-navy px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-navy-light"
            >
              + Submit Your First Car
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900/40">
              My Cars ({cars.length})
            </h2>
            {cars.map((car) => (
              <div
                key={car.id}
                className="border border-luxury-border bg-luxury-card p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {(car.photos?.main || car.images?.[0]) && (
                    <img
                      src={car.photos?.main || car.images[0]}
                      alt={car.name}
                      className="h-20 w-28 flex-shrink-0 object-cover border border-luxury-border"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {car.name}
                      </h3>
                      {statusBadge(car.status)}
                      {car.available === false && (
                        <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-900/40 mt-0.5">
                      {car.brand} · {car.year} · ${car.price}/day
                    </p>
                    {car.status === "rejected" && (
                      <p className="mt-1 text-[11px] text-red-500">
                        This car was rejected by the admin. You may edit and
                        resubmit it.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        if (calendarCarId === car.id) {
                          setCalendarCarId(null);
                        } else {
                          setCalendarCarId(car.id);
                          setCalendarDates(car.blockedDates || []);
                        }
                      }}
                      className="border border-luxury-border px-3 py-1.5 text-[10px] font-bold uppercase text-gray-900/50 hover:bg-gray-50"
                      title="Manage availability calendar"
                    >
                      📅
                    </button>
                    <button
                      onClick={() => handleEdit(car)}
                      className="border border-luxury-border px-3 py-1.5 text-[10px] font-bold uppercase text-navy hover:bg-navy/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car)}
                      disabled={deleting === car.id}
                      className="border border-red-200 px-3 py-1.5 text-[10px] font-bold uppercase text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === car.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Calendar panel */}
                {calendarCarId === car.id && (
                  <div className="mt-4 border-t border-luxury-border pt-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-900/30">
                      Availability Calendar — click dates to block/unblock
                    </p>
                    <CarCalendar
                      blockedDates={calendarDates}
                      onChange={(dates) => {
                        setCalendarDates(dates);
                        saveBlockedDates(car.id, dates);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
