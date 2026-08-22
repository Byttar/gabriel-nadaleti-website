import React from "react";
import Nav from "./nav";
import { Link } from "react-router";

const Header: React.FC = () => {
  return (
    <header className="mx-auto w-full py-8 bg-black flex justify-center border-b border-b-stone-800">
      <div className="w-full flex justify-between space-x-4">
        <Link to={"/"}>
          <h1 className="text-md font-bold text-white">
            <b className="text-primary">&gt;</b> gabriel.Log
          </h1>
        </Link>
        <Nav/>
      </div>
    </header>
  );
};

export default Header;
