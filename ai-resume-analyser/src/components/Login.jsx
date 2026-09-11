import React from "react";
import {Link} from "react-router-dom";
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import ResumeAnalysis from "./ResumeAnalysis";
const Login = () => {

  const navigate=useNavigate();


const [password, setpassword] = useState('');
const [email, setemail] = useState('');

const handleLogin=async (e)=>{
e.preventDefault();

  try{
    
            const res = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    email,
                    password
                },
                {
                    withCredentials: false
                }
            );

console.log("loggedin");

  console.log(res.data);
  navigate('/resumeanalysis');




  }
  catch(err){
    console.log("Error");

  }
}




  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950 px-4">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">


        <h1 className="text-3xl font-bold text-white text-center">
          Welcome Back 
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Login to continue
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input onChange={(e)=>{
              setemail(e.target.value);

            }}
              type="email" value={email}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
            />
          </div>




          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input onChange={(e)=>{
setpassword(e.target.value);


            }}
              type="password" name="password" value={password}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
            />
          </div>




          <button
            type="submit" 
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="mx-3 text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white py-3 font-medium text-gray-800 transition-300  hover:bg-gray-400">
          
          <img className='h-5 rounded-xl' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlAd9Qby56WJDTitIbdC67hj-pGqMYzaox_oozjvbOnA&s=10"></img>
          
          
          
          
          
    
          Continue with Google
        </button>

        <div className="mt-8 text-center">
  <p className="text-sm text-gray-400">
    New User?
  </p>

  <Link
    to="/signup"
    className="mt-3 inline-block w-full rounded-xl border border-cyan-400 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-white"
  >
    Sign Up
  </Link>
</div>

      </div>
    </div>
  );
};

export default Login;