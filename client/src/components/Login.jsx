import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setUser, setShowUserLogin, axios, navigate } = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const payload =
        state === "register"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center text-sm text-gray-600 bg-black/60 backdrop-blur-sm"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-8 py-10 w-80 sm:w-[380px] rounded-2xl shadow-2xl border border-gray-100 bg-white animate-slideUp"
      >
        <p className="text-2xl font-bold text-center text-gray-800">
          <span className="text-green-500">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-gray-200 rounded-xl w-full p-2.5 mt-1 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
            type="password"
            required
          />
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-green-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-green-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}

        <button className="bg-green-500 hover:bg-green-600 transition text-white w-full py-2.5 rounded-xl font-medium text-base cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
