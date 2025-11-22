"use client";

import { createContext, useContext, useState, useEffect } from "react";

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [isRegistered, setIsRegistered] = useState(false);

  // Load registration status from localStorage on mount
  useEffect(() => {
    const storedStatus = localStorage.getItem("isRegistered");
    if (storedStatus === "true") {
      setIsRegistered(true);
    }
  }, []);

  // Update localStorage when registration status changes
  const registerUser = () => {
    setIsRegistered(true);
    localStorage.setItem("isRegistered", "true");
  };

  return (
    <RegistrationContext.Provider value={{ isRegistered, registerUser }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  return useContext(RegistrationContext);
}
