import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Phone,
  MapPin,
  Menu,
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MessageCircle,
  Calendar,
  Clock,
  Activity,
  FileText,
  Send,
  CheckCircle,
  BarChart3,
  ChevronRight,
  TrendingUp,
  Building,
  Newspaper,
  Tag,
  Upload,
  Download,
  Share2,
  DollarSign,
  Edit2,
  UserCircle,
  LogOut,
} from "lucide-react";
import "./App.css";

// --- Mock Users ---
const MOCK_USERS = [
  { id: 1, name: "Alex Broker", role: "admin", email: "alex@agency.com" },
  { id: 2, name: "Sarah Agent", role: "agent", email: "sarah@agency.com" },
  { id: 3, name: "Mike Sales", role: "agent", email: "mike@agency.com" },
];

// --- Mock Data ---
const INITIAL_LEADS = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul@example.com",
    status: "New Lead",
    source: "Website",
    budget: "1.5Cr",
    type: "3BHK Apt",
    location: "Andheri West",
    lastUpdate: "2h ago",
    createdDate: "2023-10-24",
    createdBy: "Alex Broker",
    assignedTo: "Sarah Agent",
    interactions: 2,
    readiness: "Hot",
    notes: "Looking for possession in 6 months.",
  },
  {
    id: 2,
    name: "Priya Patel",
    phone: "+91 99887 76655",
    email: "priya@example.com",
    status: "Contacted",
    source: "Referral",
    budget: "85L",
    type: "2BHK",
    location: "Malad",
    lastUpdate: "1d ago",
    createdDate: "2023-10-23",
    createdBy: "Sarah Agent",
    assignedTo: "Sarah Agent",
    interactions: 5,
    readiness: "Warm",
    notes: "First time home buyer.",
  },
  {
    id: 3,
    name: "Amit Verma",
    phone: "+91 91234 56789",
    email: "amit@example.com",
    status: "Site Visit Scheduled",
    source: "MagicBricks",
    budget: "2.1Cr",
    type: "Villa",
    location: "Lonavala",
    lastUpdate: "30m ago",
    createdDate: "2023-10-25",
    createdBy: "Mike Sales",
    assignedTo: "Mike Sales",
    interactions: 8,
    readiness: "Hot",
    notes: "Likes the pool view. Negotiating price.",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    phone: "+91 98765 12345",
    email: "sneha@example.com",
    status: "Budget Issue",
    source: "Facebook Ad",
    budget: "1.2Cr",
    type: "Commercial",
    location: "Bandra",
    lastUpdate: "3d ago",
    createdDate: "2023-10-20",
    createdBy: "Alex Broker",
    assignedTo: "Mike Sales",
    interactions: 12,
    readiness: "Cold",
    notes: "Finds current market rates too high.",
  },
  {
    id: 5,
    name: "Vikram Singh",
    phone: "+91 90000 11111",
    email: "vikram@example.com",
    status: "Closed",
    source: "Walk-in",
    budget: "3.5Cr",
    type: "Penthouse",
    location: "Worli",
    lastUpdate: "1w ago",
    createdDate: "2023-10-15",
    createdBy: "Alex Broker",
    assignedTo: "Alex Broker",
    interactions: 20,
    readiness: "Closed",
    notes: "Deal done. Commission pending.",
  },
  {
    id: 6,
    name: "Anjali Desai",
    phone: "+91 95555 44444",
    email: "anjali@example.com",
    status: "Location Issue",
    source: "Website",
    budget: "95L",
    type: "2BHK",
    location: "Thane",
    lastUpdate: "5m ago",
    createdDate: "2023-10-25",
    createdBy: "Sarah Agent",
    assignedTo: "Sarah Agent",
    interactions: 0,
    readiness: "Cold",
    notes: "Wants closer to station.",
  },
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "Skyline Towers",
    builder: "Oberoi Realty",
    location: "Andheri West",
    zone: "West",
    price: "2.5 Cr - 4 Cr",
    type: "3 & 4 BHK",
    offer: "No GST",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400",
    pdf: "brochure.pdf",
  },
  {
    id: 2,
    name: "Green Valley",
    builder: "Lodha Group",
    location: "Thane",
    zone: "Central",
    price: "95 L - 1.5 Cr",
    type: "1 & 2 BHK",
    offer: "Free Modular Kitchen",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=400",
    pdf: "brochure.pdf",
  },
  {
    id: 3,
    name: "Sea Breeze",
    builder: "Rustomjee",
    location: "Worli",
    zone: "South",
    price: "5 Cr+",
    type: "Luxury Apts",
    offer: "Stamp Duty Waiver",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    pdf: "brochure.pdf",
  },
  {
    id: 4,
    name: "Tech Park Plaza",
    builder: "Godrej",
    location: "Vikhroli",
    zone: "East",
    price: "1.8 Cr - 3 Cr",
    type: "Commercial",
    offer: "Guaranteed Rentals",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
    pdf: "brochure.pdf",
  },
  {
    id: 5,
    name: "Hillside Villas",
    builder: "Hiranandani",
    location: "Powai",
    zone: "Central",
    price: "3 Cr - 6 Cr",
    type: "Villas",
    offer: "Launch Price",
    image:
      "https://images.unsplash.com/photo-1600596542815-60c37c6525fa?auto=format&fit=crop&q=80&w=400",
    pdf: "brochure.pdf",
  },
];

const INITIAL_NEWS_UPDATES = [
  {
    id: 1,
    title: "Metro Line 2A Operations Start",
    location: "Andheri West",
    time: "2h ago",
    tag: "Infra",
    zone: "West",
    content:
      "The much awaited Metro Line 2A has started full operations today, connecting Dahisar to Andheri West. This is expected to boost property prices in the region by 10-15% over the next quarter.",
  },
  {
    id: 2,
    title: "Property Rates hike by 5% in Thane",
    location: "Thane",
    time: "5h ago",
    tag: "Market",
    zone: "Central",
    content:
      "Major developers in Thane have announced a price hike citing rising input costs. New bookings made after the 1st of next month will reflect the updated pricing.",
  },
  {
    id: 3,
    title: "New Coastal Road connector approved",
    location: "Worli",
    time: "1d ago",
    tag: "Infra",
    zone: "South",
    content:
      "The municipal corporation has approved the new connector for the Coastal Road project at Worli. This will significantly reduce travel time to South Mumbai.",
  },
  {
    id: 4,
    title: "Stamp Duty cut expected next month",
    location: "Mumbai",
    time: "2d ago",
    tag: "Policy",
    zone: "All",
    content:
      "Sources suggest the state government is considering a 1% cut in stamp duty for female home buyers to encourage property ownership.",
  },
  {
    id: 5,
    title: "Airport expansion land acquisition done",
    location: "Navi Mumbai",
    time: "4h ago",
    tag: "Infra",
    zone: "East",
    content:
      "Land acquisition for phase 2 of the Navi Mumbai International Airport has been completed. Construction is set to begin next week.",
  },
];

const MOCK_VISITS = [
  {
    id: 101,
    leadName: "Amit Verma",
    property: "Sunset Villa, Lonavala",
    time: "11:00 AM",
    rawTime: "11:00",
    date: "Today",
    rawDate: "2023-10-26",
    status: "Scheduled",
    contact: "+91 91234 56789",
    notes: "Client arriving by car.",
    agent: "Mike Sales",
  },
  {
    id: 102,
    leadName: "Rahul Sharma",
    property: "Oberoi Springs, Andheri",
    time: "04:00 PM",
    rawTime: "16:00",
    date: "Today",
    rawDate: "2023-10-26",
    status: "Pending",
    contact: "+91 98765 43210",
    notes: "Confirm availability with owner.",
    agent: "Sarah Agent",
  },
  {
    id: 103,
    leadName: "Priya Patel",
    property: "Green Valley, Malad",
    time: "10:30 AM",
    rawTime: "10:30",
    date: "Tomorrow",
    rawDate: "2023-10-27",
    status: "Scheduled",
    contact: "+91 99887 76655",
    notes: "First visit.",
    agent: "Sarah Agent",
  },
  {
    id: 104,
    leadName: "Sneha Gupta",
    property: "BKC One, Bandra",
    time: "02:00 PM",
    rawTime: "14:00",
    date: "Oct 30",
    rawDate: "2023-10-30",
    status: "Done",
    contact: "+91 98765 12345",
    notes: "Liked the property, check negotiation.",
    agent: "Mike Sales",
  },
];

const STATS = [
  {
    label: "Total Leads",
    value: 42,
    change: "+12%",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    label: "Site Visits",
    value: 8,
    change: "+3 this week",
    icon: MapPin,
    color: "bg-purple-500",
  },
  {
    label: "Follow-ups",
    value: 15,
    change: "Due today",
    icon: Phone,
    color: "bg-orange-500",
  },
  {
    label: "Closed Deals",
    value: 3,
    change: "₹1.2L Comm.",
    icon: CheckCircle,
    color: "bg-green-500",
  },
];

const STATUS_COLORS = {
  "New Lead": "bg-blue-100 text-blue-800 border border-blue-200",
  Contacted: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  "Site Visit Scheduled":
    "bg-purple-100 text-purple-800 border border-purple-200",
  Negotiation: "bg-amber-100 text-amber-800 border border-amber-200",
  "Budget Issue": "bg-red-100 text-red-800 border border-red-200",
  "Location Issue": "bg-orange-100 text-orange-800 border border-orange-200",
  Closed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Lost: "bg-gray-100 text-gray-800 border border-gray-200",
};

const PIPELINE_DATA = [
  { stage: "New Lead", count: 12, value: "12Cr", color: "bg-blue-500" },
  { stage: "Contacted", count: 8, value: "8.5Cr", color: "bg-indigo-500" },
  { stage: "Site Visit", count: 5, value: "6.2Cr", color: "bg-purple-500" },
  { stage: "Negotiation", count: 3, value: "4.1Cr", color: "bg-amber-500" },
  { stage: "Closed", count: 1, value: "1.5Cr", color: "bg-emerald-500" },
];

const getMockInteractions = (leadId) => [
  {
    id: 1,
    type: "call",
    note: "Called client, interested in 3BHK.",
    date: "Today, 10:00 AM",
    icon: Phone,
  },
  {
    id: 2,
    type: "whatsapp",
    note: "Sent brochure for Oberoi Springs.",
    date: "Yesterday, 4:30 PM",
    icon: MessageCircle,
  },
  {
    id: 3,
    type: "note",
    note: "Client prefers lower floor.",
    date: "2 days ago",
    icon: FileText,
  },
];

// --- Utilities ---
const downloadCSV = (data, filename) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((obj) =>
    Object.values(obj)
      .map((val) => `"${val}"`)
      .join(","),
  );
  const csvContent =
    "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Components ---

const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ status }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 border border-gray-200 text-gray-600"}`}
  >
    {status}
  </span>
);

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-600 hover:bg-slate-50"
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

// --- Modals ---

const AddNewsModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onAdd({
      title: formData.get("title"),
      location: formData.get("location"),
      zone: formData.get("zone"),
      tag: formData.get("tag"),
      content: formData.get("content"),
      time: "Just now",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
          <div className="flex items-center gap-2">
            <Newspaper size={20} className="text-orange-600" />
            <h3 className="font-bold text-lg text-slate-800">
              Post Real Estate Update
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Headline
            </label>
            <input
              name="title"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. New Metro Line Approved"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Zone
              </label>
              <select
                name="zone"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              >
                <option value="West">West</option>
                <option value="Central">Central</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="All">All Mumbai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                name="tag"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              >
                <option value="Infra">Infra</option>
                <option value="Market">Market</option>
                <option value="Policy">Policy</option>
                <option value="Project">Project Launch</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              name="location"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. Andheri West"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Details
            </label>
            <textarea
              name="content"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24"
              placeholder="Describe the update..."
            ></textarea>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-200"
            >
              Post Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const WhatsAppBlastModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-green-50">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-green-600" />
            <h3 className="font-bold text-lg text-slate-800">
              WhatsApp Blast API
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Audience
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white">
              <option>All Leads (42)</option>
              <option>Hot Leads (5)</option>
              <option>Site Visit Scheduled (3)</option>
              <option>New Leads (This Week) (12)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Template
            </label>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button className="p-2 border border-green-200 bg-green-50 rounded-lg text-xs font-medium text-green-700 hover:bg-green-100 text-left">
                🚀 New Launch Alert
              </button>
              <button className="p-2 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 text-left">
                📅 Visit Reminder
              </button>
              <button className="p-2 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 text-left">
                🎉 Festival Offer
              </button>
              <button className="p-2 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 text-left">
                👋 Follow-up
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Message Preview
            </label>
            <textarea
              className="w-full h-32 p-3 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              defaultValue="Hi {lead_name}, exciting news! We just launched a new premium tower at Andheri West. 3BHK starting at 2.5Cr. Reply 'YES' for the e-brochure. - Alex, BrokerFlow"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              0 credits required (Free Tier)
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
            <div className="mt-0.5 text-yellow-600">
              <TrendingUp size={16} />
            </div>
            <p className="text-xs text-yellow-700">
              High delivery rate expected (98%). Messages will be queued and
              sent via WhatsApp Business API.
            </p>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2">
            <Send size={18} /> Send Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

const ScheduleVisitModal = ({ isOpen, onClose, preselectedLead }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-purple-600" />
            <h3 className="font-bold text-lg text-slate-800">
              Schedule Site Visit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <form className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Lead
            </label>
            <input
              defaultValue={preselectedLead?.name || ""}
              placeholder="Search Lead..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Property / Location
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                placeholder="e.g. Oberoi Springs, Andheri"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Visit Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="vtype"
                  className="text-purple-600 focus:ring-purple-500"
                  defaultChecked
                />{" "}
                In-Person
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="vtype"
                  className="text-purple-600 focus:ring-purple-500"
                />{" "}
                Virtual Tour
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes for Visit
            </label>
            <textarea
              className="w-full h-20 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              placeholder="Gate pass required? Client preferences?"
            ></textarea>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-200"
          >
            Confirm Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

const EditVisitModal = ({ isOpen, onClose, visit, onUpdate }) => {
  if (!isOpen || !visit) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedVisit = {
      ...visit,
      status: formData.get("status"),
      rawDate: formData.get("date"),
      date: "Updated Date", // In real app convert date
      rawTime: formData.get("time"),
      time:
        formData.get("time") +
        (parseInt(formData.get("time")) >= 12 ? " PM" : " AM"),
      notes: formData.get("notes"),
      property: formData.get("property"),
    };
    onUpdate(updatedVisit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
          <div className="flex items-center gap-2">
            <Edit2 size={20} className="text-blue-600" />
            <h3 className="font-bold text-lg text-slate-800">
              Edit Site Visit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lead Name
            </label>
            <input
              defaultValue={visit.leadName}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={visit.status}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Done">Done</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                name="date"
                type="date"
                defaultValue={visit.rawDate}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Time
              </label>
              <input
                name="time"
                type="time"
                defaultValue={visit.rawTime}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Property / Location
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name="property"
                defaultValue={visit.property}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              defaultValue={visit.notes}
              className="w-full h-20 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-200"
          >
            Update Visit
          </button>
        </form>
      </div>
    </div>
  );
};

const AddLeadModal = ({ isOpen, onClose, onAdd, currentUser }) => {
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onAdd({
      name: formData.get("name"),
      phone: formData.get("phone"),
      budget: formData.get("budget"),
      type: formData.get("type"),
      source: formData.get("source"),
      status: "New Lead",
      location: formData.get("location"),
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: currentUser.name,
      assignedTo: currentUser.name, // Default assignment
      interactions: 0,
      lastUpdate: "Just now",
      readiness: "Warm",
      notes: "Newly added lead.",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Add New Lead</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              required
              type="tel"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Source
              </label>
              <select
                name="source"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option>Walk-in</option>
                <option>Website</option>
                <option>MagicBricks</option>
                <option>99Acres</option>
                <option>Referral</option>
                <option>Facebook Ad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type
              </label>
              <select
                name="type"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option>2BHK</option>
                <option>3BHK</option>
                <option>Villa</option>
                <option>Commercial</option>
                <option>Plot</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Budget
              </label>
              <input
                name="budget"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g. 1.5Cr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preferred Location
              </label>
              <input
                name="location"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="e.g. Andheri West"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200"
            >
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddProjectModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onAdd({
      name: formData.get("name"),
      builder: formData.get("builder"),
      location: formData.get("location"),
      zone: formData.get("zone"),
      price: formData.get("price"),
      type: formData.get("type"),
      offer: formData.get("offer"),
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400", // placeholder
      pdf: formData.get("pdf")?.name || "brochure.pdf",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50 sticky top-0 z-10">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Building size={20} /> Add New Project
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project Name
            </label>
            <input
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Skyline Towers"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Builder
              </label>
              <input
                name="builder"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Lodha"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Zone
              </label>
              <select
                name="zone"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Central">Central</option>
                <option value="West">West</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="North">North</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <input
                name="location"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Andheri West"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Configuration
              </label>
              <input
                name="type"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 2 & 3 BHK"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price Range
            </label>
            <input
              name="price"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 1.5 Cr - 2.2 Cr"
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
            <label className="block text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
              <Tag size={16} /> Project Offer / Deal
            </label>
            <input
              name="offer"
              className="w-full px-4 py-2 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
              placeholder="e.g. No GST, Free Car Parking"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Brochure (PDF)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                name="pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload size={24} className="text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">
                Click to upload or drag & drop
              </span>
              <span className="text-xs text-slate-400 mt-1">
                PDF up to 10MB
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              List Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MobileNav = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 flex flex-col space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <span className="text-xl font-bold text-indigo-600">BrokerFlow</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => {
            setActiveTab("dashboard");
            setIsOpen(false);
          }}
        />
        <NavItem
          icon={Users}
          label="Leads"
          active={activeTab === "leads"}
          onClick={() => {
            setActiveTab("leads");
            setIsOpen(false);
          }}
        />
        <NavItem
          icon={Building}
          label="Projects"
          active={activeTab === "projects"}
          onClick={() => {
            setActiveTab("projects");
            setIsOpen(false);
          }}
        />
        <NavItem
          icon={MapPin}
          label="Site Visits"
          active={activeTab === "visits"}
          onClick={() => {
            setActiveTab("visits");
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

const LeadDetailsSidebar = ({ lead, onClose, onScheduleVisit }) => {
  if (!lead) return null;

  const interactions = getMockInteractions(lead.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100 p-4 flex items-center justify-between shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Profile Section */}
          <div className="text-center">
            <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-lg mb-4">
              {lead.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{lead.name}</h3>
            <p className="text-slate-500 font-medium">{lead.phone}</p>
            <div className="flex justify-center mt-3 gap-2 flex-wrap">
              <Badge status={lead.status} />
              {lead.source && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {lead.source}
                </span>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Created by:{" "}
              <span className="font-medium text-slate-600">
                {lead.createdBy}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-green-700 border border-green-100">
                <MessageCircle size={24} className="mb-1" />
                <span className="text-xs font-semibold">WhatsApp</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-indigo-700 border border-indigo-100">
                <Phone size={24} className="mb-1" />
                <span className="text-xs font-semibold">Call</span>
              </button>
              <button
                onClick={() => onScheduleVisit(lead)}
                className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-purple-700 border border-purple-100"
              >
                <Calendar size={24} className="mb-1" />
                <span className="text-xs font-semibold">Visit</span>
              </button>
            </div>
          </div>

          {/* Analysis & Requirements */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={16} className="text-indigo-600" /> Lead Analysis
            </h4>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                    Budget
                  </span>
                  <span className="font-bold text-slate-800 text-lg">
                    {lead.budget}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                    Requirement
                  </span>
                  <span className="font-bold text-slate-800 text-lg">
                    {lead.type}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                    Location
                  </span>
                  <span className="font-bold text-slate-800">
                    {lead.location}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-1">
                    Readiness
                  </span>
                  <span
                    className={`font-bold ${lead.readiness === "Hot" ? "text-red-600" : lead.readiness === "Warm" ? "text-orange-500" : "text-blue-500"}`}
                  >
                    {lead.readiness} Interest
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-2">
                  Broker Notes
                </span>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-600 italic">
                  "{lead.notes}"
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up / Activity Timeline */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" /> Follow-up Activity
            </h4>
            <div className="space-y-6 border-l-2 border-indigo-100 ml-3 pl-6 relative">
              {interactions.map((item, idx) => (
                <div key={idx} className="relative group">
                  <span
                    className={`absolute -left-[31px] top-0 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 ${item.type === "call" ? "bg-indigo-500" : item.type === "whatsapp" ? "bg-green-500" : "bg-slate-400"}`}
                  >
                    <item.icon size={10} className="text-white" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.note}
                    </p>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}

              {/* Add Interaction Box */}
              <div className="relative mt-8">
                <span className="absolute -left-[31px] top-2 h-6 w-6 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center shadow-sm">
                  <Plus size={12} className="text-slate-500" />
                </span>
                <textarea
                  placeholder="Log a new call, note, or meeting..."
                  className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-24 bg-slate-50/50 transition-all"
                ></textarea>
                <button className="mt-2 w-full text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg">
                  Log Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsDetailsSidebar = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100 p-4 flex items-center justify-between shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Newspaper size={18} className="text-orange-600" /> Update Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                {news.tag}
              </span>
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                {news.zone}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {news.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {news.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {news.location}
              </span>
            </div>
            <div className="prose prose-sm text-slate-600 leading-relaxed">
              <p>
                {news.content ||
                  "No detailed content available for this update."}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="font-semibold text-slate-800 mb-3">Share Update</h4>
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                <Share2 size={16} /> Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]); // Default to Admin
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [visitLead, setVisitLead] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);

  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [newsUpdates, setNewsUpdates] = useState(INITIAL_NEWS_UPDATES);
  const [visits, setVisits] = useState(MOCK_VISITS);

  const [searchQuery, setSearchQuery] = useState("");
  const [visitFilter, setVisitFilter] = useState("today");

  // Date Range Filters
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Advanced Filters
  const [projectZoneFilter, setProjectZoneFilter] = useState("All");
  const [projectLocationFilter, setProjectLocationFilter] = useState("");
  const [newsLocationFilter, setNewsLocationFilter] = useState("All");
  const [dashboardAgentFilter, setDashboardAgentFilter] = useState("All"); // For Admin Dashboard

  const handleAddLead = (newLead) => {
    setLeads([{ id: Date.now(), ...newLead }, ...leads]);
  };

  const handleAddProject = (newProject) => {
    setProjects([{ id: Date.now(), ...newProject }, ...projects]);
  };

  const handleAddNews = (newNews) => {
    setNewsUpdates([{ id: Date.now(), ...newNews }, ...newsUpdates]);
  };

  const handleScheduleVisit = (lead) => {
    setVisitLead(lead);
    setIsVisitModalOpen(true);
  };

  const handleEditVisit = (visit) => {
    setEditingVisit(visit);
    setIsEditVisitModalOpen(true);
  };

  const handleUpdateVisit = (updatedVisit) => {
    setVisits(visits.map((v) => (v.id === updatedVisit.id ? updatedVisit : v)));
  };

  // --- Filtering Logic ---

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // 1. Search Filter
      const matchesSearch =
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone.includes(searchQuery) ||
        l.location.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Date Range Filter
      const leadDate = new Date(l.createdDate);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;
      const matchesDate =
        (!start || leadDate >= start) && (!end || leadDate <= end);

      // 3. Role Access (Admin sees all, Agent sees only assigned/created)
      const matchesRole =
        currentUser.role === "admin"
          ? true
          : l.assignedTo === currentUser.name ||
            l.createdBy === currentUser.name;

      return matchesSearch && matchesDate && matchesRole;
    });
  }, [leads, searchQuery, dateRange, currentUser]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesZone =
        projectZoneFilter === "All" || p.zone === projectZoneFilter;
      const matchesLocation =
        p.location
          .toLowerCase()
          .includes(projectLocationFilter.toLowerCase()) ||
        p.name.toLowerCase().includes(projectLocationFilter.toLowerCase());
      return matchesZone && matchesLocation;
    });
  }, [projects, projectZoneFilter, projectLocationFilter]);

  const filteredNews = useMemo(() => {
    if (newsLocationFilter === "All") return newsUpdates;
    return newsUpdates.filter(
      (n) => n.zone === newsLocationFilter || n.zone === "All",
    );
  }, [newsLocationFilter, newsUpdates]);

  const filteredVisits = useMemo(() => {
    // Admin can filter visits by agent, Agent sees only theirs
    let visibleVisits = visits;
    if (currentUser.role !== "admin") {
      visibleVisits = visits.filter((v) => v.agent === currentUser.name);
    }
    return visibleVisits;
  }, [visits, currentUser]);

  // --- Views ---

  const DashboardView = () => {
    // Admin: Filter dashboard stats based on selected agent
    // Agent: See only their own stats
    const displayedLeads =
      currentUser.role === "admin" && dashboardAgentFilter !== "All"
        ? leads.filter((l) => l.assignedTo === dashboardAgentFilter)
        : currentUser.role === "admin"
          ? leads
          : leads.filter((l) => l.assignedTo === currentUser.name);

    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        {/* Admin Control: Filter Dashboard by User */}
        {currentUser.role === "admin" && (
          <div className="flex justify-end items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-600 mr-3">
              View Activity For:
            </span>
            <select
              value={dashboardAgentFilter}
              onChange={(e) => setDashboardAgentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Agents</option>
              {MOCK_USERS.filter((u) => u.role !== "admin").map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, idx) => (
            <Card
              key={idx}
              className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon
                    size={24}
                    className={stat.color.replace("bg-", "text-")}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {stat.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Real Estate Updates Section */}
            <Card className="p-5 border-l-4 border-l-orange-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Newspaper size={20} className="text-orange-600" /> Real
                  Estate Updates
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={newsLocationFilter}
                    onChange={(e) => setNewsLocationFilter(e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="All">All Zones</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                  </select>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => setIsAddNewsModalOpen(true)}
                      className="p-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                      title="Add Update"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {filteredNews.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => setSelectedNews(news)}
                    className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {news.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          {news.time}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {news.location}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                          {news.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredNews.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No updates for this zone.
                  </p>
                )}
              </div>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-600" /> Pipeline
                Analysis
              </h2>
              <button className="text-sm text-slate-500 hover:text-indigo-600">
                View Full Report
              </button>
            </div>

            {/* Pipeline Card */}
            <Card className="p-6">
              <div className="space-y-4">
                {PIPELINE_DATA.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-700">
                        {item.stage}
                      </span>
                      <span className="text-slate-500">
                        {item.count} Leads{" "}
                        <span className="text-slate-300">|</span>{" "}
                        <span className="font-bold text-slate-800">
                          ₹{item.value}
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${item.color} h-2.5 rounded-full`}
                        style={{ width: `${(item.count / 42) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-between items-center pt-2">
              <h2 className="text-lg font-bold text-slate-800">
                Priority Follow-ups
              </h2>
              <button
                onClick={() => setActiveTab("leads")}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {displayedLeads.slice(0, 3).map((lead) => (
                <Card
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="p-4 flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {lead.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {lead.type} • {lead.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge status={lead.status} />
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions (Sidebar Widget) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
            <Card className="p-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center space-x-3 transition-colors"
              >
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <Plus size={18} />
                </div>
                <div>
                  <span className="block font-bold text-slate-700 text-sm">
                    Add New Lead
                  </span>
                  <span className="block text-xs text-slate-400">
                    Capture details instantly
                  </span>
                </div>
              </button>
              <div className="h-px bg-slate-50 mx-3 my-1"></div>
              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center space-x-3 transition-colors"
              >
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <span className="block font-bold text-slate-700 text-sm">
                    WhatsApp Blast
                  </span>
                  <span className="block text-xs text-slate-400">
                    Send bulk updates via API
                  </span>
                </div>
              </button>
              <div className="h-px bg-slate-50 mx-3 my-1"></div>
              <button
                onClick={() => setIsVisitModalOpen(true)}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center space-x-3 transition-colors"
              >
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="block font-bold text-slate-700 text-sm">
                    Schedule Visit
                  </span>
                  <span className="block text-xs text-slate-400">
                    Book property viewing
                  </span>
                </div>
              </button>
            </Card>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 text-white shadow-lg">
              <h3 className="font-bold mb-1">Pro Tip</h3>
              <p className="text-sm opacity-90 mb-3">
                Leads contacted within 5 mins convert 9x better.
              </p>
              <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                View Engagement Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LeadsView = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Search name, phone, or location..."
          />
        </div>
        <div className="flex gap-2 items-center">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white px-2 py-1 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">From</span>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="px-2 py-1.5 text-xs bg-slate-50 border-none rounded-lg text-slate-600 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400">To</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="px-2 py-1.5 text-xs bg-slate-50 border-none rounded-lg text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => downloadCSV(filteredLeads, "leads_report.csv")}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            title="Download Report"
          >
            <Download size={20} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Lead</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <Card
            key={lead.id}
            onClick={() => setSelectedLead(lead)}
            className="p-4 hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-500"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                    {lead.name}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {lead.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {lead.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} /> {lead.budget}
                    </span>
                    {lead.createdDate && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded-full text-xs text-slate-400">
                        Added: {lead.createdDate}
                      </span>
                    )}
                  </div>
                  {currentUser.role === "admin" && (
                    <div className="text-xs text-slate-400 mt-1">
                      Created by:{" "}
                      <span className="font-medium text-indigo-600">
                        {lead.createdBy}
                      </span>{" "}
                      • Assigned to:{" "}
                      <span className="font-medium text-slate-600">
                        {lead.assignedTo}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-16 sm:pl-0">
                <div className="text-right hidden sm:block">
                  <Badge status={lead.status} />
                  <p className="text-xs text-slate-400 mt-1">
                    {lead.lastUpdate}
                  </p>
                </div>

                <div className="sm:hidden">
                  <Badge status={lead.status} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWhatsAppModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <MessageCircle size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); /* Logic to call */
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filteredLeads.length === 0 && (
          <p className="text-center text-slate-400 py-8">
            No leads found matching criteria.
          </p>
        )}
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Our Projects</h2>
          <p className="text-sm text-slate-500">
            Manage listings and brochures
          </p>
        </div>
        {currentUser.role === "admin" && (
          <button
            onClick={() => setIsAddProjectModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> Add Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filters:</span>
        </div>
        <select
          value={projectZoneFilter}
          onChange={(e) => setProjectZoneFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Zones</option>
          <option value="West">West Mumbai</option>
          <option value="Central">Central Suburbs</option>
          <option value="South">South Mumbai</option>
          <option value="East">East Suburbs</option>
          <option value="North">North Mumbai</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={projectLocationFilter}
            onChange={(e) => setProjectLocationFilter(e.target.value)}
            placeholder="Search by Location or Project Name..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Projects Grid (4 in a line on XL screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col group"
          >
            <div className="h-40 bg-slate-200 relative overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                {project.zone}
              </div>
              {project.offer && (
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/90 text-yellow-950 text-xs font-bold px-3 py-1.5 flex items-center gap-1">
                  <Tag size={12} /> {project.offer}
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {project.name}
                </h3>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                {project.builder}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                <MapPin size={12} /> {project.location}
              </p>

              <div className="mt-auto space-y-3">
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-800">
                    {project.price}
                  </span>
                  <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                    {project.type}
                  </span>
                </div>
                <button className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <FileText size={16} /> View Brochure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <p className="text-center text-slate-400 py-12">
          No projects found matching filters.
        </p>
      )}
    </div>
  );

  const SiteVisitsView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Site Visits</h2>
        <div className="flex gap-2">
          <button
            onClick={() => downloadCSV(filteredVisits, "visits_report.csv")}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            title="Download Report"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => setIsVisitModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={16} /> Schedule New
          </button>
        </div>
      </div>

      {/* Time Filters */}
      <div className="bg-white p-1 rounded-xl inline-flex border border-slate-200 shadow-sm">
        {["today", "week", "month"].map((filter) => (
          <button
            key={filter}
            onClick={() => setVisitFilter(filter)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${visitFilter === filter ? "bg-purple-100 text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {filter === "today"
              ? "Today"
              : filter === "week"
                ? "This Week"
                : "This Month"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredVisits.map((visit) => (
          <Card key={visit.id} className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                  <span className="text-xs text-purple-600 font-bold uppercase">
                    {visit.date}
                  </span>
                  <span className="text-lg font-bold text-slate-800">
                    {visit.time.split(" ")[0]}
                  </span>
                  <span className="text-xs text-slate-500">
                    {visit.time.split(" ")[1]}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {visit.leadName}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <MapPin size={14} /> {visit.property}
                  </div>
                  {currentUser.role === "admin" && (
                    <div className="text-xs text-slate-400 mt-1">
                      Agent: {visit.agent}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditVisit(visit)}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Visit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${visit.status === "Done" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {visit.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded hover:text-green-600">
                    <MessageCircle size={18} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded hover:text-indigo-600">
                    <Phone size={18} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BrokerFlow
          </h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">
            PRO EDITION
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={Users}
            label="Leads"
            active={activeTab === "leads"}
            onClick={() => setActiveTab("leads")}
          />
          <NavItem
            icon={Building}
            label="Projects"
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
          />
          <NavItem
            icon={MapPin}
            label="Site Visits"
            active={activeTab === "visits"}
            onClick={() => setActiveTab("visits")}
          />
        </nav>

        {/* User Switcher (Simulating Auth) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Signed in as
          </div>
          <div className="relative group">
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            {/* Dropdown for Mock Auth */}
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-hover:block z-50">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl ${currentUser.id === user.id ? "bg-slate-50 font-bold text-indigo-600" : "text-slate-600"}`}
                >
                  {user.name}{" "}
                  <span className="text-xs text-slate-400 ml-1">
                    ({user.role})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} className="text-slate-700" />
            </button>
            <span className="font-bold text-lg text-indigo-600">
              BrokerFlow
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
            {currentUser.name.charAt(0)}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 capitalize">
                {activeTab.replace("-", " ")}
              </h2>
              <p className="text-slate-500">Welcome back, {currentUser.name}</p>
            </div>
          </div>

          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "leads" && <LeadsView />}
          {activeTab === "projects" && <ProjectsView />}
          {activeTab === "visits" && <SiteVisitsView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileNavOpen}
        setIsOpen={setIsMobileNavOpen}
      />
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLead}
        currentUser={currentUser}
      />
      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onAdd={handleAddProject}
      />
      <AddNewsModal
        isOpen={isAddNewsModalOpen}
        onClose={() => setIsAddNewsModalOpen(false)}
        onAdd={handleAddNews}
      />
      <WhatsAppBlastModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
      <ScheduleVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
          setVisitLead(null);
        }}
        preselectedLead={visitLead}
      />
      <EditVisitModal
        isOpen={isEditVisitModalOpen}
        onClose={() => setIsEditVisitModalOpen(false)}
        visit={editingVisit}
        onUpdate={handleUpdateVisit}
      />
      <LeadDetailsSidebar
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onScheduleVisit={(lead) => {
          setSelectedLead(null);
          handleScheduleVisit(lead);
        }}
      />
      <NewsDetailsSidebar
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    </div>
  );
}
