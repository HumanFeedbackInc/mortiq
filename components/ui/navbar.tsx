"use client";

import type { NavbarProps } from "@heroui/react";
import { Avatar } from "@heroui/avatar";
export interface NavbarPropsWithUser extends NavbarProps {
  user: User | undefined | null;
  profilepicture: string | null;
}

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { AcmeIcon } from "./logo";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

const menuItems = [
  "Home",
  "Listings",
  "Dashboard",
  "Blog",
  "About",
  "Contact Us",
];

export default function Component(props: NavbarPropsWithUser) {
  const pathname = usePathname();
  const { user, profilepicture } = props;

  const handleSignOut = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  };

  return (
    <Navbar
      {...props}
      classNames={{
        base: "py-4 backdrop-filter-none bg-transparent",
        wrapper: "px-0 w-full justify-center bg-transparent",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      height="54px"
    >
      <NavbarContent
        className="gap-4 rounded-full border-small border-default-200/20 bg-background/60 px-2 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        justify="center"
      >
        {/* Toggle */}
        <NavbarMenuToggle className="ml-2 text-default-400 md:hidden" />

        {/* Logo */}
        <NavbarBrand className="mr-2 w-[40vw] md:w-auto md:max-w-fit">
          <div className="rounded-full bg-foreground text-background">
            <AcmeIcon size={34} />
          </div>
          <span className="ml-2 font-medium md:hidden">ACME</span>
        </NavbarBrand>

        {/* Items */}
        <NavbarItem isActive={pathname === "/"} className="hidden md:flex">
          <Link className="text-default-500" href="/" size="sm">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem
          isActive={pathname === "/dashboard"}
          className="hidden md:flex"
        >
          <Link className="text-default-500" href="/dashboard" size="sm">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem
          isActive={pathname === "/listings"}
          className="hidden md:flex"
        >
          <Link className="text-default-500" href="/listings" size="sm">
            Listings
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/about"} className="hidden md:flex">
          <Link className="text-default-500" href="/about" size="sm">
            About Us
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/blog"} className="hidden md:flex">
          <Link className="text-default-500" href="/integrations" size="sm">
            Blog
          </Link>
        </NavbarItem>
        <NavbarItem className="ml-2 !flex">
          {user ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar isBordered radius="full" src={profilepicture || ""} />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="profile">
                  <Link href="/profile">Profile</Link>
                </DropdownItem>
                <DropdownItem key="logout">
                  <Button variant="flat" onPress={handleSignOut}>
                    Logout
                  </Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              radius="full"
              variant="flat"
              onPress={() => redirect("/sign-in")}
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Menu */}
      <NavbarMenu
        className="top-[calc(var(--navbar-height)/2)] mx-auto mt-16 max-h-[40vh] max-w-[80vw] rounded-large border-small border-default-200/20 bg-background/60 py-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: {
            ease: "easeInOut",
            duration: 0.2,
          },
        }}
      >
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-default-500"
              href={item == "Home" ? "/" : `/${item.toLowerCase()}`}
              size="md"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
