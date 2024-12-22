class URLParser {
    static getParameters() {
        const params = new URLSearchParams(window.location.search);
        const vCardData = {};
        
        // Extract all parameters
        for (const [key, value] of params.entries()) {
            vCardData[key] = decodeURIComponent(value);
        }
        
        return vCardData;
    }

    static createParameterString(vCardData) {
        const params = new URLSearchParams();
        
        // Add all non-empty values to parameters
        Object.entries(vCardData).forEach(([key, value]) => {
            if (value) {
                params.append(key, encodeURIComponent(value));
            }
        });
        
        return params.toString();
    }
} 