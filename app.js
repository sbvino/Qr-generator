document.addEventListener("DOMContentLoaded", () => {
  const qrForm = document.getElementById("qr-form");
  const qrContainer = document.getElementById("qr-container");
  const downloadBtn = document.getElementById("download-btn");
  let qrCode = null;

  qrForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = document.getElementById("content").value.trim();
    const pattern = document.getElementById("pattern").value;
    const foreground = document.getElementById("foreground").value;
    const background = document.getElementById("background").value;
    const transparency = parseInt(document.getElementById("transparency").value);
    const imageFile = document.getElementById("image").files[0];

    if (!content) {
      alert("Please enter the QR content.");
      return;
    }

    // Convert transparency to alpha value (0 to 1)
    const alpha = (100 - transparency) / 100;
    const backgroundColor = `rgba(${hexToRgb(background).join(",")}, ${alpha})`;

    const options = {
      width: 300,
      height: 300,
      data: content,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
      },
      dotsOptions: {
        type: pattern,
        color: foreground,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
    };

    if (imageFile) {
      try {
        const imageSrc = await toBase64(imageFile);
        options.image = imageSrc;
      } catch (err) {
        console.error("Error reading image file:", err);
      }
    }

    if (qrCode) qrCode.clear();
    qrCode = new QRCodeStyling(options);
    qrContainer.innerHTML = ""; // Clear previous QR code
    qrCode.append(qrContainer); // Append new QR code

    downloadBtn.style.display = "inline-block";
  });

  downloadBtn.addEventListener("click", () => {
    if (qrCode) {
      qrCode.download({ name: "qr-code", extension: "png" });
    }
  });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Helper function to convert HEX color to RGB
  const hexToRgb = (hex) => {
    let bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
});
