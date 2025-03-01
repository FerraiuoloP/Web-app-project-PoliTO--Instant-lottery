import React, { useEffect } from 'react';
import { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';

//ToastWrapper is a component that wraps/style the existing toast from react-bootstrap and shows them one above the other
function ToastWrapper() {
  const { removeToast, toastList } = useToast();

  useEffect(() => { //delete the fitst toast after 5 seconds (after the last toast is added)
    const interval = setInterval(() => {
      removeToast();
    }, 5000);

    return () => clearInterval(interval);

  }, [toastList])



  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="bg-dark position-relative opacity-90"

    >
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        {toastList.map((toast, index) => (  //showing the toasts

          <Toast
            key={index}
            bg={toast.type}
            style={{ animation: 'fadeIn 0.5s' }}
            onClose={() => removeToast()} //remove toast from list 

          >
            <Toast.Header>

              <strong className="me-auto">
                {toast.type == "info" ? "Notification" : toast.type == "danger" ? "Warning" : toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
              </strong>

            </Toast.Header>
            <Toast.Body><b>{toast.text}</b></Toast.Body>
          </Toast>

        ))}
      </ToastContainer>

    </div>
  );
}
export default ToastWrapper;