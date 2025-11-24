"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@components/supabase/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EyeSlashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
    />
  </svg>
);

const EyeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // New auth state
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!formData.agreeToTerms) {
      setMessage("You must agree to the Terms and Privacy Policies.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
        },
      });

      if (error) {
        setMessage(`Signup error: ${error.message}`);
      } else {
        setMessage("Signup successful! Check your email to confirm.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
        });
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (id, name, type, label) => (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required
        value={formData[name]}
        onChange={handleChange}
        className="peer h-12 w-full border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-transparent p-3"
        placeholder={label}
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-amber-600"
      >
        {label}
      </label>
    </div>
  );

  const renderPasswordField = (id, name, label, show, toggleShow) => (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        required
        value={formData[name]}
        onChange={handleChange}
        className="peer h-12 w-full border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-transparent p-3"
        placeholder={label}
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-amber-600"
      >
        {label}
      </label>
      <button
        type="button"
        onClick={toggleShow}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-amber-600"
      >
        {show ? (
          <EyeIcon className="w-5 h-5" />
        ) : (
          <EyeSlashIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN STATE ---
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center space-y-6">
          <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Already Signed In</h1>
            <p className="mt-2 text-gray-500">
              You are currently logged in as <br/>
              <span className="font-medium text-gray-800">{user.email}</span>
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/shop" className="block w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-md transition-colors">
              Continue Shopping
            </Link>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="block w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              {loading ? "Signing out..." : "Log out"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SIGNUP FORM (If not logged in) ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-left">
          <h1 className="text-4xl font-bold">Sign up</h1>
          <p className="mt-2 text-gray-500">
            Let's get you all set up so you can access your personal account.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInputField("first-name", "firstName", "text", "First Name")}
            {renderInputField("last-name", "lastName", "text", "Last Name")}
            {renderInputField("email", "email", "email", "Email")}
            {renderInputField(
              "phone-number",
              "phoneNumber",
              "tel",
              "Phone Number"
            )}
            {renderPasswordField(
              "password",
              "password",
              "Password",
              showPassword,
              () => setShowPassword(!showPassword)
            )}
            {renderPasswordField(
              "confirm-password",
              "confirmPassword",
              "Confirm Password",
              showConfirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword)
            )}
          </div>

          <div className="flex items-center">
            <input
              id="agree-to-terms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
            />
            <label
              htmlFor="agree-to-terms"
              className="ml-2 block text-sm text-gray-900"
            >
              I agree to all the{" "}
              <a href="#" className="font-medium hover:text-amber-600">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium hover:text-amber-600">
                Privacy Policies
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-black bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-amber-500 hover:text-amber-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}