import React, { createContext, useContext, useState } from 'react';

// Create a context to hold user data
const UserContext = createContext();

// Create a custom hook to access the user context
export const useUser = () => useContext(UserContext);

// Create a UserProvider component to wrap the app with
export const UserProvider = ({ children }) => {
  // State to hold user data
  const [user, setUser] = useState({});

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Value to be provided by the context
  const contextValue = {
    user,
    updateUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
