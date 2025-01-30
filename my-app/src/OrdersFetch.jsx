import React, { useEffect, useState } from "react";


    const fetchOrders = async () => {
    try {
        const response = await fetch("http://localhost:3000/Orders");
        if (!response.ok) {
        throw new Error("Failed to fetch books");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
    };

    
    export default fetchOrders;