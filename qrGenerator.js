class QRGenerator {
    static generate(url) {
        const qrContainer = document.getElementById('qrCodeContainer');
        qrContainer.innerHTML = ''; // Clear previous QR code

        // Generate QR code
        try {
            new QRCode(qrContainer, {
                text: url,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('QR Code generation failed:', error);
            qrContainer.innerHTML = '<p class="error">Failed to generate QR code</p>';
        }
    }

    static downloadQR() {
        const img = document.querySelector('#qrCodeContainer img');
        if (!img) return;

        const link = document.createElement('a');
        link.download = 'vizitqr-code.png';
        link.href = img.src;
        link.click();
    }
} 