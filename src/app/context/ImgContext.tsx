import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface ImgContextType {
  img: Blob | null;
  setImg: (url: Blob | null) => void;
}

// Create the context
const ImgContext = createContext<ImgContextType | undefined>(undefined);

// Create a provider component
export const ImgProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [img, setImg] = useState<Blob | null>(null);

  return (
    <ImgContext.Provider value={{ img, setImg }}>
      {children}
    </ImgContext.Provider>
  );
};

// Create a custom hook to use the ImgUrl context
export const useImg = () => {
  const context = useContext(ImgContext);
  if (!context) {
    throw new Error('useImg must be used within an ImgUrlProvider');
  }
  return context;
};
