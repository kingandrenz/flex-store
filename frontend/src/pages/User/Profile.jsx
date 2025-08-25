import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";


function Profile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const {userInfo} = useSelector(state=> state.auth);

    const [updateProfile, { isLoading }] = useProfileMutation();

    useEffect(()=> {
        setUsername(userInfo.username);
        setEmail(userInfo.email);
    }, [userInfo.email, userInfo.username]);

    const dispatch = useDispatch();

     const submitHandler = async (e) => {
            e.preventDefault();
    
            if (password !== confirmPassword) {
                toast.error("password do not match");
            } else {
                try {
                    const res = await updateProfile({_id: userInfo._id, username, email, password }).unwrap();
                    dispatch(setCredentials({...res}));
                    toast.success("Profile updated succesfully")
                } catch (error) {
                    console.log(error);
                    toast.error(error?.data?.message || error.message);
                }
            }
        }

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
        <div className="flex justify-center align-center md:flex md:space-x-4">
            <div className="md:w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>

                <form onSubmit={submitHandler} >
                    <div className="mb-4">
                        <label className="block text-black mb-2">Name</label>
                        <input 
                        type="text"
                        placeholder="Enter name"
                        className="form-input p-4 rounded-sm bg-slate-200 w-full"
                        value={username}
                        onChange={(e)=> setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black mb-2">Email</label>
                        <input 
                        type="text"
                        placeholder="Enter Email address"
                        className="form-input p-4 rounded-sm  bg-slate-200 w-full"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black mb-2">Password</label>
                        <input 
                        type="password"
                        placeholder="Enter password"
                        className="form-input p-4 rounded-sm  bg-slate-200 w-full"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black mb-2">Confirm password</label>
                        <input 
                        type="password"
                        placeholder="confirm password"
                        className="form-input p-4 rounded-sm  bg-slate-200 w-full"
                        value={confirmPassword}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between">
                    <button disabled={isLoading} type="submit" className="bg-blue-500 text-white py-2
                        px-4 rounded cursor-pointer  hover:bg-blue-600">{isLoading ? "Updating..." : "Update"}
                    </button> 

                    <Link to="/user-orders" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-700">
                        MY Orders 
                    </Link>
                </div>
                </form>
            </div>
            {isLoading && <Loader />}
        </div>
    </div>
  )
}

export default Profile
