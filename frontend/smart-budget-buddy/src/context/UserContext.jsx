// // src/context/UserContext.jsx
// import { createContext, useContext, useState } from "react";

// export const UserContext = createContext({
//   user: null,
//   updateUser: () => {},
//   clearUser: () => {},
// });

// export const useUser = () => useContext(UserContext);

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const updateUser = (userData) => setUser(userData);
//   const clearUser = () => setUser(null);

//   const value = { user, updateUser, clearUser };

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;


import { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };
    // Function to clear user data (e.g., on logout)
    const clearUser = () => {
        setUser(null);
    };
    return (
        <UserContext.Provider
            value={{
            user,
            updateUser,
            clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
);
}

export default UserProvider;
