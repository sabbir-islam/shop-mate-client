import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBox } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';

const Supplier = () => {
    const { user } = use(AuthContext);
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        productsSupplied: '',
        paymentTerms: '',
        notes: '',
    });
    const [editId, setEditId] = useState(null);
    
    // Get current UTC date/time
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0');
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            
            setCurrentDateTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
        };
        
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    // Fetch suppliers
    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`https://shop-mate-server.vercel.app/suppliers/${user.email}`);
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast.error('Failed to load suppliers');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSuppliers();
    }, [user.email]);
    
    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    // Handle form submission for adding new supplier
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const newSupplier = {
                ...formData,
                createdBy: user.email,
                createdAt: new Date().toISOString()
            };
            
            await axios.post(`https://shop-mate-server.vercel.app/suppliers`, newSupplier);
            toast.success('Supplier added successfully!');
            setFormData({
                companyName: '',
                contactName: '',
                email: '',
                phone: '',
                address: '',
                productsSupplied: '',
                paymentTerms: '',
                notes: '',
            });
            setIsAddFormOpen(false);
            fetchSuppliers();
        } catch (error) {
            console.error('Error adding supplier:', error);
            toast.error('Failed to add supplier');
        }
    };
    
    // Handle form submission for editing supplier
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedSupplier = {
                ...formData,
                updatedBy: user.email,
                updatedAt: new Date().toISOString()
            };
            
            await axios.put(`https://shop-mate-server.vercel.app/${editId}`, updatedSupplier);
            toast.success('Supplier updated successfully!');
            setFormData({
                companyName: '',
                contactName: '',
                email: '',
                phone: '',
                address: '',
                productsSupplied: '',
                paymentTerms: '',
                notes: '',
            });
            setIsEditFormOpen(false);
            setEditId(null);
            fetchSuppliers();
        } catch (error) {
            console.error('Error updating supplier:', error);
            toast.error('Failed to update supplier');
        }
    };
    
    // Open edit form and populate with supplier data
    const openEditForm = (supplier) => {
        setFormData({
            companyName: supplier.companyName,
            contactName: supplier.contactName,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
            productsSupplied: supplier.productsSupplied,
            paymentTerms: supplier.paymentTerms,
            notes: supplier.notes,
        });
        setEditId(supplier._id);
        setIsEditFormOpen(true);
        setIsAddFormOpen(false);
    };
    
    // Delete supplier
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`https://shop-mate-server.vercel.app/suppliers/${id}`);
                toast.success('Supplier deleted successfully!');
                fetchSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
                toast.error('Failed to delete supplier');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-2 md:p-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h1 className="text-xl md:text-2xl font-bold">Supplier Management</h1>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm md:text-base w-full sm:w-auto justify-center"
                    onClick={() => {
                        setIsAddFormOpen(!isAddFormOpen);
                        setIsEditFormOpen(false);
                        setFormData({
                            companyName: '',
                            contactName: '',
                            email: '',
                            phone: '',
                            address: '',
                            productsSupplied: '',
                            paymentTerms: '',
                            notes: '',
                        });
                    }}
                >
                    <FaPlus /> {isAddFormOpen ? 'Cancel' : 'Add Supplier'}
                </button>
            </div>
            
            {/* Add Supplier Form */}
            {isAddFormOpen && (
                <div className="bg-white shadow-md rounded p-3 md:p-6 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">Add New Supplier</h2>
                    <form onSubmit={handleAddSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Company Name*</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    placeholder="Company Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Contact Person*</label>
                                <input
                                    type="text"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    placeholder="Contact Person Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    placeholder="Email Address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Phone*</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    placeholder="Full Address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Products/Categories Supplied</label>
                                <input
                                    type="text"
                                    name="productsSupplied"
                                    value={formData.productsSupplied}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    placeholder="e.g., Electronics, Furniture, Food items"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Payment Terms</label>
                                <input
                                    type="text"
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    placeholder="e.g., Net 30, Advance payment"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    rows="3"
                                    placeholder="Any additional information..."
                                ></textarea>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-3 w-full sm:w-auto text-sm md:text-base"
                        >
                            Add Supplier
                        </button>
                    </form>
                </div>
            )}
            
            {/* Edit Supplier Form */}
            {isEditFormOpen && (
                <div className="bg-white shadow-md rounded p-3 md:p-6 mb-4">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">Edit Supplier</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Company Name*</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Contact Person*</label>
                                <input
                                    type="text"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Email*</label>
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
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Phone*</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Products/Categories Supplied</label>
                                <input
                                    type="text"
                                    name="productsSupplied"
                                    value={formData.productsSupplied}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Payment Terms</label>
                                <input
                                    type="text"
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700 mb-1 text-sm md:text-base">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <button 
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm md:text-base"
                            >
                                Update Supplier
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
            
            {/* Suppliers List */}
            <div className="bg-white shadow-md rounded overflow-hidden">
                {isLoading ? (
                    <div className="text-center p-4">Loading suppliers...</div>
                ) : suppliers.length === 0 ? (
                    <div className="text-center p-4">No suppliers found. Add your first supplier!</div>
                ) : (
                    <>
                        {/* Desktop Table - Hidden on mobile */}
                        <div className="hidden md:block">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-3 text-left text-xs md:text-sm">Company</th>
                                        <th className="py-2 px-3 text-left text-xs md:text-sm">Contact</th>
                                        <th className="py-2 px-3 text-left text-xs md:text-sm">Email/Phone</th>
                                        <th className="py-2 px-3 text-left text-xs md:text-sm">Products</th>
                                        <th className="py-2 px-3 text-left text-xs md:text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map(supplier => (
                                        <tr key={supplier._id} className="border-t hover:bg-gray-50">
                                            <td className="py-3 px-3 text-xs md:text-sm">
                                                <p className="font-medium">{supplier.companyName}</p>
                                                <p className="text-xs text-gray-500">{supplier.address}</p>
                                            </td>
                                            <td className="py-3 px-3 text-xs md:text-sm">{supplier.contactName}</td>
                                            <td className="py-3 px-3 text-xs md:text-sm">
                                                <p>{supplier.email}</p>
                                                <p className="text-gray-600">{supplier.phone}</p>
                                            </td>
                                            <td className="py-3 px-3 text-xs md:text-sm">
                                                <p className="truncate max-w-[200px]">{supplier.productsSupplied}</p>
                                                <p className="text-xs text-gray-500">Terms: {supplier.paymentTerms}</p>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                                                        onClick={() => openEditForm(supplier)}
                                                        aria-label="Edit"
                                                    >
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button 
                                                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                                        onClick={() => handleDelete(supplier._id)}
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
                        
                        {/* Mobile Card View */}
                        <div className="md:hidden">
                            {suppliers.map(supplier => (
                                <div key={`mobile-${supplier._id}`} className="border-b p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{supplier.companyName}</h3>
                                            <p className="text-xs text-gray-600">{supplier.contactName}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button 
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                                                onClick={() => openEditForm(supplier)}
                                                aria-label="Edit"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button 
                                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                                onClick={() => handleDelete(supplier._id)}
                                                aria-label="Delete"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs flex items-center gap-1">
                                            <FaPhone className="text-gray-500" /> {supplier.phone}
                                        </p>
                                        <p className="text-xs flex items-center gap-1">
                                            <FaEnvelope className="text-gray-500" /> {supplier.email}
                                        </p>
                                        {supplier.address && (
                                            <p className="text-xs flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-gray-500" /> {supplier.address}
                                            </p>
                                        )}
                                        {supplier.productsSupplied && (
                                            <p className="text-xs flex items-start gap-1">
                                                <FaBox className="text-gray-500 mt-0.5" /> 
                                                <span>{supplier.productsSupplied}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Supplier;