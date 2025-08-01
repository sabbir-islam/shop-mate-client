import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import React, { use } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {

  const {register} = use(AuthContext)
  const navigate = useNavigate();
    
  const handelRegister = (e) => {
    e.preventDefault();
    e.preventDefault();
    const form = e.target;
    const name = form.email.value;
    const photo = form.image.value;
    const email = form.email.value;
    const password = form.password.value;

    console.log({name,password,photo,email});
    
    register(email,password)
    .then((result) => {
        toast.success("User Created Successfully");
        console.log(result);
        // const createdUser = result.user;
        // setUser(createdUser);

        axios
          .post("http://localhost:5000/users", {
            name,
            photo,
            email,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
        navigate("/");
      })
      .catch((err) => {
        toast.error(err);
      });


  };
  return (
    <div>
      <div>
        <div className="min-h-screen bg-slate-600 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            {/* header  */}
            <div className="text-center mb-6 flex justify-center items-center gap-4">
              <div className="w-10 h-10 bg-[#3B82DE] rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl text-gray-700 font-medium">
                Welcome to{" "}
                <span className="font-semibold text-gray-800">ShopMate</span>
              </h1>
            </div>
            {/* form  */}
            <div>
              <div className="card-body">
                <form onSubmit={handelRegister} className="fieldset">
                  <label className="label">Shop Name</label>
                  <input
                    name="name"
                    type="text"
                    className="input"
                    placeholder="Shop Name"
                  />
                    <label className="label">Shop Image</label>
                  <input
                    name="image"
                    type="text"
                    className="input"
                    placeholder="Enter Shop logo Image link"
                  />
                  <label className="label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Email"
                  />
                  <label className="label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                  />
                  <button
                    type="submit"
                    className="btn rounded-2xl mt-4 bg-[#3B82DE] text-white"
                  >
                    Register
                    <FaArrowRightLong />
                  </button>
                </form>
              </div>
              <div className="divider">OR</div>
              <div className="mt-4 flex justify-center">
                <button className="btn bg-transparent w md:w-[332px] rounded-2xl hover:border-[#3B82DE]">
                  <FcGoogle size={24} />
                </button>
              </div>
              <div className="flex justify-center mt-4">
                <h1 className="text-lg">
                  Have a Account{" "}
                  <span className="text-blue-400 font-semibold">
                    {" "}
                    <Link to={"/login"}>Login</Link>{" "}
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
