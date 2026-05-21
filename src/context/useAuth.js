import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Import menggunakan kurung kurawal

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;