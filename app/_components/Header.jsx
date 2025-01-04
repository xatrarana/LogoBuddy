"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  const { user } = useUser();
  return (
    <div className="px-10 lg:px-32 xl:px-48 2xl:px-56 p-4 flex justify-between items-center shadow-sm">
      <Link href={"/"}>
        <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
      </Link>
      <div className="flex gap-3 items-center">
        {user ? (
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <Button>Get Started</Button>
        )}
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
