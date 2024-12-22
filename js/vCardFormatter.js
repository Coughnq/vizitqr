class VCardFormatter {
    static createVCardString(data) {
        const vCard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${data.name || ''}`,
            `TITLE:${data.title || ''}`,
            `EMAIL:${data.email || ''}`,
            `TEL:${data.phone || ''}`,
            `URL:${data.website || ''}`,
            'END:VCARD'
        ].join('\n');

        return vCard;
    }

    static createCardHTML(data) {
        if (!data.name && !data.email) {
            return this.createDemoCard();
        }

        // Set theme color and calculate lighter shade
        const themeColor = data.themeColor || '#2563eb';
        const themeLight = this.calculateLighterShade(themeColor);
        document.documentElement.style.setProperty('--theme-color', themeColor);
        document.documentElement.style.setProperty('--theme-light', themeLight);

        return `
            <div class="vcard">
                <div class="vcard-header">
                    <div class="avatar">${this.getInitials(data.name)}</div>
                    <div class="header-content">
                        <h2>${data.name}</h2>
                        ${data.title ? `<p class="title">${data.title}</p>` : ''}
                    </div>
                </div>
                <div class="vcard-content">
                    ${data.email ? `
                        <div class="contact-item">
                            <div class="icon">📧</div>
                            <div class="details">
                                <label>Email</label>
                                <a href="mailto:${data.email}">${data.email}</a>
                            </div>
                        </div>
                    ` : ''}
                    ${data.phone ? `
                        <div class="contact-item">
                            <div class="icon">📱</div>
                            <div class="details">
                                <label>Phone</label>
                                <a href="tel:${data.phone}">${data.phone}</a>
                            </div>
                        </div>
                    ` : ''}
                    ${data.website ? `
                        <div class="contact-item">
                            <div class="icon">🌐</div>
                            <div class="details">
                                <label>Website</label>
                                <a href="${data.website}" target="_blank">${data.website}</a>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    static createDemoCard() {
        return this.createCardHTML({
            name: "John Doe",
            title: "Senior Developer",
            email: "john@example.com",
            phone: "+1 (234) 567-890",
            website: "https://example.com",
            themeColor: "#1a1a1a"
        });
    }

    static getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    static calculateLighterShade(hex) {
        // Convert hex to RGB
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);

        // Make it lighter
        r = Math.min(255, r + 50);
        g = Math.min(255, g + 50);
        b = Math.min(255, b + 50);

        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
} 