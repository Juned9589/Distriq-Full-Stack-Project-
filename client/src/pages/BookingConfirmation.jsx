import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Shield, Download, MapPin, Calendar, Clock, Users } from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BookingConfirmation() {

    const { eid } = useParams();
    const location = useLocation();
    const { ticketCount = 1, coupon: stateCoupon } = location.state || {};

    const { event } = useSelector(state => state.event);
    const { coupon: reduxCoupon } = useSelector(state => state.order);
    
    // Use state coupon if available, fallback to redux
    const activeCoupon = stateCoupon || reduxCoupon;

    const events = event && event._id === eid ? event : null;

    if (!events) {
        return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-center">
                <p className="text-white text-xl mb-4">No booking details found</p>
                <Link to="/events" className="text-[#C8F135] hover:underline">Go back to events</Link>
            </div>
        </div>;
    }

    const seats = ticketCount;
    const subtotal = (events.ticketPrice || 0) * seats;
    const discountRate = activeCoupon?.couponDiscount || 0;
    const discount = Math.round((subtotal * discountRate) / 100);
    const total = subtotal - discount;

    return (
        <div className="min-h-screen bg-zinc-950 font-['DM_Sans']"
            style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(200,241,53,0.12), transparent)" }}>
            <div className="max-w-4xl mx-auto px-4 py-10">

                {/* Back Button */}
                <Link to="/events">
                    <motion.button whileHover={{ x: -4 }}
                        className="flex items-center gap-2 text-zinc-400 border border-zinc-700 px-4 py-2 rounded-full text-sm mb-8 hover:border-[#C8F135] hover:text-[#C8F135] transition-all duration-300">
                        <ArrowLeft size={15} /> Back to Events
                    </motion.button>
                </Link>

                {/* Success Badge */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }} className="flex flex-col items-center text-center mb-10">
                    <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(200,241,53,0.3)", "0 0 0 16px rgba(200,241,53,0)", "0 0 0 0 rgba(200,241,53,0.3)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 rounded-full border-2 border-[#C8F135] flex items-center justify-center mb-4">
                        <CheckCircle size={36} className="text-[#C8F135]" />
                    </motion.div>
                    <h1 className="font-['Syne'] text-3xl font-extrabold text-white">Booking Confirmed!</h1>
                    <p className="text-zinc-400 mt-1">Your tickets have been booked. See you at the event!</p>
                </motion.div>

                {/* Ticket Card */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-zinc-800/40 backdrop-blur-2xl border border-zinc-700/30 rounded-3xl overflow-hidden mb-6">
                    <div className="flex flex-col sm:flex-row">
                        <img src={events.eventImage} alt={events.title} loading="lazy"
                            className="w-full sm:w-48 h-48 object-cover" />
                        <div className="p-6 flex-1">
                            <h2 className="font-['Syne'] text-xl font-bold text-white">{events.title}</h2>
                            <p className="text-[#C8F135] text-sm font-semibold mb-4">{events.eventArtistName}</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: <Calendar size={14} />, label: "Date", val: new Date(events.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                                    { icon: <Clock size={14} />, label: "Duration", val: events.duration },
                                    { icon: <MapPin size={14} />, label: "Venue", val: events.eventLocation },
                                    { icon: <Users size={14} />, label: "Seats", val: `${seats} Seat${seats > 1 ? "s" : ""}` },
                                ].map((d) => (
                                    <div key={d.label}>
                                        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{d.label}</p>
                                        <p className="text-zinc-200 text-sm font-medium flex items-center gap-1">{d.icon}{d.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-zinc-700" />

                    <div className="p-5 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-xl grid grid-cols-3 gap-[2px] p-2">
                                {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((v, i) => (
                                    <div key={i} className={`rounded-sm ${v ? "bg-[#C8F135]" : "bg-zinc-700"}`} />
                                ))}
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs">Booking ID</p>
                                <p className="text-zinc-300 text-xs font-mono">
                                    #DSTRQ-{String(events._id).toUpperCase().slice(-8)}-2025
                                </p>
                            </div>
                        </div>
                        <span className="bg-[#C8F135]/10 border border-[#C8F135]/30 text-[#C8F135] text-xs font-bold px-4 py-2 rounded-full">
                            Confirmed
                        </span>
                    </div>
                </motion.div>

                {/* Payment Summary */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="bg-zinc-800/40 backdrop-blur-2xl border border-zinc-700/30 rounded-3xl p-6 mb-6">
                    <h3 className="font-['Syne'] font-bold text-white mb-4">Payment Summary</h3>
                    {[
                        { label: `Ticket Price (×${seats})`, val: `₹${subtotal.toLocaleString()}` },
                        ...(discount > 0 ? [{
                            label: `Coupon — ${activeCoupon?.couponCode || "APPLIED"}`,
                            val: `− ₹${discount.toLocaleString()}`,
                            green: true
                        }] : []),
                        { label: "Convenience Fee", val: "₹0" },
                    ].map((row) => (
                        <div key={row.label} className="flex justify-between py-2 border-b border-zinc-700/40 text-sm">
                            <span className="text-zinc-400">{row.label}</span>
                            <span className={row.green ? "text-green-400 font-medium" : "text-zinc-200 font-medium"}>{row.val}</span>
                        </div>
                    ))}
                    <div className="flex justify-between pt-3">
                        <span className="text-white font-bold text-base">Total Paid</span>
                        <span className="text-[#C8F135] font-bold text-lg">₹{total.toLocaleString()}</span>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }} className="flex gap-3 flex-wrap">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        className="flex-1 min-w-[140px] bg-[#C8F135] text-zinc-950 font-bold rounded-full px-8 py-3 flex items-center justify-center gap-2">
                        <Download size={16} /> Download Ticket
                    </motion.button>
                    <Link to="/my-tickets" className="flex-1 min-w-[140px]">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                            className="w-full border border-zinc-600 text-white rounded-full px-8 py-3 hover:border-[#C8F135] hover:text-[#C8F135] transition-all duration-300">
                            My Tickets
                        </motion.button>
                    </Link>
                    <Link to="/events" className="flex-1 min-w-[140px]">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                            className="w-full border border-zinc-600 text-white rounded-full px-8 py-3 hover:border-[#C8F135] hover:text-[#C8F135] transition-all duration-300">
                            Explore More
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 mt-5 text-zinc-600 text-xs">
                    <Shield size={12} /> Secured by Distriq · Booking saved to your account
                </div>

            </div>
        </div>
    );
}
