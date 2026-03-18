const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    async scanListing(listingData) {
        const response = await fetch(`${API_BASE_URL}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listingData),
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        
        return response.json();
    },

    async getHistory() {
        const response = await fetch(`${API_BASE_URL}/history`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        
        return response.json();
    },

    async getListing(id) {
        const response = await fetch(`${API_BASE_URL}/listings/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        
        return response.json();
    }
};
