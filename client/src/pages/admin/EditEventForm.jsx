import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetEdit, updateEventAdmin } from "../../features/admin/adminSlice";


const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('blob:')) return imagePath;
  if (imagePath.startsWith('http')) return imagePath;

  // In production (Render), we serve from the same domain, so relative paths work.
  // In development, Vite proxies /uploads to the backend.
  if (imagePath.startsWith('/uploads')) return imagePath;
  if (imagePath.startsWith('uploads')) return `/${imagePath}`;
  return `/uploads/${imagePath}`;
};

export default function EditEventForm({ onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { edit, adminLoading: loading } = useSelector((s) => s.admin);

  // ✅ Get prefill data safely
  const prefill = edit?.event || {};

  const [preview, setPreview] = useState(
    prefill.eventImage ? getImageUrl(prefill.eventImage) : null
  );

  const [formData, setFormData] = useState({
    title: prefill.title || "",
    description: prefill.description || "",
    eventDate: prefill.eventDate?.slice(0, 10) || "",
    eventLocation: prefill.eventLocation || "",
    eventArtistName: prefill.eventArtistName || "",
    totalSeats: prefill.totalSeats || "",
    duration: prefill.duration || "",
    ticketPrice: prefill.ticketPrice || "",
    eventImage: null,
  });

  const { title, description, eventDate, eventImage, eventLocation, totalSeats, ticketPrice, eventArtistName, duration } = formData;

  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  // ✅ Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ✅ Sync form when edit.event changes
  useEffect(() => {
    if (edit?.event) {
      setFormData({
        title: edit.event.title || "",
        description: edit.event.description || "",
        eventDate: edit.event.eventDate?.slice(0, 10) || "",
        eventLocation: edit.event.eventLocation || "",
        eventArtistName: edit.event.eventArtistName || "",
        totalSeats: edit.event.totalSeats || "",
        duration: edit.event.duration || "",
        ticketPrice: edit.event.ticketPrice || "",
        eventImage: null, // keep existing image unless new file selected
      });

      setPreview(
        edit.event.eventImage ? getImageUrl(edit.event.eventImage) : null
      );
    }
  }, [edit?.event]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files?.[0]) {
      setFormData((p) => ({ ...p, eventImage: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((p) => ({ ...p, eventImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!edit?.event?._id) {
      console.error("No event ID found for update");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("eventDate", eventDate);
    data.append("eventLocation", eventLocation);
    data.append("eventArtistName", eventArtistName);
    data.append("totalSeats", totalSeats);
    data.append("duration", duration);
    data.append("ticketPrice", ticketPrice);

    if (eventImage instanceof File) {
      data.append("eventImage", eventImage);
    }

    try {
      const updatedEvent = await dispatch(
        updateEventAdmin({ id: edit.event._id, formData: data }) // ✅ fixed
      ).unwrap();

      if (updatedEvent?.eventImage) {
        setPreview(getImageUrl(updatedEvent.eventImage));
      }

      dispatch(resetEdit());
      onCancel?.();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleCancel = () => {
    dispatch(resetEdit());
    onCancel?.();
  };




  const inputBase =
    "w-full bg-zinc-900/60 border border-zinc-700/60 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 outline-none focus:border-[#C8F135]/70 focus:ring-1 focus:ring-[#C8F135]/20 transition-all duration-200 hover:border-zinc-500";

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .title-font { font-family: 'Syne', sans-serif; }
        .glow-input:focus { box-shadow: 0 0 0 2px rgba(200,241,53,0.12); }
        .lime-btn:hover { box-shadow: 0 0 20px rgba(200,241,53,0.35); }
        ::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
      `}</style>

      <div className="w-full max-w-lg">
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">

          {/* Title */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <h1 className="title-font text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Edit Event
              </h1>
              <p className="text-zinc-500 text-xs mt-1">
                Update the details below and save your changes.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#C8F135]/10 border border-[#C8F135]/20 flex items-center justify-center mt-1">
              <svg className="w-3.5 h-3.5 text-[#C8F135]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

            {/* Basic Info */}
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-medium block">Basic Info</label>
              <input name="title" value={title} onChange={handleChange} placeholder="Event Title" className={`${inputBase} glow-input`} />
              <textarea name="description" value={description} onChange={handleChange} placeholder="Event Description" rows={3} className={`${inputBase} glow-input resize-none`} />
            </div>

            {/* When & Where */}
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-medium block">When & Where</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" name="eventDate" value={eventDate} onChange={handleChange} className={`${inputBase} glow-input`} />
                <input name="eventLocation" value={eventLocation} onChange={handleChange} placeholder="Location" className={`${inputBase} glow-input`} />
              </div>
            </div>

            {/* Artist */}
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-medium block">Performer</label>
              <input name="eventArtistName" value={eventArtistName} onChange={handleChange} placeholder="Artist Name" className={`${inputBase} glow-input`} />
            </div>

            {/* Tickets */}
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-medium block">Tickets & Duration</label>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" name="totalSeats" value={totalSeats} onChange={handleChange} placeholder="Seats" className={`${inputBase} glow-input`} />
                <input name="duration" value={duration} onChange={handleChange} placeholder="Duration" className={`${inputBase} glow-input`} />
                <input type="number" name="ticketPrice" value={ticketPrice} onChange={handleChange} placeholder="Price" className={`${inputBase} glow-input`} />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.2em] uppercase text-zinc-600 font-medium block">Event Image</label>
              <div
                className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden
                  ${dragOver ? "border-[#C8F135] bg-[#C8F135]/5" : "border-zinc-700/70 hover:border-zinc-500 bg-zinc-900/40"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" name="eventImage" accept="image/*" onChange={handleChange} className="hidden" />

                {preview ? (
                  <div className="relative group">
                    <img
                      src={getImageUrl(preview)}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                      <svg className="w-5 h-5 text-[#C8F135]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-white text-xs font-medium">Replace image</span>
                    </div>
                    {eventImage && (
                      <span className="absolute bottom-2 left-2 bg-black/70 text-[#C8F135] text-[10px] px-2 py-0.5 rounded-full truncate max-w-[80%]">
                        {eventImage.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm0 0a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-zinc-400 text-sm">Drop image here or <span className="text-[#C8F135] underline underline-offset-2">browse</span></p>
                    <p className="text-zinc-600 text-xs">PNG, JPG, WEBP · max 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="w-1/2 py-3 rounded-full border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800/60 hover:text-white hover:border-zinc-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-3 rounded-full bg-[#C8F135] text-black text-sm font-bold hover:scale-[1.03] transition-all duration-200 disabled:opacity-50 disabled:scale-100 lime-btn"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </span>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}