import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCreateEvent, updateEventAdmin } from "../../features/admin/adminSlice";
import LoadingScreen from "../../components/LoadingScreen";


const createEvent = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        eventLocation: "",
        eventArtistName: "",
        totalSeats: "",
        duration: "",
        ticketPrice: "",
        eventImage: "",
    });

    const { title, description, eventDate, eventLocation, eventArtistName, totalSeats, duration, ticketPrice, eventImage } = formData

    const [loading, setLoading] = useState(false);

    // ✅ handle change
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "eventImage") {
            console.log("Selected file:", files[0]);
            setFormData({ ...formData, eventImage: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // ✅ submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('description', description);
        formDataToSend.append('eventDate', eventDate);
        formDataToSend.append('eventLocation', eventLocation);
        formDataToSend.append('eventArtistName', eventArtistName);
        formDataToSend.append('ticketPrice', ticketPrice);
        formDataToSend.append('totalSeats', totalSeats);
        formDataToSend.append('duration', duration);
        if (eventImage) {
            formDataToSend.append('eventImage', eventImage);
        }

        if (user?.isAdmin) {
            try {
                setLoading(true);

                await dispatch(adminCreateEvent(formDataToSend)).unwrap();

                // ✅ form reset
                setFormData({
                    title: "",
                    description: "",
                    eventDate: "",
                    eventLocation: "",
                    eventArtistName: "",
                    totalSeats: "",
                    duration: "",
                    ticketPrice: "",
                    eventImage: "",
                });

                // ✅ loader off
                setLoading(false);

                // ✅ navigate
                navigate("/admin/events");



            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
    };

    return (
        <>
            {loading && <LoadingScreen />}

            <div className="max-w-3xl mx-auto p-4 sm:p-6">

                <div className="rounded-3xl border border-zinc-700/30 bg-zinc-800/40 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">

                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                        Create Event
                    </h1>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4 sm:gap-5">

                        <input
                            name="title"
                            value={title}
                            onChange={handleChange}
                            placeholder="Event Title"
                            className="input"
                        />

                        <textarea
                            name="description"
                            value={description}
                            onChange={handleChange}
                            placeholder="Event Description"
                            rows={3}
                            className="input resize-none"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="date"
                                name="eventDate"
                                value={eventDate}
                                onChange={handleChange}
                                className="input"
                            />

                            <input
                                name="eventLocation"
                                value={eventLocation}
                                onChange={handleChange}
                                placeholder="Location"
                                className="input"
                            />
                        </div>

                        <input
                            name="eventArtistName"
                            value={eventArtistName}
                            onChange={handleChange}
                            placeholder="Artist Name"
                            className="input"
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <input
                                type="number"
                                name="totalSeats"
                                value={totalSeats}
                                onChange={handleChange}
                                placeholder="Seats"
                                className="input"
                            />

                            <input
                                name="duration"
                                value={duration}
                                onChange={handleChange}
                                placeholder="Duration"
                                className="input"
                            />

                            <input
                                type="number"
                                name="ticketPrice"
                                value={ticketPrice}
                                onChange={handleChange}
                                placeholder="Price"
                                className="input"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="border border-dashed border-zinc-600 rounded-xl p-4 text-center hover:border-[#C8F135] transition">
                            <input
                                type="file"
                                name="eventImage"
                                onChange={handleChange}
                                className="hidden"
                                id="fileUpload"
                            />

                            <label htmlFor="fileUpload" className="cursor-pointer text-sm text-zinc-400 hover:text-white">
                                Click to upload event image
                            </label>

                            {formData.eventImage && (
                                <p className="text-xs text-[#C8F135] mt-2">
                                    {eventImage.name}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-2">

                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        title: "",
                                        description: "",
                                        eventDate: "",
                                        eventLocation: "",
                                        eventArtistName: "",
                                        totalSeats: "",
                                        duration: "",
                                        ticketPrice: "",
                                        eventImage: null,
                                    });
                                    // navigate back
                                    navigate("/admin/events");
                                }}
                                className="w-1/2 py-2.5 rounded-full border border-zinc-600 text-zinc-400 hover:bg-zinc-700/40 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-1/2 rounded-full bg-[#C8F135] text-black py-2.5 font-bold hover:scale-105 transition-all disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Event"}
                            </button>

                        </div>
                    </form>

                </div>

            </div>
        </>
    );
}

export default createEvent