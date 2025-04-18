"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, PlusCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Zoom } from "react-toastify";
import AdminLayout from "@/AdminLayout";

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    role: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterBy, setFilterBy] = useState<string>("name"); 

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });      
      setUsers(res.data);
      setFilteredUsers(res.data); 
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  const handleDelete = async () => {
    if (deleteUserId) {
      try {
        await axios.delete(`http://localhost:4000/api/admin/users/${deleteUserId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });      
        fetchUsers();
        setShowModal(false);
        toast.success("User successfully deleted!");
      } catch (err) {
        console.error("Error deleting user", err);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    try {
      await axios.post("http://localhost:4000/api/admin/users", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });      
      setFormData({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        role: "",
      });
      fetchUsers();
      toast.success("User successfully created!");
    } catch (err) {
      console.error("Error creating user", err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter the users based on the selected filter and search term
    const filtered = users.filter((user) => {
      switch (filterBy) {
        case "name":
          return (user.firstName + " " + user.lastName)
            .toLowerCase()
            .includes(value.toLowerCase());
        case "username":
          return user.username.toLowerCase().includes(value.toLowerCase());
        case "email":
          return user.email.toLowerCase().includes(value.toLowerCase());
          case "role":
            return typeof user.role === "string" && user.role.toLowerCase().includes(value.toLowerCase());
          
        default:
          return Object.values(user)
            .join(" ")
            .toLowerCase()
            .includes(value.toLowerCase());
      }
    });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
     <AdminLayout>
          
                  {/* Main Content */}
                  <main className="p-6 pt-24">
      <div className="p-6 max-w-6xl mx-auto space-y-10">

        {/* Filter Options */}
        <div className="flex space-x-4 mb-4">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">By Name</option>
            <option value="username">By Username</option>
            <option value="email">By Email</option>
            <option value="role">By Role</option>
          </select>

          {/* Search Bar with Icon */}
          <div className="flex items-center border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3">
            <Search size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Add User Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            {showForm ? "Close" : "Add User"}
          </button>
        </div>

        {/* User Creation Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleCreate}
              className="bg-white p-8 rounded-xl shadow-lg space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800">Create User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["firstname", "lastname", "username", "email"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    type={field === "email" ? "email" : field }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ))}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a Role</option>
                  <option value="Recruteur">Recruiter</option>
                  <option value="Manager">Manager</option>
                  <option value="RH">HR</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition"
              >
                Create User
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Username</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">{user.firstName} {user.lastName}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full
                    ${
                      user.role === "Manager"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "Recruteur"
                        ? "bg-blue-100 text-blue-700"
                        : user.role === "RH"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {user.role}
                </span>
              </td>
                <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setDeleteUserId(user.id);
                          setShowModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 justify-center"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Confirmation</h2>
              <p className="text-gray-600">Do you really want to delete this user?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      </main>
      </AdminLayout>
    </>
  );
}
