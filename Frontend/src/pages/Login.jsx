// import React, { useState ,useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch ,useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import Button from "../components/Button";
// import Input from "../components/Input";
// import { loginUserAPI } from "../features/auth/authAPI";
// import { login } from "../features/auth/authSlice"

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//     const {
//       register,
//       handleSubmit,
//       formState: { errors },
//     } = useForm();
//     const [serverError, setServerError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const { user } = useSelector((state) => state.auth)

//      useEffect(() => {
//           if (user) {
//             console.log("user : ",user)
//             if (user.role === "super_admin") navigate("/admin/dashboard")
//             else if (user.role === "hr") navigate("/HR/dashboard")
//             else navigate("/employee/dashboard")
//           }
//         }, [user])

//       const Loginsubmit = async (data) => {
//         setLoading(true);
//         setServerError("");
//         try {
//           const response = await loginUserAPI(data)
//           console.log(response)
//           const user = response.data.user
//           console.log(user)
//           if (!user) {
//             throw new Error("Invalid server response");
//           }
//           dispatch(login(user));
//           console.log(user.role)

//         } catch (err) {
//           setServerError(err.message);
//         }finally {
//         setLoading(false);
//           }

//         }

//   return (
//     <div className="h-screen flex flex-col bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">


//       <div className="flex-1 flex items-center justify-center px-4">

//         <form
//           onSubmit={handleSubmit(Loginsubmit)}
//           className="w-full max-w-md bg-white/10 backdrop-blur-xl 
//                      p-8 rounded-3xl shadow-2xl border border-white/20 
//                      flex flex-col gap-5"
//         >
//           <h2 className="text-3xl font-bold text-center text-white">
//             Welcome Back 👋
//           </h2>

//           <p className="text-center text-white/80 text-sm">
//             Login to continue
//           </p>

//           <div>
//             <Input
//               label="Email"
//               type="email"
//               placeholder="Enter your email"
//               {...register("email", { required: "Email is required" })}
//               className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
//                          placeholder-white/70 text-white focus:outline-none 
//                          focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

    
//           <div>
//             <Input
//               label="Password"
//               type="password"
//               placeholder="Enter your password"
//               {...register("password", { required: "Password is required" })}
//               className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
//                          placeholder-white/70 text-white focus:outline-none 
//                          focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

         
//           {serverError && (
//             <p className="text-red-500 text-sm text-center bg-red-100 py-2 rounded-lg">
//               {serverError}
//             </p>
//           )}

         
//           <Button
//             type="submit"
//             bgColor="bg-gradient-to-r from-indigo-600 to-purple-600"
//             className="w-full py-2 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </Button>

          
//         </form>

//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch ,useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import Input from "../components/Input";
import { loginUserAPI } from "../features/auth/authAPI";
import { login } from "../features/auth/authSlice"

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      if (user.role === "super_admin") navigate("/admin/dashboard")
      else if (user.role === "hr") navigate("/HR/dashboard")
      else navigate("/employee/dashboard")
    }
  }, [user])

  const Loginsubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await loginUserAPI(data)
      const user = response.data.user

      if (!user) {
        throw new Error("Invalid server response");
      }

      dispatch(login(user));

    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">

      {/* 🔥 LEFT SIDE (IMAGE + TEXT) */}
      <div className="hidden md:flex w-1/2 items-center justify-center flex-col text-white px-10">
        
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          className="w-72 mb-6 drop-shadow-2xl"
        />

        <h1 className="text-4xl font-bold mb-3 text-center">
          Welcome Back 👋
        </h1>

        <p className="text-center opacity-80 max-w-md">
          Manage your company, tasks and employees efficiently with our smart system.
        </p>
      </div>

      {/* 🔥 RIGHT SIDE (FORM) */}
      <div className="flex-1 flex items-center justify-center px-4">

        <form
          onSubmit={handleSubmit(Loginsubmit)}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl 
                     p-8 rounded-3xl shadow-2xl border border-white/20 
                     flex flex-col gap-5"
        >
          <h2 className="text-3xl font-bold text-center text-white">
            Login
          </h2>

          <p className="text-center text-white/70 text-sm">
            Enter your credentials to continue
          </p>

          {/* EMAIL */}
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:outline-none 
                         focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:outline-none 
                         focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ERROR */}
          {serverError && (
            <p className="text-red-500 text-sm text-center bg-red-100/20 py-2 rounded-lg">
              {serverError}
            </p>
          )}

          {/* BUTTON */}
          <Button
            type="submit"
            bgColor="bg-gradient-to-r from-indigo-600 to-purple-600"
            className="w-full py-3 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </form>

      </div>
    </div>
  );
}

export default Login;