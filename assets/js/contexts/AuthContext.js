import React from 'react';

// on des informations qu'on aimerait faire passer a tout nos composants s'ils ont  besoins 
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: value => { }
});// on lui donne la forme( les defintion)