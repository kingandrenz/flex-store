import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  

  useEffect(() => {
    if (userInfo) {
      navigate(redirect, { replace: true });
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({...userData}));
      toast.success("Login successful");
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <section className="pl-[10rem] flex flex-flex-wrap ">
        <div className="mr-[4rem] mt[5rem]">
          <h1 className="text-2xl font-semibold mt-4">Sign In</h1>
          <form onSubmit={handleSubmit} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="my-[2rem] text-sm font-medium text-black">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button disabled={isLoading} type="submit" className="bg-blue-500 text-white py-2
             px-4 rounded cursor-pointer my-1rem">{isLoading ? "Signing in..." : "Login"}</button>

             {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-black">
              Don't have an account?{" "}
              <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
