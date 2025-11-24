"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// --- OPTIMIZED SEARCH COMPONENT ---
// Now accepts onSearchSubmit to handle closing mobile menus
const HeaderSearch = ({ className, iconClass = "w-[22px]", onSearchSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync local state with URL
  useEffect(() => {
    const currentSearch = searchParams.get("search");
    if (currentSearch) {
      setQuery(currentSearch);
    }
  }, [searchParams]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (!query) setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // 1. Navigate
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      
      // 2. Close the search input itself
      setIsOpen(false);
      
      // 3. Trigger callback (closes mobile menu)
      if (onSearchSubmit) {
        onSearchSubmit();
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative flex items-center ${className}`}>
      {isOpen ? (
        <form onSubmit={handleSearch} className="absolute right-0 z-20 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[200px] bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-lg"
            placeholder="Search..."
            onBlur={() => {
              setTimeout(() => {
                 if(!query) setIsOpen(false)
              }, 200)
            }}
          />
          <button 
            type="submit" 
            className="absolute right-2 text-gray-400 hover:text-yellow-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center"
          aria-label="Open Search"
        >
          <img className={iconClass} src="/images/search.svg" alt="Search" />
        </button>
      )}
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    }
  }, [isMenuOpen]);

  const navItems = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 2,
      name: "Shop",
      path: "/shop",
    },
    {
      id: 3,
      name: "Checkout",
      path: "/checkout-flow",
    },
  ];

  return (
    <header>
      <div className="bg-[#F7F7F7]">
        <div className="container flex justify-between max-md:justify-center max-md:gap-5 py-4">
          <div className="flex items-center gap-2">
            <img
              className="w-[15px]"
              src="/images/location.svg"
              alt="Location"
            />
            <p className="text-[#666666] text-[12px]">
              Store Location: Centralstrasse&nbsp;14&nbsp;6410&nbsp;Goldau
            </p>
          </div>

          <div className="hidden sm:flex gap-4">
            <div className="flex gap-2">
              <Link href={"/signup"} className="text-[#666666] text-[12px]">
                Register
              </Link>
              <p className="text-[#666666] text-[12px]">/</p>
              <Link href={"/login"} className="text-[#666666] text-[12px]">
                Log&nbsp;in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-between py-4 relative">
        <nav className="hidden md:block">
          <div className="flex gap-5">
            {navItems.map((item) => (
              <Link
                href={item.path}
                key={item.id}
                className="text-[14px] font-[500] text-[#808080]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <img src="/images/logo.svg" alt="Logo" className="h-8" />

        <div className="hidden md:flex gap-3 items-center">
          {/* Desktop Search - No need to close menu */}
          <Suspense fallback={<div className="w-[22px]" />}>
            <HeaderSearch />
          </Suspense>
          
          <Link href={"/checkout-flow"}>
            <img className="w-[26px]" src="/images/cart.svg" alt="Cart" />
          </Link>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden p-2"
        >
          <svg
            width="24"
            height="24"
            stroke="#000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 
          ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full bg-white overflow-y-auto
          transform transition-transform duration-300
          ${
            isMenuOpen
              ? "translate-x-0"
              : "translate-x-full pointer-events-none"
          }`}
      >
        <div className="container flex items-center justify-between py-4 border-b border-gray-200">
          <img src="/images/logo.svg" alt="Logo" className="h-8" />
          <button
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="p-2"
          >
            <svg
              width="24"
              height="24"
              stroke="#000"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <ul className="flex flex-col items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-[18px] font-semibold text-[#808080]"
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex justify-center gap-6 items-center">
           {/* Mobile Search - Closes menu on submit */}
           <Suspense fallback={<div className="w-[22px]" />}>
             <HeaderSearch onSearchSubmit={() => setIsMenuOpen(false)} />
           </Suspense>

          <Link href={"/checkout-flow"} onClick={() => setIsMenuOpen(false)}>
            <img className="w-[26px]" src="/images/cart.svg" alt="Cart" />
          </Link>
        </div>

        <div className="mt-10 mb-8 flex flex-col items-center gap-4 text-[12px] text-[#666666]">
          <div className="flex gap-2">
            <Link href={"/signup"}>Register</Link>
            <span>/</span>
            <Link href={"/login"}>Log&nbsp;in</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;