"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, PlusCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Zoom } from "react-toastify";
import AdminLayout from "@/AdminLayout";
import AdminHeader from "@/app/components/AdminHeader";
import { Company } from "@/app/types/company";
import SidebarAdmin from "@/app/components/SidebarAdmin";

// Configuration de l'API Gateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
}

interface UserFormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  role: string;
}

export default function ManageUsersPage() {

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDepartmentsByUser, setSelectedDepartmentsByUser] = useState<{ [userId: string]: string[] }>({});  
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);  
  const handleAssignDepartment = async () => {
  if (!selectedUser || !selectedDepartmentsByUser[selectedUser.id]?.length) return;
  try {
    await axios.put(
      `${API_BASE_URL}/api/companies/users/${selectedUser.id}/departments`,
      { departments: selectedDepartmentsByUser[selectedUser.id] },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );
    toast.success("Departments assigned successfully!");
    setShowDepartmentModal(false);
    fetchUsers();
  } catch (err) {
    console.error("Error assigning departments", err);
    toast.error("Error assigning departments.");
  }
};

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
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
  const [company, setCompany] = useState<Company | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
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
  const fetchUserDepartments = async (userId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/companies/user-departments/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );
    const departments: { name: string }[] = response.data;
    setSelectedDepartmentsByUser((prev) => ({
      ...prev,
      [userId]: departments.map((dept) => dept.name),
    }));
  } catch (err) {
    console.error("Error fetching user departments:", err);
  }
};
  const handleDelete = async () => {
    if (deleteUserId) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/users/${deleteUserId}`, {
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
      await axios.post(`${API_BASE_URL}/api/admin/users`, formData, {
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
      return String(user.role).toLowerCase().includes(value.toLowerCase());
          
        default:
          return Object.values(user)
            .join(" ")
            .toLowerCase()
            .includes(value.toLowerCase());
      }
    });

    setFilteredUsers(filtered);
  };
  const handleOpenDepartmentModal = async (user: User) => {
    setSelectedUser(user);
    await fetchUserDepartments(user.id); 
    setShowDepartmentModal(true);
  };
  useEffect(() => {
    const fetchCompanyDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/companies/profile`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
        setCompany(response.data);
      } catch (err) {
        console.error("Error fetching company departments:", err);
        return [];
      }
    };
    fetchUsers();
    fetchCompanyDepartments();
  }, []);
  const handleDepartmentChange = (userId: string, department: string, isChecked: boolean) => {
    setSelectedDepartmentsByUser((prev) => {
      const userDepartments = prev[userId] || [];
      if (isChecked) {
        return { ...prev, [userId]: [...userDepartments, department] };
      } else {
        return { ...prev, [userId]: userDepartments.filter((d) => d !== department) };
      }
    });
  };
  return (
    <>
  <SidebarAdmin isSidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
  <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`} style={{ minWidth: 0 }}> 
    <AdminHeader sidebarOpen={sidebarOpen}/>
    {/* Ajout d'un espace entre le header et le contenu */}
    <div style={{ height: '32px' }} />
    {/* Filter Options - move outside and above <main> for absolute top position */}
    <div className="w-full flex flex-col md:flex-row gap-3 mb-2 items-stretch md:items-center px-4 pt-4 max-w-6xl mx-auto">
        <div className="flex items-center bg-white shadow-md rounded-xl px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition w-full md:w-1/3">
          <span className="text-blue-500 mr-2 font-semibold">Filter by:</span>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-700 font-medium focus:ring-0 focus:outline-none cursor-pointer"
          >
            <option value="name">Name</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
        </div>
        <div className="flex items-center bg-white shadow-md rounded-xl px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition w-full md:w-2/3">
          <Search size={20} className="text-blue-400 mr-2" />
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>
      <main className="p-4 pt-2">
      <div className="p-4 max-w-6xl mx-auto space-y-10"> {/* p-6 -> p-4 for less vertical space */}

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
              className="bg-white p-6 rounded-xl shadow-lg space-y-4"
              style={{ zoom: 0.9 }} 
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["firstname", "lastname", "username", "email"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    type={field === "email" ? "email" : field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field as keyof UserFormData]}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ))}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a Role</option>
                  <option value="Recruteur">Recruiter</option>
                  <option value="RH">HR</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition ml-auto block"
              >
                Create User
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto border border-blue-100 mt-8">
      <table className="min-w-full text-sm text-left text-gray-800 font-sans">
        <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 uppercase sticky top-0 z-10">
          <tr>
            <th className="p-4 font-semibold">
              <div className="flex items-center gap-2">
                <span>
                  <svg className="inline w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Name
              </div>
            </th>
            <th className="p-4 font-semibold">
              <div className="flex items-center gap-2">
                <span>
                  <svg className="inline w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                Email
              </div>
            </th>
            <th className="p-4 font-semibold">
              <div className="flex items-center gap-2">
                <span>
                  <svg className="inline w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Username
              </div>
            </th>
            <th className="p-4 font-semibold">
              <div className="flex items-center gap-2">
                <span>
                  <svg className="inline w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" />
                  </svg>
                </span>
                Role
              </div>
            </th>
            <th className="p-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50 transition-colors group">
                <td className="p-4 whitespace-nowrap font-medium">{user.firstName} {user.lastName}</td>
                <td className="p-4 whitespace-nowrap">{user.email}</td>
                <td className="p-4 whitespace-nowrap">{user.username}</td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm
                      ${
                        String(user.role).toLowerCase() === "manager"
                          ? "bg-purple-100 text-purple-700"
                          : String(user.role).toLowerCase() === "recruteur"
                          ? "bg-blue-100 text-blue-700"
                          : String(user.role).toLowerCase() === "rh"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2 md:gap-4">
                    <button
                      onClick={() => {
                        setDeleteUserId(user.id);
                        setShowModal(true);
                      }}
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 flex items-center justify-center gap-1 rounded-full p-2 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300 opacity-80 group-hover:opacity-100"
                      aria-label="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDepartmentModal(user)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 flex items-center justify-center gap-1 rounded-full p-2 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 opacity-80 group-hover:opacity-100"
                      aria-label="Assign department"
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
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
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 32 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative bg-gradient-to-br from-white via-blue-50 to-gray-50 p-0 rounded-3xl shadow-2xl max-w-xs w-full border border-blue-100 overflow-hidden"
              style={{ minWidth: 230, zoom: 1.1 }}
            >
              <div className="flex flex-col items-center px-4 pt-6 pb-4"> {/* less padding */}
                <div className="bg-red-200/80 rounded-full p-2 mb-2 flex items-center justify-center shadow-lg">
                  <Trash2 size={26} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 text-center mb-2 tracking-tight">Confirm Deletion</h2>
                <p className="text-gray-600 text-center text-xs mb-1">Are you sure you want to delete this user? <span className='font-semibold text-red-600'>This action is irreversible.</span></p>
              </div>
              <div className="flex justify-center gap-3 px-4 pb-4"> {/* less padding */}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-semibold border border-gray-200 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-md border border-red-200 hover:from-red-600 hover:to-red-800 transition focus:outline-none focus:ring-2 focus:ring-red-200 text-xs"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      </main>
      </div>
      {showDepartmentModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 p-0 rounded-3xl shadow-2xl max-w-sm w-full border border-blue-200 overflow-hidden"
            style={{ minWidth: 280, zoom: 0.97 }}>
            <div className="flex flex-col items-center px-6 pt-8 pb-4">
              <h2 className="text-xl font-extrabold text-blue-800 text-center mb-2 tracking-tight">Assign Departments</h2>
              <p className="text-gray-600 text-center text-sm mb-3">Assign one or more departments to <span className="font-semibold text-blue-700">{selectedUser.firstName} {selectedUser.lastName}</span> for better access control and management.</p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto px-6 pb-2">
              {company?.departments?.length ? (
                company.departments.map((dept) => (
                  <label key={dept.id} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl bg-white/90 hover:bg-blue-50 border border-blue-100 shadow transition-all duration-150">
                    <input
                      type="checkbox"
                      value={dept.name}
                      checked={selectedDepartmentsByUser[selectedUser?.id]?.includes(dept.name) || false}
                      onChange={(e) => handleDepartmentChange(selectedUser!.id, dept.name, e.target.checked)}
                      className="accent-blue-600 h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <span className="text-gray-800 text-base font-medium select-none">{dept.name}</span>
                  </label>
                ))
              ) : (
                <div className="text-center text-gray-400 py-6">No departments available.</div>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-6 px-6 pb-6">
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="px-5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-semibold border border-gray-200 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDepartment}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md border border-blue-200 hover:from-blue-700 hover:to-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

<ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom} />
            </>
  
);
}