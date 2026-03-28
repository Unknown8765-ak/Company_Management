import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL ="http://localhost:8000";

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {}

    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="w-full flex justify-end p-4 absolute top-0 right-0">
      {!status ? (
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Login
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;