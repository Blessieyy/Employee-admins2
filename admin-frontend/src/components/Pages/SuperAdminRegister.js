import React, { useState } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { name, surname, email, password } = formData;

      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

     
      const user = userCredential.user;

      // Ensure the data is correctly formatted before sending
      const payload = {
        name,
        surname,
        email,
        userId: user.uid,
      };
  
      console.log("Payload before sending:", payload);
      await axios.post("http://localhost:5000/admins/superadmins", payload,{
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Superadmin Registered Successfully!");
      navigate("/superadminlogin"); // Redirect to login page after successful registration
    } catch (error) {
      // console.error("Error during registration:", error);
      alert("Error during registration: " + error.message); // Display error message
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register Superadmin</h2>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={formData.name}
      />
      <input
        name="surname"
        placeholder="Surname"
        onChange={handleChange}
        value={formData.surname}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        value={formData.password}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default SuperAdminRegister;
