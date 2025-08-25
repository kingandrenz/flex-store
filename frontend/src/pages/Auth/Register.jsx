import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector(state => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
            TransformStream.success("User successfully created");
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("password do not match");
        } else {
            try {
                const res = await register({username, email, password}).unwrap();
                dispatch(setCredentials({...res}));
                navigate(redirect);
                toast.success("user succesfully registered")
            } catch (error) {
                console.log(error);
                toast.error(error?.data?.message);
            }
        }
    }

    return (
        <section className="pl-[10rem] flex flex-wrap">
            <div className="mr-[4rem] mt-[5rem]">
                <h1 className="text-2xl font-semibold mb-4">Register</h1>

                <form onSubmit={submitHandler} className="container w-[40rem]">
                    <div className="my-[2rem]">
                        <label 
                            htmlFor="username"
                            className="block text-sm font-medium text-black">
                            User Name
                        </label>
                        <input
                            type="username"
                            id="username"
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Enter Email"
                            value={username}
                            onChange={(e)=> setUsername(e.target.value)}
                        />
                    </div>
                    <div className="my-[2rem]">
                        <label 
                            htmlFor="email"
                            className="block text-sm font-medium text-black">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>
                    <div className="my-[2rem]">
                        <label 
                            htmlFor="password"
                            className="block text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>
                    <div className="my-[2rem]">
                        <label 
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-black">
                            confirm password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 p-2 border rounded w-full"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e)=> setConfirmPassword(e.target.value)}
                        />
            
                    </div>
                    <button disabled={isLoading} type="submit" className="bg-blue-500 text-white py-2 px-4 
                    rounded cursor-pointer my-1rem">{isLoading ? "Registering..." : "Register"}</button>
                </form>

                <div className="mt-4">
                    <p className="text-black">
                       Already a user?{" "}
                        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-blue-500 hover:underline">
                            Click to Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Register;
