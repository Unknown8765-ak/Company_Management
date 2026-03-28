import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_API_URL;
  const { status: authStatus, user, loading } = useSelector(
  (state) => state.auth
);

  console.log("AUTH STATE 👉", authStatus);

//   useEffect(() => {
//       if (!loading && authStatus && user) {
//           if (user.role === "admin") {
//               navigate("/Admin/dashboard");
//             } else if (user.role === "hr") {
//                 navigate("/HR/dashboard");
//             } else {
//                 navigate("/employee/dashboard");
//             }
//         }
//     }, [authStatus, user, loading]);
    
    if (loading) {
      return (
        <div className="w-full py-16 text-center">
          Loading...
        </div>
      );
    }

  return (
    
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">
        <Navbar />
</div>
  )
}
export default Home;



