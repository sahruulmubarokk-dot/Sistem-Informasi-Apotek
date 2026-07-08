import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

// Hook useAuth untuk mempermudah akses state auth dan role di level komponen UI
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
