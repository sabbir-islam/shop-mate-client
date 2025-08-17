# ShopMate - Shop Management System

A modern, responsive shop management system built with React and Vite. ShopMate helps small to medium businesses manage their inventory, sales, employees, and generate reports efficiently.

![ShopMate Dashboard](./public/icon.png)

## 🚀 Features

### 📊 Dashboard & Analytics
- Real-time sales analytics and charts
- Inventory overview and low stock alerts
- Revenue tracking and profit calculations
- Daily, weekly, and monthly reports

### 🛍️ Sales Management
- Easy point-of-sale interface
- Quick product search and filtering
- Shopping cart with quantity management
- Customer information tracking
- Discount application
- Real-time stock validation

### 📦 Inventory Management
- Add, edit, and delete products
- Image upload support
- Category management
- Stock level monitoring
- Buying and selling price tracking
- Low stock notifications

### 👥 Employee Management
- Employee registration and profiles
- Role-based access control
- Activity tracking
- Secure authentication

### 🚚 Supplier Management
- Supplier contact information
- Purchase history tracking
- Supplier performance metrics

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Modern UI with smooth animations
- Dark/Light theme support

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS, DaisyUI
- **Icons:** Heroicons, React Icons
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Authentication:** Firebase Auth
- **Notifications:** React Toastify
- **Charts:** Chart.js / Recharts
- **Deployment:** Vercel

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- A Firebase project for authentication
- Backend API server running

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shop-mate-client.git
   cd shop-mate-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
src/
├── Component/           # Reusable UI components
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── Pages/              # Application pages
│   ├── AddProduct.jsx
│   ├── AddSale.jsx
│   ├── EditProduct.jsx
│   ├── Employee.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   └── ...
├── Provider/           # Context providers
│   └── AuthProvider.jsx
├── Route/              # Routing configuration
├── firebase/           # Firebase configuration
│   └── firebaseConfig.js
├── assets/             # Static assets
├── App.jsx             # Main App component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## 🔑 Key Components

### [`Navbar`](src/Component/Navbar.jsx)
- Responsive sidebar navigation
- User profile display
- Real-time clock
- Authentication status
- Mobile-friendly collapsible menu

### [`AddSale`](src/Pages/AddSale.jsx)
- Product search and filtering
- Shopping cart functionality
- Stock validation
- Customer information form
- Discount calculations
- Real-time total updates

### [`AuthProvider`](src/Provider/AuthProvider.jsx)
- Firebase authentication integration
- User session management
- Protected route handling

## 🔐 Authentication

ShopMate uses Firebase Authentication for secure user management:

- Email/password authentication
- Session persistence
- Protected routes
- User profile management


## 📱 Mobile Responsiveness

- Optimized for mobile devices
- Touch-friendly interface
- Responsive grid layouts
- Mobile navigation menu

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **DaisyUI** for pre-built components
- Custom gradients and animations
- Consistent color scheme

## 🚀 Deployment

This project is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/sabbir-islam/shop-mate-client/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 Future Features

- [ ] Barcode scanning
- [ ] Multi-location support
- [ ] Advanced reporting dashboard
- [ ] Email notifications
- [ ] Backup and restore functionality
- [ ] Multi-language support
- [ ] Print receipts
- [ ] Loyalty program integration

## 👥 Team

- **Frontend Developer** - React, UI/UX
- **Backend Developer** - Node.js, Database
- **Designer** - UI/UX Design

---

Made with ❤️ for small businesses to grow and thrive.
