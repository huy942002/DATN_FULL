// src/components/Navbar.js
import React from "react";
import { Dropdown, DropdownItem } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const username = window.localStorage.getItem("username") || "";

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-3xl font-bold">NHH CITY</h1>
        <nav className="space-x-6">
          <a className="text-lg cursor-pointer" href="/">Sản phẩm</a>
          <a className="text-lg cursor-pointer" href="/">Về chúng tôi</a>
          <a className="text-lg cursor-pointer" href="/">Liên hệ</a>
          <a className="text-lg cursor-pointer" href="/">Tìm kiếm</a>
          <a className="text-lg" href="/"><FontAwesomeIcon icon={faHeart} /></a>
        </nav>
        <Dropdown label={username.length === 0 ? "Đăng Nhập" : username} inline>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownItem><a className="text-lg cursor-pointer" href="/login">Sign out</a></DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;