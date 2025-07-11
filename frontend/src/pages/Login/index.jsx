import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userName || !password) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userName, password: password }),
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        localStorage.setItem("userData", JSON.stringify(data.userData));
        localStorage.setItem("token", data.token); // Store token in localStorage
        localStorage.setItem("username", userName); // Store username in localStorage
        toast.success("Đăng nhập thành công!", { autoClose: 2000 });
        navigate(data.role.includes("Admin") ? "/admin/pos" : "/");
      } else {
        throw new Error(data.error || "Sai thông tin đăng nhập");
      }
    } catch (error) {
      toast.error(`Lỗi đăng nhập: ${error.message}`, { autoClose: 3000 });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-600 via-teal-500 to-green-600">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-48 flex justify-center items-center">
          <h2 className="text-4xl font-bold text-white tracking-wide">Đăng Nhập</h2>
        </div>

        <div className="p-8">
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
              <input
                type="text"
                id="userName"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                id="password"
                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-md hover:from-teal-600 hover:to-blue-600 transition duration-300"
            >
              Đăng Nhập
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/signup" className="text-sm text-blue-500 hover:underline">
              Chưa có tài khoản? Đăng ký
            </a>
            <br />
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;