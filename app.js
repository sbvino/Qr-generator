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
    const imageFile = document.getElementById("image").files[0];

    if (!content) {
      alert("Please enter the QR content.");
      return;
    }

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
        color: background,
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
    qrContainer.innerHTML = "";
    qrCode.append(qrContainer);

    downloadBtn.style.display = "inline-block";
  });

  downloadBtn.addEventListener("click", () => {
    if (qrCode) qrCode.download({ name: "qr-code", extension: "png" });
  });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
});
