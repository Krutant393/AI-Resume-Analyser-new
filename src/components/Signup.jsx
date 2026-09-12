import React from 'react';
import { Link } from "react-router-dom";
import {useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"
const Signup = () => {
const navigate=useNavigate();

const [name, setname] = useState("");
const [email,setemail] = useState("");
const [password,setpassword] = useState("");

const handlesubmit=async (e)=>{
   e.preventDefault();

try{
  const response=await axios.post(
    "http://localhost:3000/api/auth/register",
    {
      name,
      email,
      password
    }
  );
          alert(response.data.message);

        navigate("/login");

}
catch(err){
  console.log("Error");

}




}

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950 px-4">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">


        <h1 className="text-3xl font-bold text-white text-center">
          New User? Sign Up
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Enter details to continue
        </p>

        <form onSubmit={handlesubmit} className="mt-8 space-y-5">

          <div>
            <label className="text-gray-300 text-sm">Name</label>
            <input
              onChange={(elem)=>{
                setname(elem.target.value);
              }}
              type="text"
              value={name}
              placeholder="Enter your name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              onChange={(elem)=>{
                setemail(elem.target.value);
              }}
              type="email"
              value={email}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              onChange={(elem)=>{
                setpassword(elem.target.value);
              }}
              type="password"
              value={password}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Sign Up
          </button>

        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="mx-3 text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <div className="flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Go Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;