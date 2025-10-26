import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"; // Combine useLocation and useNavigate
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
// import Loader from "../../components/Loader"; // Uncomment if you use a separate Loader component

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      // Use replace: true to prevent the register page from staying in history
      navigate(redirect, { replace: true });
      // Removed the toast.success here, usually you toast after an action.
    }
  }, [navigate, redirect, userInfo]); // Add userInfo to dependency array for completeness

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match"); // Corrected grammar for toast message
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("User successfully registered");
        // Use replace: true here for a cleaner history stack after registration
        navigate(redirect, { replace: true });
      } catch (error) {
        console.error(error); // Use console.error for errors
        toast.error(error?.data?.message || error.error || "Registration failed"); // More robust error message
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100"> {/* Centering and background */}
      <section className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"> {/* Card-like section */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1" // Use gray-700
            >
              Username
            </label>
            <input
              type="text" // Change type to "text"
              id="username"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500" // Consistent styling
              placeholder="Enter username" // Correct placeholder
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-lg font-semibold
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                       transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already a user?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-indigo-600 hover:underline font-medium"
            >
              Click to Login
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;