"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-park-green-dark text-white">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              className="w-8 h-8 text-park-gold"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <div>
              <div className="font-serif font-bold text-lg leading-tight group-hover:text-park-gold transition-colors">
                Lawndale Park
              </div>
              <div className="text-[10px] tracking-widest uppercase text-park-gold/80">
                Pet Registry
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/sightings"
              className="hover:text-park-gold transition-colors"
            >
              Sightings
            </Link>
            <Link
              href="/missing"
              className="hover:text-park-gold transition-colors"
            >
              Missing Pets
            </Link>
            <Link
              href="/regulars"
              className="hover:text-park-gold transition-colors"
            >
              Regulars
            </Link>
            <Link href="/sightings/new" className="btn-primary !py-2 !px-4 !text-sm">
              Post Sighting
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden mt-3 pt-3 border-t border-white/20 flex flex-col gap-3 text-sm">
            <Link
              href="/sightings"
              onClick={() => setMenuOpen(false)}
              className="hover:text-park-gold transition-colors"
            >
              Sightings
            </Link>
            <Link
              href="/missing"
              onClick={() => setMenuOpen(false)}
              className="hover:text-park-gold transition-colors"
            >
              Missing Pets
            </Link>
            <Link
              href="/regulars"
              onClick={() => setMenuOpen(false)}
              className="hover:text-park-gold transition-colors"
            >
              Regulars
            </Link>
            <Link
              href="/sightings/new"
              onClick={() => setMenuOpen(false)}
              className="btn-primary !py-2 text-center"
            >
              Post Sighting
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
