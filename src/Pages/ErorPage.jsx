import React from 'react';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import animation from '../assets/404-animation.json';

const ErorPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Animation */}
                <div className="mb-8">
                    <Lottie 
                        animationData={animation} 
                        className="w-64 h-64 mx-auto"
                        loop={true}
                    />
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Sorry, the page you are looking for doesn't exist.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link 
                        to="/"
                        className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        Go Home
                    </Link>
                    <button 
                        onClick={() => window.history.back()}
                        className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErorPage;