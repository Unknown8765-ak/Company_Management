import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

function Home() {

  const { loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="w-full py-16 text-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
      
      <Navbar />

      {/* 🔥 HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-32">

        {/* LEFT TEXT */}
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Manage Your Company <br /> Smartly 🚀
          </h1>

          <p className="text-lg opacity-90 max-w-md">
            Employees, tasks, and reports — sab ek jagah, simple aur powerful system.
          </p>

          {/* 🔥 CTA BUTTON */}
          <button className="mt-4 bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition">
            Get Started
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="dashboard"
            className="w-72 md:w-96 drop-shadow-2xl hover:scale-105 transition duration-300"
          />
        </div>

      </div>

      {/* 🔥 FEATURES */}
      <div className="mt-28 px-6 md:px-12">
        <h2 className="text-3xl font-semibold text-center mb-12">
          What You Can Do 💡
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-white/30 transition duration-300">
            <h3 className="font-bold text-lg mb-2">👨‍💼 Employee Management</h3>
            <p className="text-sm opacity-90">
              Add, manage and organize employees easily.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-white/30 transition duration-300">
            <h3 className="font-bold text-lg mb-2">📋 Task Tracking</h3>
            <p className="text-sm opacity-90">
              Assign tasks and monitor progress efficiently.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-white/30 transition duration-300">
            <h3 className="font-bold text-lg mb-2">🔔 Notifications</h3>
            <p className="text-sm opacity-90">
              Stay updated with real-time alerts.
            </p>
          </div>

        </div>
      </div>

      {/* 🔥 EXTRA SECTION (NEW - more professional feel) */}
      <div className="mt-28 flex flex-col md:flex-row items-center justify-between px-6 md:px-12">

        {/* IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2620/2620991.png"
            alt="productivity"
            className="w-64 md:w-80 hover:scale-105 transition"
          />
        </div>

        {/* TEXT */}
        <div className="md:w-1/2 text-center md:text-left mt-10 md:mt-0">
          <h2 className="text-3xl font-bold mb-4">
            Boost Productivity ⚡
          </h2>
          <p className="opacity-90 max-w-md">
            Smart workflows and real-time updates help your team stay focused and productive.
          </p>
        </div>

      </div>

      <div className="text-center mt-20 py-6 text-sm opacity-80">
        © 2026 Company Management System
      </div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-400 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 opacity-30 blur-3xl rounded-full"></div>

    </div>
  );
}

export default Home;