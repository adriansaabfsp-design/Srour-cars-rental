"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  orderBy,
  query,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Car, BRANDS, FUEL_TYPES, TRANSMISSIONS, PHOTO_SLOTS, CarPhotos, PhotoSlotKey, RentalRecord, CAR_CATEGORIES, ROAD_TYPES } from "@/lib/types";

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
  whatsapp: "961",
  photos: { main: "", front: "", back: "", left: "", right: "" } as CarPhotos,
  available: true,
  availableFrom: "",
  availableEta: "",
  currentRenterName: "",
  currentRenterPhone: "",
  featured: false,
  videoUrl: "",
  adminNotes: "",
  rentals: [] as RentalRecord[],
  category: "Sedan",
  roadTypes: [] as string[],
};

const inputCls =
  "w-full border border-luxury-border bg-white px-4 py-3 text-sm text-gray-900 placeholder-white/20 outline-none transition-colors focus:border-navy focus:ring-1 focus:ring-navy/20";
const labelCls =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900/35";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<Partial<Record<PhotoSlotKey, File>>>({});
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminFilter, setAdminFilter] = useState<"all" | "available" | "rented" | "featured" | string>("all");
  const [adminBrandFilter, setAdminBrandFilter] = useState("All");

  const brandsWithoutAll = BRANDS.filter((b) => b !== "All");

  // Check session on mount
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

  useEffect(() => {
    fetchCars();
    getDoc(doc(db, "settings", "homepage")).then((snap) => {
      if (snap.exists()) {
        // settings loaded
      }
    });
  }, []);

  const fetchCars = async () => {
    try {
      const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Car[];
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (filesToUpload: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of filesToUpload) {
      const storageRef = ref(storage, `cars/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
    return urls;
  };

  const uploadPhoto = async (file: File, slotKey: string): Promise<string> => {
    const storageRef = ref(storage, `cars/${Date.now()}-${slotKey}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `videos/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload any new photo files for each slot
      const photos = { ...form.photos };
      for (const [key, file] of Object.entries(photoFiles)) {
        if (file) {
          photos[key as PhotoSlotKey] = await uploadPhoto(file, key);
        }
      }

      // Build images array from photos for backward compatibility
      const imageUrls = [photos.main, photos.front, photos.back, photos.left, photos.right].filter(Boolean) as string[];

      // Upload gallery files
      const galleryUrls = [...existingGallery];
      for (const file of galleryFiles) {
        const url = await uploadPhoto(file, "gallery");
        galleryUrls.push(url);
      }

      let videoUrl = form.videoUrl;
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
      }

      const carData = {
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
        availableFrom: !form.available && form.availableFrom ? form.availableFrom : "",
        availableEta: !form.available && form.availableEta ? form.availableEta : "",
        currentRenterName: !form.available ? form.currentRenterName : "",
        currentRenterPhone: !form.available ? form.currentRenterPhone : "",
        featured: form.featured,
        videoUrl: videoUrl || "",
        adminNotes: form.adminNotes,
        rentals: form.rentals,
        category: form.category,
        roadTypes: form.roadTypes,
        gallery: galleryUrls,
        createdAt: editingId ? undefined : Date.now(),
      };

      const cleanData = Object.fromEntries(
        Object.entries(carData).filter(([, v]) => v !== undefined)
      );

      if (editingId) {
        await updateDoc(doc(db, "cars", editingId), cleanData);
      } else {
        await addDoc(collection(db, "cars"), cleanData);
      }

      setForm(EMPTY_FORM);
      setPhotoFiles({});
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
      photos: car.photos || { main: car.images?.[0] || "", front: car.images?.[1] || "", back: car.images?.[2] || "", left: car.images?.[3] || "", right: car.images?.[4] || "" },
      available: car.available !== false,
      availableFrom: car.availableFrom || "",
      availableEta: car.availableEta || "",
      currentRenterName: car.currentRenterName || "",
      currentRenterPhone: car.currentRenterPhone || "",
      featured: car.featured || false,
      videoUrl: car.videoUrl || "",
      adminNotes: car.adminNotes || "",
      rentals: car.rentals || [],
      category: car.category || "Sedan",
      roadTypes: car.roadTypes || [],
    });
    setEditingId(car.id);
    setPhotoFiles({});
    setGalleryFiles([]);
    setExistingGallery(car.gallery || []);
    setVideoFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (car: Car) => {
    if (!confirm(`Delete "${car.name}"? This cannot be undone.`)) return;
    setDeleting(car.id);
    try {
      for (const url of car.images || []) {
        try {
          const storageRef = ref(storage, url);
          await deleteObject(storageRef);
        } catch {
          // Image may already be deleted
        }
      }
      // Also delete photos if stored separately
      if (car.photos) {
        for (const url of Object.values(car.photos)) {
          if (url && !car.images?.includes(url)) {
            try {
              const storageRef = ref(storage, url);
              await deleteObject(storageRef);
            } catch {
              // Photo may already be deleted
            }
          }
        }
      }
      if (car.videoUrl) {
        try {
          const videoRef = ref(storage, car.videoUrl);
          await deleteObject(videoRef);
        } catch {
          // Video may already be deleted
        }
      }
      if (car.gallery) {
        for (const url of car.gallery) {
          try {
            const storageRef = ref(storage, url);
            await deleteObject(storageRef);
          } catch {
            // Gallery image may already be deleted
          }
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

  // Quick toggle available/featured from list
  const toggleField = async (carId: string, field: "available" | "featured", current: boolean) => {
    setTogglingId(carId);
    try {
      await updateDoc(doc(db, "cars", carId), { [field]: !current });
      setCars((prev) =>
        prev.map((c) => (c.id === carId ? { ...c, [field]: !current } : c))
      );
    } catch (error) {
      console.error("Error toggling:", error);
    } finally {
      setTogglingId(null);
    }
  };

  // Photo slot management
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

  return (
    <div className="min-h-screen bg-luxury-black">
      {!isAuthenticated ? (
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
                  className={`w-full border bg-white px-4 py-3 text-sm text-gray-900 placeholder-white/20 outline-none transition-colors focus:border-navy focus:ring-1 focus:ring-navy/20 ${
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
      ) : (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              ADMIN PANEL
            </h1>
            <p className="mt-1 text-sm text-gray-900/30">
              Manage your car listings
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setForm(EMPTY_FORM);
                setEditingId(null);
                setPhotoFiles({});
                setVideoFile(null);
              }
            }}
            className={`px-6 py-3 text-[12px] font-bold tracking-[0.15em] uppercase transition-all ${
              showForm
                ? "border border-luxury-border bg-luxury-card text-gray-900/50 hover:bg-luxury-dark"
                : "bg-navy text-white hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.25)]"
            }`}
          >
            {showForm ? "Cancel" : "+ Add New Car"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 border border-luxury-border bg-luxury-card p-6 sm:p-8"
          >
            <h2 className="mb-6 font-serif text-xl font-bold text-gray-900">
              {editingId ? "EDIT CAR" : "ADD NEW CAR"}
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Car Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Toyota Camry 2024"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Brand */}
              <div>
                <label className={labelCls}>Brand *</label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className={inputCls}
                >
                  {brandsWithoutAll.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className={labelCls}>Year *</label>
                <input
                  required
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>

              {/* Price */}
              <div>
                <label className={labelCls}>Price ($/day) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>

              {/* Mileage */}
              <div>
                <label className={labelCls}>Mileage (km) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.mileage}
                  onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>

              {/* Fuel */}
              <div>
                <label className={labelCls}>Fuel Type</label>
                <select
                  value={form.fuel}
                  onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                  className={inputCls}
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className={labelCls}>Transmission</label>
                <select
                  value={form.transmission}
                  onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                  className={inputCls}
                >
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className={labelCls}>Seats</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputCls}
                >
                  {CAR_CATEGORIES.filter(c => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Road Types */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Best For (Road Types)</label>
                <div className="flex flex-wrap gap-2">
                  {ROAD_TYPES.filter(r => r !== "All Terrain").map((road) => {
                    const selected = form.roadTypes.includes(road);
                    return (
                      <button
                        key={road}
                        type="button"
                        onClick={() => {
                          setForm({
                            ...form,
                            roadTypes: selected
                              ? form.roadTypes.filter((r) => r !== road)
                              : [...form.roadTypes, road],
                          });
                        }}
                        className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                          selected
                            ? "border border-navy bg-navy/20 text-navy"
                            : "border border-luxury-border bg-white text-gray-900/30 hover:border-white/20 hover:text-gray-900/50"
                        }`}
                      >
                        {road}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className={labelCls}>WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="e.g. 96170123456"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Video Upload */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Car Video</label>
                {form.videoUrl && !videoFile && (
                  <div className="mb-2 flex items-center gap-3 border border-luxury-border bg-white px-4 py-2">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-gray-900/50">Video uploaded</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, videoUrl: "" })}
                      className="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full border border-luxury-border bg-white px-4 py-3 text-sm text-gray-900/40 file:mr-4 file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-navy-light"
                />
                {videoFile && (
                  <p className="mt-1 text-xs text-gray-900/25">
                    {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the car..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Toggles: Available & Featured */}
              <div className="sm:col-span-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`relative h-6 w-11 transition-colors ${form.available ? "bg-green-500" : "bg-luxury-border"}`}
                    onClick={() => setForm({ ...form, available: !form.available, availableFrom: !form.available ? form.availableFrom : "" })}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 bg-white transition-transform ${form.available ? "translate-x-[22px]" : "translate-x-0.5"}`}
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-900/50 group-hover:text-gray-900/70">
                    Available
                  </span>
                </label>

                {/* Date picker + ETA + Renter — shown when rented */}
                {!form.available && (
                  <div className="sm:col-span-2 space-y-4 mt-2 border border-red-500/15 bg-red-500/[0.03] p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900/35">
                          Available from:
                        </label>
                        <input
                          type="date"
                          value={form.availableFrom}
                          onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                          className="border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-navy [color-scheme:light]"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-900/35">
                          ETA:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2 weeks, March 15"
                          value={form.availableEta}
                          onChange={(e) => setForm({ ...form, availableEta: e.target.value })}
                          className="border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 placeholder-white/20 outline-none focus:border-navy w-48"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-gray-900/25">Current Renter Name</label>
                        <input
                          type="text"
                          placeholder="Renter's full name"
                          value={form.currentRenterName}
                          onChange={(e) => setForm({ ...form, currentRenterName: e.target.value })}
                          className="w-full border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 placeholder-white/15 outline-none focus:border-navy"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-gray-900/25">Renter Phone (WhatsApp)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 96170123456"
                            value={form.currentRenterPhone}
                            onChange={(e) => setForm({ ...form, currentRenterPhone: e.target.value })}
                            className="flex-1 border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 placeholder-white/15 outline-none focus:border-navy"
                          />
                          {form.currentRenterPhone && (
                            <a
                              href={`https://wa.me/${form.currentRenterPhone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 border border-green-500/30 bg-green-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-green-400 transition-colors hover:bg-green-500/20"
                            >
                              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                              </svg>
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`relative h-6 w-11 transition-colors ${form.featured ? "bg-navy" : "bg-luxury-border"}`}
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 bg-white transition-transform ${form.featured ? "translate-x-[22px]" : "translate-x-0.5"}`}
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-900/50 group-hover:text-gray-900/70">
                    Featured
                  </span>
                </label>
              </div>

              {/* Admin Private Notes */}
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3 w-3 text-gray-900/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Private Admin Notes
                  </span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Internal notes (not visible to customers)..."
                  value={form.adminNotes}
                  onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
                  className={inputCls + " !border-white/[0.06] !bg-luxury-dark"}
                />
              </div>

              {/* Rental History */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls + " !mb-0"}>Rental History</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, rentals: [...form.rentals, { renterName: "", renterPhone: "", startDate: "", endDate: "", notes: "" }] })}
                    className="text-[10px] font-bold uppercase tracking-wider text-navy hover:text-gray-900 transition-colors"
                  >
                    + Add Rental
                  </button>
                </div>
                {form.rentals.length === 0 && (
                  <p className="text-[11px] text-gray-900/20 py-3 border border-dashed border-luxury-border text-center">No rental records yet</p>
                )}
                <div className="space-y-3">
                  {form.rentals.map((rental, idx) => (
                    <div key={idx} className="border border-luxury-border bg-luxury-dark p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900/30">Rental #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, rentals: form.rentals.filter((_, i) => i !== idx) })}
                          className="text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-gray-900/25">Renter Name</label>
                          <input
                            type="text"
                            placeholder="Name"
                            value={rental.renterName}
                            onChange={(e) => {
                              const updated = [...form.rentals];
                              updated[idx] = { ...updated[idx], renterName: e.target.value };
                              setForm({ ...form, rentals: updated });
                            }}
                            className="w-full border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 placeholder-white/15 outline-none focus:border-navy"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-gray-900/25">Phone (WhatsApp)</label>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              placeholder="96170123456"
                              value={rental.renterPhone || ""}
                              onChange={(e) => {
                                const updated = [...form.rentals];
                                updated[idx] = { ...updated[idx], renterPhone: e.target.value };
                                setForm({ ...form, rentals: updated });
                              }}
                              className="w-full border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 placeholder-white/15 outline-none focus:border-navy"
                            />
                            {rental.renterPhone && (
                              <a
                                href={`https://wa.me/${rental.renterPhone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center border border-green-500/30 bg-green-500/10 px-2 text-green-400 hover:bg-green-500/20 transition-colors"
                                title="WhatsApp"
                              >
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-gray-900/25">Start Date</label>
                          <input
                            type="date"
                            value={rental.startDate}
                            onChange={(e) => {
                              const updated = [...form.rentals];
                              updated[idx] = { ...updated[idx], startDate: e.target.value };
                              setForm({ ...form, rentals: updated });
                            }}
                            className="w-full border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-navy [color-scheme:light]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-gray-900/25">End Date</label>
                          <input
                            type="date"
                            value={rental.endDate}
                            onChange={(e) => {
                              const updated = [...form.rentals];
                              updated[idx] = { ...updated[idx], endDate: e.target.value };
                              setForm({ ...form, rentals: updated });
                            }}
                            className="w-full border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-navy [color-scheme:light]"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-gray-900/25">Rental Notes</label>
                        <input
                          type="text"
                          placeholder="Optional notes about this rental..."
                          value={rental.notes || ""}
                          onChange={(e) => {
                            const updated = [...form.rentals];
                            updated[idx] = { ...updated[idx], notes: e.target.value };
                            setForm({ ...form, rentals: updated });
                          }}
                          className="w-full border border-luxury-border bg-white px-3 py-2 text-sm text-gray-900 placeholder-white/15 outline-none focus:border-navy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Slots */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Car Photos</label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                  {PHOTO_SLOTS.map((slot) => {
                    const existingUrl = form.photos[slot.key];
                    const pendingFile = photoFiles[slot.key];
                    const hasPhoto = existingUrl || pendingFile;

                    return (
                      <div key={slot.key} className="flex flex-col">
                        <span className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-900/40">
                          {slot.label} {slot.required && <span className="text-navy">*</span>}
                        </span>
                        <div className="relative aspect-[4/3] w-full overflow-hidden border border-luxury-border bg-white">
                          {hasPhoto ? (
                            <>
                              <img
                                src={pendingFile ? URL.createObjectURL(pendingFile) : existingUrl!}
                                alt={slot.label}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/70 opacity-0 transition-opacity hover:opacity-100">
                                <label className="flex h-7 w-7 cursor-pointer items-center justify-center bg-white/15 text-white transition-colors hover:bg-white/25">
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                  </svg>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) setPhotoFiles((prev) => ({ ...prev, [slot.key]: file }));
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removePhoto(slot.key)}
                                  className="flex h-7 w-7 items-center justify-center bg-red-500/30 text-red-400 transition-colors hover:bg-red-500/50"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </>
                          ) : (
                            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 transition-colors hover:bg-luxury-dark">
                              <svg className="h-6 w-6 text-gray-900/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="text-[8px] font-bold uppercase tracking-wider text-gray-900/20">Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setPhotoFiles((prev) => ({ ...prev, [slot.key]: file }));
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Gallery Photos <span className="text-gray-900/20 normal-case tracking-normal">(additional images shown on the car detail page)</span></label>
                <div className="flex flex-wrap gap-3">
                  {existingGallery.map((url, i) => (
                    <div key={url} className="relative h-20 w-28 overflow-hidden border border-luxury-border bg-white">
                      <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setExistingGallery((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center bg-red-500/80 text-white text-[10px] hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {galleryFiles.map((file, i) => (
                    <div key={i} className="relative h-20 w-28 overflow-hidden border border-navy/30 bg-white">
                      <img src={URL.createObjectURL(file)} alt={`New ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center bg-red-500/80 text-white text-[10px] hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-luxury-border bg-white transition-colors hover:border-navy/30 hover:bg-luxury-dark">
                    <svg className="h-5 w-5 text-gray-900/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-gray-900/20">Add Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length) setGalleryFiles((prev) => [...prev, ...files]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-navy-light hover:shadow-[0_0_30px_rgba(27,58,92,0.3)] disabled:opacity-50"
              >
                {uploading
                  ? "Saving..."
                  : editingId
                  ? "Update Car"
                  : "Add Car"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                  setEditingId(null);
                  setPhotoFiles({});
                  setGalleryFiles([]);
                  setExistingGallery([]);
                  setVideoFile(null);
                }}
                className="border border-luxury-border bg-white px-6 py-3 text-[12px] font-bold text-gray-900/40 transition-colors hover:border-navy/30 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Admin Search & Filters */}
        <div className="mb-5 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search cars..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full border border-luxury-border bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-white/20 outline-none transition-colors focus:border-navy"
              />
            </div>
            <select
              value={adminBrandFilter}
              onChange={(e) => setAdminBrandFilter(e.target.value)}
              className="border border-luxury-border bg-white px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-900/50 outline-none transition-colors focus:border-navy [color-scheme:light]"
            >
              <option value="All">All Brands</option>
              {brandsWithoutAll.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <div className="flex gap-1">
              {(["all", "available", "rented", "featured"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setAdminFilter(f)}
                  className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    adminFilter === f
                      ? "border border-navy bg-navy/15 text-navy"
                      : "border border-luxury-border bg-white text-gray-900/30 hover:text-gray-900/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {(adminSearch || adminBrandFilter !== "All" || adminFilter !== "all") && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900/25">
                {cars.filter((car) => {
                  if (adminFilter === "available" && !car.available) return false;
                  if (adminFilter === "rented" && car.available !== false) return false;
                  if (adminFilter === "featured" && !car.featured) return false;
                  if (adminBrandFilter !== "All" && car.brand !== adminBrandFilter) return false;
                  if (adminSearch) {
                    const q = adminSearch.toLowerCase();
                    const haystack = `${car.name} ${car.brand} ${car.year} ${car.fuel} ${car.transmission}`.toLowerCase();
                    if (!haystack.includes(q)) return false;
                  }
                  return true;
                }).length} of {cars.length} cars
              </span>
              <button
                onClick={() => { setAdminSearch(""); setAdminBrandFilter("All"); setAdminFilter("all"); }}
                className="text-[10px] font-bold uppercase tracking-wider text-navy hover:text-gray-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Cars List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-luxury-border bg-luxury-card p-5">
                <div className="flex gap-4">
                  <div className="h-20 w-28 bg-luxury-border lux-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-luxury-border lux-pulse" />
                    <div className="h-3 w-1/2 bg-luxury-border lux-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-luxury-border bg-luxury-card py-24">
            <svg className="h-16 w-16 text-gray-900/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
              NO CARS YET
            </h3>
            <p className="mt-1 text-sm text-gray-900/30">
              Add your first car listing
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cars
              .filter((car) => {
                if (adminFilter === "available" && !car.available) return false;
                if (adminFilter === "rented" && car.available !== false) return false;
                if (adminFilter === "featured" && !car.featured) return false;
                if (adminBrandFilter !== "All" && car.brand !== adminBrandFilter) return false;
                if (adminSearch) {
                  const q = adminSearch.toLowerCase();
                  const haystack = `${car.name} ${car.brand} ${car.year} ${car.fuel} ${car.transmission}`.toLowerCase();
                  if (!haystack.includes(q)) return false;
                }
                return true;
              })
              .map((car) => (
              <div
                key={car.id}
                className={`border bg-luxury-card p-5 transition-all hover:border-navy/20 ${car.available === false ? "border-red-500/15" : "border-luxury-border"}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Thumbnail */}
                  <div className="h-24 w-full flex-shrink-0 overflow-hidden bg-white sm:w-36">
                    {(car.photos?.main || car.images?.[0]) ? (
                      <img
                        src={car.photos?.main || car.images[0]}
                        alt={car.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-900/10">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-gray-900">{car.name}</h3>
                      {car.featured && (
                        <span className="flex items-center gap-1 bg-navy/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy-light">
                          <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          Featured
                        </span>
                      )}
                      {car.available === false && (
                        <span className="bg-red-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                          {car.availableFrom
                            ? `Rented · Back ${new Date(car.availableFrom + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                            : "Rented"}
                        </span>
                      )}
                      {car.videoUrl && (
                        <span className="bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-900/40">
                          Video
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900/40">
                      {car.brand} · {car.year} · {car.mileage.toLocaleString()} km ·{" "}
                      <span className="text-navy">${car.price}/day</span>
                      {(() => {
                        const count = car.photos ? Object.values(car.photos).filter(Boolean).length : (car.images?.length || 0);
                        return count > 0 ? ` · ${count} photo${count !== 1 ? "s" : ""}` : "";
                      })()}
                    </p>
                  </div>

                  {/* Toggle buttons + actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Available toggle */}
                    <button
                      onClick={() => toggleField(car.id, "available", car.available !== false)}
                      disabled={togglingId === car.id}
                      className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                        car.available !== false
                          ? "border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      {car.available !== false ? "Available" : "Rented"}
                    </button>

                    {/* Featured toggle */}
                    <button
                      onClick={() => toggleField(car.id, "featured", car.featured || false)}
                      disabled={togglingId === car.id}
                      className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                        car.featured
                          ? "border border-navy/30 bg-navy/15 text-navy hover:bg-navy/25"
                          : "border border-luxury-border bg-luxury-dark text-gray-900/30 hover:text-gray-900/50"
                      }`}
                    >
                      ★ {car.featured ? "Featured" : "Feature"}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(car)}
                      className="border border-navy/30 bg-navy/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-navy transition-colors hover:bg-navy/20"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(car)}
                      disabled={deleting === car.id}
                      className="border border-red-500/20 bg-red-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {deleting === car.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Expanded Renter Info — shown when car is rented */}
                {car.available === false && (car.currentRenterName || car.currentRenterPhone || car.availableEta || car.availableFrom) && (
                  <div className="mt-4 border-t border-red-500/10 pt-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      {car.currentRenterName && (
                        <div className="flex items-center gap-2">
                          <svg className="h-3.5 w-3.5 text-gray-900/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[11px] text-gray-900/50">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-900/25 mr-1.5">Renter:</span>
                            {car.currentRenterName}
                          </span>
                        </div>
                      )}
                      {car.currentRenterPhone && (
                        <div className="flex items-center gap-2">
                          <svg className="h-3.5 w-3.5 text-gray-900/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-[11px] text-gray-900/50">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-900/25 mr-1.5">Phone:</span>
                            {car.currentRenterPhone}
                          </span>
                          <a
                            href={`https://wa.me/${car.currentRenterPhone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-400 transition-colors hover:bg-green-500/20"
                          >
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.356 0-4.57-.652-6.454-1.785l-.45-.27-2.527.847.847-2.527-.27-.45A9.965 9.965 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                            </svg>
                            WhatsApp
                          </a>
                        </div>
                      )}
                      {car.availableFrom && (
                        <div className="flex items-center gap-2">
                          <svg className="h-3.5 w-3.5 text-gray-900/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[11px] text-gray-900/50">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-900/25 mr-1.5">Returns:</span>
                            {new Date(car.availableFrom + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                      )}
                      {car.availableEta && (
                        <div className="flex items-center gap-2">
                          <svg className="h-3.5 w-3.5 text-gray-900/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[11px] text-gray-900/50">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-900/25 mr-1.5">ETA:</span>
                            {car.availableEta}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
