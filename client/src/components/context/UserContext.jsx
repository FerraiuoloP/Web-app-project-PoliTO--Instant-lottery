import React, { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const UserContext = createContext();

//UserProvider is a component that wraps the child components and provides the user functions to them
//I keep the context in a separate file to keep the App.js clean even tought it basically do not add any functionality
export const UserProvider = ({ children, isLoggedIn, user, loginChecked, refreshUser }) => {

    //OLD: replaced by refreshUserStatus
    // const refreshUser = async () => {
    //     try {
    //         const response = await API.getCurrentUser();
    //         setUser((currentUser)=>({...currentUser, points: response.points}));
    //     }
    //     catch (error) {

    //         console.error('Error refreshing points:', error);
    //     }
    // }

    return (
        <UserContext.Provider value={{ isLoggedIn, user, loginChecked, refreshUser}}>
            {children}
        </UserContext.Provider>
    )

}
export const useUser = () => useContext(UserContext);

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    loginChecked: PropTypes.bool.isRequired,
    refreshUser: PropTypes.func.isRequired
};