import React, { useEffect, useState } from "react";
import configfile from "../../Data/configReact";


    const fetchUser = async () => {
    try {
        const response = await fetch(`http://${configfile.HOST}:3000/Users`);
        if (!response.ok) {
        throw new Error("Failed to fetch books");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
    };

    
    export default fetchUser;