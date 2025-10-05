import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000); // Hide after 2s
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
      {notification && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "#222",
          color: "#fff",
          padding: "1em 2em",
          borderRadius: 8,
          zIndex: 9999,
        }}>
          {notification}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
