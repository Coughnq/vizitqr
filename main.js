class App {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadInitialState();
    }

    initializeElements() {
        // Form elements
        this.cardCreator = document.getElementById('cardCreator');
        this.vCardForm = document.getElementById('vCardForm');
        this.cardDisplay = document.getElementById('cardDisplay');
        this.vCardContainer = document.getElementById('vCardContainer');
        
        // Form inputs
        this.formInputs = this.vCardForm.querySelectorAll('input');
        this.colorPicker = document.getElementById('themeColor');
        this.colorHexInput = document.getElementById('themeColorHex');
        
        // Buttons
        this.createNewBtn = document.getElementById('createNew');
        this.downloadQRBtn = document.getElementById('downloadQR');
        this.downloadVCardBtn = document.getElementById('downloadVCard');
        this.copyUrlBtn = document.getElementById('copyUrl');
        this.themeToggleBtn = document.getElementById('themeToggle');
    }

    attachEventListeners() {
        // Form submission
        this.vCardForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Real-time updates
        this.formInputs.forEach(input => {
            input.addEventListener('input', () => this.handleRealTimeUpdate());
        });
        
        // Color picker synchronization
        this.colorPicker.addEventListener('input', (e) => {
            this.colorHexInput.value = e.target.value.toUpperCase();
            this.handleRealTimeUpdate();
        });
        
        this.colorHexInput.addEventListener('input', (e) => {
            if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value)) {
                this.colorPicker.value = e.target.value;
                this.handleRealTimeUpdate();
            }
        });
        
        // Button clicks
        this.createNewBtn.addEventListener('click', () => this.toggleCardCreator());
        this.downloadQRBtn.addEventListener('click', () => QRGenerator.downloadQR());
        this.downloadVCardBtn.addEventListener('click', () => this.downloadVCard());
        this.copyUrlBtn.addEventListener('click', () => this.copyCurrentUrl());
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    handleRealTimeUpdate() {
        const formData = new FormData(this.vCardForm);
        const vCardData = Object.fromEntries(formData.entries());
        
        // Only update if at least name or email is filled
        if (vCardData.name || vCardData.email) {
            this.displayCard(vCardData);
            
            // Update URL and QR code if all required fields are filled
            if (this.vCardForm.checkValidity()) {
                const params = URLParser.createParameterString(vCardData);
                window.history.replaceState({}, '', `?${params}`);
                this.generateQRCode();
            }
        }
    }

    loadInitialState() {
        // Check URL parameters
        const vCardData = URLParser.getParameters();
        
        if (Object.keys(vCardData).length > 0) {
            // Fill form with URL data
            Object.entries(vCardData).forEach(([key, value]) => {
                const input = this.vCardForm.elements[key];
                if (input) {
                    input.value = value;
                }
            });
            
            // Display the vCard
            this.displayCard(vCardData);
            // Generate QR code
            this.generateQRCode();
        } else {
            // Show demo card
            this.vCardContainer.innerHTML = VCardFormatter.createDemoCard();
            this.cardCreator.classList.remove('hidden');
        }

        // Load saved theme preference
        this.loadTheme();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const vCardData = this.getFormData();
        
        // Update URL with form data
        const params = URLParser.createParameterString(vCardData);
        window.history.pushState({}, '', `?${params}`);
        
        // Display the card
        this.displayCard(vCardData);
        
        // Generate QR code
        this.generateQRCode();
        
        // Hide the form
        this.cardCreator.classList.add('hidden');
    }

    displayCard(data) {
        this.vCardContainer.innerHTML = VCardFormatter.createCardHTML(data);
    }

    generateQRCode() {
        // Get the base viewer URL - replace with your actual viewer URL
        const viewerUrl = 'https://v.intelliquinte.com';
        const params = URLParser.createParameterString(this.getFormData());
        const fullUrl = `${viewerUrl}?${params}`;
        QRGenerator.generate(fullUrl);
    }

    getFormData() {
        const formData = new FormData(this.vCardForm);
        return Object.fromEntries(formData.entries());
    }

    toggleCardCreator() {
        this.cardCreator.classList.toggle('hidden');
    }

    downloadVCard() {
        const vCardData = URLParser.getParameters();
        const vCardString = VCardFormatter.createVCardString(vCardData);
        
        const blob = new Blob([vCardString], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = 'contact.vcf';
        link.click();
        
        window.URL.revokeObjectURL(url);
    }

    async copyCurrentUrl() {
        try {
            const viewerUrl = 'https://v.intelliquinte.com';
            const params = URLParser.createParameterString(this.getFormData());
            const fullUrl = `${viewerUrl}?${params}`;
            await navigator.clipboard.writeText(fullUrl);
            this.copyUrlBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyUrlBtn.textContent = 'Copy URL';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    }

    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 