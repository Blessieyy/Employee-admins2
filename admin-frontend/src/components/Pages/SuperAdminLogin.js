import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      alert("Login successful!");

      // Check if the logged-in user is the super admin
      // if (user.uid === "ZbJlrcWHMNTHJHBAFz2DhTDzil52") {
      //   navigate("/SuperDashboard"); // Redirect to the superadmin dashboard
      // } else {
        navigate("/dashboard"); // Redirect to the general admin dashboard
      

    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login Superadmin</h2>
      <input
        placeholder="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default SuperAdminLogin;
