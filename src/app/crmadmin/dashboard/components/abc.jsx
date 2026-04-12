/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, School, Users, Shield,
  Package, Settings, Bell, Search, TrendingUp, TrendingDown,
  ChevronRight, Activity, LogOut, Moon, Sun,
  AlertCircle, CheckCircle2, RefreshCw, Lock, UserPlus, MoreHorizontal
} from "lucide-react";

// Real Hooks from your project
import { useGetAllSchool } from "../../Setup/School/hooks";
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";
import { useGetAllUsers } from "@/app/SuperAdmin/accessControl/user/hooks";
import { useGetAllInstitution } from "@/app/SuperAdmin/institutionSetup/Institution/hooks";

// --- THEME DEFINITIONS ---
const LIGHT = {
  bg: "#F4F3EF", surface: "#FFFFFF", surface2: "#F8F7F4", border: "rgba(0,0,0,0.07)",
  text: "#18181A", muted: "#72716B", sidebar: "#FFFFFF",
  hero: "linear-gradient(135deg,#1D4ED8 0%,#2563EB 50%,#3B82F6 100%)",
};
const DARK = {
  bg: "#0C0C0A", surface: "#161614", surface2: "#1E1E1C", border: "rgba(255,255,255,0.07)",
  text: "#EDECEA", muted: "#6B6A65", sidebar: "#111110",
  hero: "linear-gradient(135deg,#1E3A8A 0%,#1D4ED8 50%,#2563EB 100%)",
};

// --- SUB-COMPONENTS ---
const AnimatedNumber = ({ target }: { target: number }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40) || 1;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(start);
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}</>;
};

const Dashboard: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [institutionId, setInstitutionId] = useState("");
  const navigate = useRouter();
  const T = dark ? DARK : LIGHT;

  // 1. Authentication & LocalStorage Logic
  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails");
    if (userDetailsString) {
      try {
        const parsed = JSON.parse(userDetailsString);
        setInstitutionId(parsed.institutionId || "");
      } catch (e) { console.error("Failed to parse userDetails", e); }
    }
    const token = localStorage.getItem("token");
    if (!token) navigate.push("/");
  }, [navigate]);

  // 2. Real Data Fetching
  const { data: schools } = useGetAllSchool();
  const { data: roles } = useGetAllRoles();
  const { data: users } = useGetAllUsers();
  const { data: institutions } = useGetAllInstitution();

  const STAT_CARDS = [
    { label: "Total Roles", value: roles?.TotalItems ?? 0, accent: "#3B82F6", icon: Shield },
    { label: "Total Users", value: users?.TotalItems ?? 0, accent: "#14B8A6", icon: Users },
    { label: "Institutions", value: institutions?.TotalItems ?? 0, accent: "#EF4444", icon: Building2 },
    { label: "Total Schools", value: schools?.TotalItems ?? 0, accent: "#F59E0B", icon: School },
  ];

  // 3. Styles (Inline for demo, consider Tailwind for production)
  const s: any = {
    root: { display: "flex", minHeight: "100vh", background: T.bg, color: T.text, transition: "all 0.3s ease" },
    sidebar: { width: 240, background: T.sidebar, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column" },
    main: { flex: 1, display: "flex", flexDirection: "column" },
    content: { padding: "24px 32px", display: "flex", flexDirection: "column", gap: "24px" },
    card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 },
    statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  };

  return (
    <div style={s.root}>
      {/* Sidebar Navigation */}
      <aside style={s.sidebar}>
        <div className="p-6 border-b" style={{ borderColor: T.border }}>
          <h1 className="font-bold text-xl tracking-tighter">CRM<span className="text-blue-500">Admin</span></h1>
        </div>
        <nav className="p-4 flex-1">
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 text-blue-500 rounded-lg cursor-pointer">
            <LayoutDashboard size={18} />
            <span className="font-semibold">Dashboard</span>
          </div>
          {/* Add more nav items here */}
        </nav>
      </aside>

      <main style={s.main}>
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8" style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-full w-80">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none ml-2 text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center gap-2 border-l pl-4" style={{ borderColor: T.border }}>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">AD</div>
              <span className="text-sm font-medium">Super Admin</span>
            </div>
          </div>
        </header>

        <div style={s.content}>
          {/* Hero Section */}
          <div style={{ ...s.card, background: T.hero, color: 'white' }}>
            <h2 className="text-2xl font-bold mb-1">Welcome back, Admin!</h2>
            <p className="opacity-80 text-sm">Institution ID: {institutionId || "Loading..."}</p>
          </div>

          {/* Stat Cards */}
          <div style={s.statGrid}>
            {STAT_CARDS.map((stat, i) => (
              <div key={i} style={s.card} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: stat.accent }} />
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg" style={{ background: `${stat.accent}15`, color: stat.accent }}>
                    <stat.icon size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  <AnimatedNumber target={stat.value} />
                </div>
                <div className="text-xs font-medium uppercase tracking-wider opacity-60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2" style={s.card}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Growth Overview</h3>
                <Activity size={18} className="text-blue-500" />
              </div>
              <div className="h-64 bg-gray-50 dark:bg-zinc-900 rounded-lg flex items-center justify-center border border-dashed" style={{ borderColor: T.border }}>
                <p className="text-sm text-gray-400">BarChart Component Integration Ready</p>
              </div>
            </div>
            <div style={s.card}>
              <h3 className="font-bold mb-6">Distribution</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
                  <span className="text-xl font-bold">{schools?.TotalItems ?? 0}</span>
                </div>
                <p className="text-xs text-center opacity-70">Active Schools across all regions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;