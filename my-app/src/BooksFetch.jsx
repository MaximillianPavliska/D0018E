import React, { useEffect, useState } from "react";
import configfile from "../../Data/configReact";


    const fetchBooks = async () => {
    try {
        const response = await fetch(`http://${configfile.HOST}:3000/Books`);
        if (!response.ok) {
        throw new Error("Failed to fetch books");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
    };

    
    export default fetchBooks;