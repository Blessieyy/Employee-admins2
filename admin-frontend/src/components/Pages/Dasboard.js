// src/components/Pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { db } from "../config/firebase"; // Importing db here
import { collection, getDocs, addDoc } from "firebase/firestore";
import axios from "axios";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", surname: "", email: "", role: "" });
  // Fetch existing employees and admins from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const employeesSnapshot = await getDocs(collection(db, "employees"));
      const adminsSnapshot = await getDocs(collection(db, "admins"));

      const allUsers = [
        ...employeesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        ...adminsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      ];

      setUsers(allUsers);
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (newUser.name &&newUser.surname && newUser.email && newUser.role) {
      try {
        if (newUser.role === "admin") {
          await addDoc(collection(db, "admins"), {
            name: newUser.name,
            surname:newUser.surname,
            email: newUser.email,
            role: newUser.role,
           
          });
        } else {
          await addDoc(collection(db, "employees"), {
            name: newUser.name,
            surname:newUser.surname,
            email: newUser.email,
            role: newUser.role,
          });
        }

        await axios.post("http://localhost:5000/admins/addUser", newUser);

        setNewUser({ name: "", email: "", role: "" }); // Clear form
        alert("User added successfully!");

        // Fetch updated list of users
        const fetchUsers = async () => {
          const employeesSnapshot = await getDocs(collection(db, "employees"));
          const adminsSnapshot = await getDocs(collection(db, "admins"));

          const allUsers = [
            ...employeesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
            ...adminsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
          ];

          setUsers(allUsers);
        };

        fetchUsers();
      } catch (error) {
        console.error( error);
        alert("Error adding user!");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div>
      <h2>Welcome(windows XP startup sound!)</h2>
      <h3>Add New User</h3>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={newUser.surname}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <h3>Users List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
