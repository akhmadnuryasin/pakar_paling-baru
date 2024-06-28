import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-context';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/sign-in" />;
    }

    return children;
};

export default ProtectedRoute;
