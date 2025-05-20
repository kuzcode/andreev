import React, { createContext, useContext, useState } from 'react';

const DetailsContext = createContext();

export const DetailsProvider = ({ children }) => {
    const [details, setDetails] = useState({ visible: 0 });

    return (
        <DetailsContext.Provider value={{ details, setDetails }}>
            {children}
        </DetailsContext.Provider>
    );
};

export const useDetails = () => {
    const context = useContext(DetailsContext);
    if (!context) {
        throw new Error('useDetails must be used within a DetailsProvider');
    }
    return context;
}; 