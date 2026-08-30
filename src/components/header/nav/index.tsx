import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const navLinks = [
  { name: "home", href: "/" },
  { name: "músicas", href: "/songs" },
  { name: "posts", href: "/posts" },
  { name: "fotos", href: "/photos" },
//  { name: "carreira", href: "/career" }
];

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <nav className="hidden md:block">
        <ul className="flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="text-stone-500 text-sm hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={isOpen}
      >
        <span className="block h-0.5 w-5 bg-stone-400" />
        <span className="block h-0.5 w-5 bg-stone-400" />
        <span className="block h-0.5 w-5 bg-stone-400" />
      </button>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={close}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-64 bg-black border-l border-stone-800 p-6 shadow-xl transition-transform duration-200 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            type="button"
            className="text-stone-400 hover:text-white text-2xl leading-none"
            onClick={close}
            aria-label="Fechar menu"
          >
            &times;
          </button>
          <ul className="flex flex-col gap-5 mt-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-stone-400 text-base hover:text-primary transition-colors"
                  onClick={close}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Nav;
