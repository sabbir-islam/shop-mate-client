import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';

const Employee = () => {
    const {user} = use(AuthContext)
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        salary: '',
        joinDate: '',
    });
    const [editId, setEditId] = useState(null);
    
    const userEmail = user.email;
    
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
            setCurrentDateTime(formattedDate);
        };
        
        updateDateTime(); // Initial update
        const intervalId = setInterval(updateDateTime, 1000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    // Fetch employees
    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`https://shop-mate-server.vercel.app/employees/${userEmail}`);
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to load employees');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchEmployees();
    }, [userEmail]);
    
    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    // Handle form submission for adding new employee
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const newEmployee = {
                ...formData,
                managedBy: userEmail, // Link employee to current user
                createdAt: new Date().toISOString(),
                createdBy: userEmail
            };
            
            await axios.post(`https://shop-mate-server.vercel.app/employees`, newEmployee);
            toast.success('Employee added successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                position: '',
                salary: '',
                joinDate: '',
            });
            setIsAddFormOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error('Error adding employee:', error);
            toast.error('Failed to add employee');
        }
    };
    
    // Handle form submission for editing employee
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedEmployee = {
                ...formData,
                updatedAt: new Date().toISOString(),
                updatedBy: userEmail
            };
            
            await axios.put(`https://shop-mate-server.vercel.app/employees/${editId}`, updatedEmployee);
            toast.success('Employee updated successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                position: '',
                salary: '',
                joinDate: '',
            });
            setIsEditFormOpen(false);
            setEditId(null);
            fetchEmployees();
        } catch (error) {
            console.error('Error updating employee:', error);
            toast.error('Failed to update employee');
        }
    };
    
    // Open edit form and populate with employee data
    const openEditForm = (employee) => {
        setFormData({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            position: employee.position,
            salary: employee.salary,
            joinDate: employee.joinDate ? employee.joinDate.split('T')[0] : '',
        });
        setEditId(employee._id);
        setIsEditFormOpen(true);
        setIsAddFormOpen(false);
    };
    
    // Delete employee
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await axios.delete(`https://shop-mate-server.vercel.app/employees/${id}`);
                toast.success('Employee deleted successfully!');
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                toast.error('Failed to delete employee');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-2 md:p-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h1 className="text-xl md:text-2xl font-bold">Employee Management</h1>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm md:text-base w-full sm:w-auto justify-center"
                    onClick={() => {
                        setIsAddFormOpen(!isAddFormOpen);
                        setIsEditFormOpen(false);
                        setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            position: '',
                            salary: '',
                            joinDate: '',
                        });
                    }}
                >
                    <FaPlus /> {isAddFormOpen ? 'Cancel' : 'Add Employee'}
                </button>
            </div>
            
            {/* Add Employee Form */}
            {isAddFormOpen && (
                <div className="bg-white shadow-md rounded p-3 md:p-6 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">Add New Employee</h2>
                    <form onSubmit={handleAddSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Salary</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Join Date</label>
                                <input
                                    type="date"
                                    name="joinDate"
                                    value={formData.joinDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-3 w-full sm:w-auto text-sm md:text-base"
                        >
                            Add Employee
                        </button>
                    </form>
                </div>
            )}
            
            {/* Edit Employee Form */}
            {isEditFormOpen && (
                <div className="bg-white shadow-md rounded p-3 md:p-6 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">Edit Employee</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Salary</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Join Date</label>
                                <input
                                    type="date"
                                    name="joinDate"
                                    value={formData.joinDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <button 
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm md:text-base"
                            >
                                Update Employee
                            </button>
                            <button 
                                type="button"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm md:text-base"
                                onClick={() => {
                                    setIsEditFormOpen(false);
                                    setEditId(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Employees List */}
            <div className="bg-white shadow-md rounded overflow-hidden">
                {isLoading ? (
                    <div className="text-center p-4">Loading employees...</div>
                ) : employees.length === 0 ? (
                    <div className="text-center p-4">No employees found. Add your first employee!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-3 text-left text-xs md:text-sm">Name</th>
                                    <th className="py-2 px-3 text-left text-xs md:text-sm hidden md:table-cell">Email</th>
                                    <th className="py-2 px-3 text-left text-xs md:text-sm hidden sm:table-cell">Phone</th>
                                    <th className="py-2 px-3 text-left text-xs md:text-sm">Position</th>
                                    <th className="py-2 px-3 text-left text-xs md:text-sm">Salary</th>
                                    <th className="py-2 px-3 text-left text-xs md:text-sm hidden md:table-cell">Join Date</th>
                                    <th className="py-2 px-3 text-left text-xs md:text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(employee => (
                                    <tr key={employee._id} className="border-t hover:bg-gray-50">
                                        <td className="py-2 px-3 text-xs md:text-sm">{employee.name}</td>
                                        <td className="py-2 px-3 text-xs md:text-sm hidden md:table-cell">{employee.email}</td>
                                        <td className="py-2 px-3 text-xs md:text-sm hidden sm:table-cell">{employee.phone}</td>
                                        <td className="py-2 px-3 text-xs md:text-sm">{employee.position}</td>
                                        <td className="py-2 px-3 text-xs md:text-sm">৳{employee.salary}</td>
                                        <td className="py-2 px-3 text-xs md:text-sm hidden md:table-cell">
                                            {new Date(employee.joinDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-3">
                                            <div className="flex gap-2">
                                                <button 
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                                                    onClick={() => openEditForm(employee)}
                                                    aria-label="Edit"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button 
                                                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                                    onClick={() => handleDelete(employee._id)}
                                                    aria-label="Delete"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default Employee;