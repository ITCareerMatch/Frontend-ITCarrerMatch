import { createContext } from 'react';

const AuthContext = createContext({ session: null, loading: true });

export default AuthContext;
