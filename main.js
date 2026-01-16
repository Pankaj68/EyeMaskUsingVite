import * as deepar from 'deepar';

let deepAR;

(async () => {
  deepAR = await deepar.initialize({
    licenseKey: '06d66a806c030718de2af747a77ae8227e21f4580f2fdf483df7d1343fbaa2063ea701e05e945ab9',
    previewElement: document.getElementById('deepar-div'),
    effect: '/effects/EyeMaskARFilter-v2.deepar'
  });

  setupUI();
})();

function setupUI() {
  const recordBtn = document.getElementById('recordBtn');

  recordBtn.onclick = async () => {
    recordBtn.style.display = 'none';

    const screenshotBase64 = await deepAR.takeScreenshot();
    const finalImage = await addBorderToImage(
      screenshotBase64,
      'public/Assets/border-3.png'
    );

    showPreview(finalImage);
  };
}

function addBorderToImage(screenshotBase64, borderSrc) {
  return new Promise((resolve) => {
    const screenshotImg = new Image();
    const borderImg = new Image();

    screenshotImg.onload = () => {
      borderImg.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = screenshotImg.naturalWidth;
        canvas.height = screenshotImg.naturalHeight;

        ctx.drawImage(screenshotImg, 0, 0);
        ctx.drawImage(borderImg, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/png'));
      };
      borderImg.src = borderSrc;
    };
    screenshotImg.src = screenshotBase64;
  });
}

function showPreview(finalBase64) {
  const overlay = document.getElementById('previewOverlay');
  const img = document.getElementById('previewImage');

  img.src = finalBase64;
  overlay.style.display = 'block';

  document.getElementById('closePreview').onclick = () => {
    overlay.style.display = 'none';
    document.getElementById('recordBtn').style.display = 'block';
  };

  document.getElementById('savePreview').onclick = () => {
    const a = document.createElement('a');
    a.href = finalBase64;
    a.download = 'deepar-photo-with-border.png';
    a.click();
  };
}
