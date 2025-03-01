
import React, { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const ToastContext = createContext();

//ToastProvider is a component that wraps the child components and provides the toast functions to them
export const ToastProvider = ({ children,notifiedOn,setNotifiedOn }) => {
  const [toastList, setToastList] = useState([]);

  const showToast = (text, type, category = "") => {
    setToastList((currentList) => {
      //if a toast with the same text and type is already present OR a toast with the same category (that is set aka. not "") is present then remove it and add the new toat to the list
      return [{ text: text, type: type, category: category }, ...currentList.filter(item => (item.text != text || item.type != type) && (category == "" || item.category != category))]; //add the new toast to the list 
    });
  }
  const removeToast = () => {
    if (toastList.length > 0) {
      setToastList((toastList) => toastList.filter((item, i) => i != toastList.length - 1)); //(using filter instead of splice to avoid to change the state)

    }
  }
  return (
    <ToastContext.Provider value={{ showToast, toastList, removeToast,notifiedOn,setNotifiedOn }}>
      {children}
    </ToastContext.Provider>
  );
};


export const useToast = () => useContext(ToastContext); // Hook for child components to get the toast functions

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  notifiedOn: PropTypes.string.isRequired,
  setNotifiedOn: PropTypes.func.isRequired
};