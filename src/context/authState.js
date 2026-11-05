import { createContext } from 'react';
// Kept separate from the provider for Fast Refresh and a clean hook import.
export const AuthContext = createContext(null);
