"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "~/components/ui/resizeable-navbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "./logo";
import { useState } from "react";
import * as React from "react";

export default function Header() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <Logo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <SignedOut>
            <NavbarButton href="/login" variant="secondary">
              Login
            </NavbarButton>
            <NavbarButton href="/sign-up" variant="primary">
              Get Started
            </NavbarButton>
          </SignedOut>
          <SignedIn>
            <NavbarButton
              href="/dashboard"
              variant="primary"
              className="flex items-center gap-2"
            >
              Dashboard
            </NavbarButton>
          </SignedIn>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Logo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              href="/sign-up"
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Sign Up
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
