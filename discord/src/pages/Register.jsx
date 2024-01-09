import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import url from "../api/url";

const SignUp = () => {
  const { register, handleSubmit, watch, formState } = useForm();
  const isLoading = formState.isSubmitting;
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await url.post(`/register/`, data);
      toast.success("Registered Successfully!!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black py-6 sm:py-12">
        <div className="absolute inset-0  bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-900">Welcome</h1>
              <p className="mt-2 text-gray-500">
                Sign up below to get an account
              </p>
            </div>
            <div className="mt-8">
              <form
                action=""
                className="group"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mb-6">
                  <label className="mb-2 block text-sm text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    id="name"
                    placeholder="your name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-300 shadow shadow-gray-100 focus:border-gray-500 focus:outline-none valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    id="email"
                    placeholder="you@company.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-300 shadow shadow-gray-100 focus:border-gray-500 focus:outline-none valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                    required
                    pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  />
                  <span className="mt-2 hidden text-sm text-red-400">
                    Please enter a valid email address.{" "}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="mb-2 flex justify-between">
                    <label className="text-sm text-gray-600">Password</label>
                  </div>
                  <input
                    type="password"
                    {...register("password", { required: "this is reqiured" })}
                    id="password"
                    placeholder="your password"
                    className="peer w-full rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-300 shadow shadow-gray-100 focus:border-gray-500 focus:outline-none valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                    pattern=".{6,}"
                    required
                  />
                  <span className="mt-2 hidden text-sm text-red-400">
                    Password must be atleast six characters.{" "}
                  </span>
                </div>
                <div className="mb-6">
                  <Button className="w-full ">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      ""
                    )}
                    Sign up
                  </Button>
                </div>
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="font-semibold text-black focus:text-indigo-500 focus:underline focus:outline-none"
                  >
                    Sign In
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
