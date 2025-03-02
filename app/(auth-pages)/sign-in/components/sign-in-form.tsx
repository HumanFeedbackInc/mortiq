"use client";
import React, { useState } from "react";
import {
  IconBrandGithub,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function LoginWithSocialsAndEmail() {
  return (
    <div className="relative w-full max-h-[80vh] overflow-hidden rounded-xl shadow-[0_0_30px_rgba(0,157,255,0.5)]">
      <AmbientColor />
      <Form />
    </div>
  );
}
import { signInAction } from "@/app/actions";

function Form() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <form
      action={signInAction}
      className="mx-auto flex h-screen max-w-lg flex-col items-center justify-center"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          Don't have an account?
        </span>
        <Link
          href="/sign-up"
          className="text-sm font-medium text-black hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
        >
          Sign up
        </Link>
      </div>
      <Logo />
      <h1 className="mb-4 text-xl font-bold text-neutral-800 dark:text-neutral-100 md:text-4xl">
        Sign in to your account
      </h1>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <button className="flex flex-1 items-center justify-center space-x-2 rounded-md border border-neutral-200 bg-gray-100 px-4 py-3 text-neutral-700 shadow-[0px_1.5px_0px_0px_rgba(0,0,0,0.05)_inset] transition duration-200 hover:bg-gray-100/80 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-[0px_1.5px_0px_0px_rgba(255,255,255,0.05)_inset]">
          <IconBrandGithubFilled className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          <span className="text-sm">Login with GitHub</span>
        </button>
        <button className="flex flex-1 items-center justify-center space-x-2 rounded-md border border-neutral-200 bg-gray-100 px-4 py-3 text-neutral-700 shadow-[0px_1.5px_0px_0px_rgba(0,0,0,0.05)_inset] transition duration-200 hover:bg-gray-100/80 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-[0px_1.5px_0px_0px_rgba(255,255,255,0.05)_inset]">
          <IconBrandGoogleFilled className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
          <span className="text-sm">Login with Google</span>
        </button>
      </div>

      <div className="my-6 h-px w-full bg-neutral-100 dark:bg-neutral-800" />
      <motion.input
        initial={{
          height: "0px",
          opacity: 0,
          marginBottom: "0px",
        }}
        animate={{
          height: isClicked ? "40px" : "0px",
          opacity: isClicked ? 1 : 0,
          marginBottom: isClicked ? "10px" : "0px",
        }}
        name="email"
        type="email"
        placeholder="support@aceternity.com"
        className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 pl-4 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
      />
      <motion.input
        initial={{
          height: "0px",
          opacity: 0,
          marginBottom: "0px",
        }}
        animate={{
          height: isClicked ? "40px" : "0px",
          opacity: isClicked ? 1 : 0,
          marginBottom: isClicked ? "10px" : "0px",
        }}
        name="password"
        type="password"
        placeholder="Password"
        className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 pl-4 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
      />
      <button
        type="submit"
        onClick={(e) => {
          if (!isClicked) {
            e.preventDefault();
            setIsClicked(true);
          }
        }}
        className="group/btn relative w-full rounded-lg bg-black px-4 py-3 text-white dark:bg-white dark:text-black"
      >
        <div className="absolute inset-0 h-full w-full transform opacity-0 transition duration-200 group-hover/btn:opacity-100">
          <div className="absolute -left-px -top-px h-4 w-4 rounded-tl-lg border-l-2 border-t-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-left-4 group-hover/btn:-top-4 dark:border-white"></div>
          <div className="absolute -right-px -top-px h-4 w-4 rounded-tr-lg border-r-2 border-t-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-right-4 group-hover/btn:-top-4 dark:border-white"></div>
          <div className="absolute -bottom-px -left-px h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-bottom-4 group-hover/btn:-left-4 dark:border-white"></div>
          <div className="absolute -bottom-px -right-px h-4 w-4 rounded-br-lg border-b-2 border-r-2 border-black bg-transparent transition-all duration-200 group-hover/btn:-bottom-4 group-hover/btn:-right-4 dark:border-white"></div>
        </div>
        <span className="text-sm">Continue with Email</span>
      </button>
    </form>
  );
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={30}
        height={30}
      />
      <span className="font-medium text-black dark:text-white">DevStudio</span>
    </Link>
  );
};

export const AmbientColor = () => {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-40 min-h-screen w-screen">
      <div
        style={{
          transform: "translateY(-350px) rotate(-45deg)",
          width: "560px",
          height: "1380px",
          background:
            "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          transform: "rotate(-45deg) translate(5%, -50%)",
          transformOrigin: "top left",
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          position: "absolute",
          borderRadius: "20px",
          transform: "rotate(-45deg) translate(-180%, -70%)",
          transformOrigin: "top left",
          top: 0,
          left: 0,
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
        }}
        className="absolute left-0 top-0"
      />
    </div>
  );
};
