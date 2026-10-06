const canvas = document.querySelector("#banner");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = "LY/Sharon-sem-meeting-pequeno.png";

const fileInput = document.querySelector("#file");
const zoomInput = document.querySelector("#zoom");
const rotationInput = document.querySelector("#rotation");
const controls = document.querySelector("#controls");
const uploadPanel = document.querySelector("#uploadPanel");
const state = { photo: null, zoom: 1, rotation: 0, x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 };

function resizeCanvas() {
  if (!background.naturalWidth) return;
  canvas.width = background.naturalWidth;
  canvas.height = background.naturalHeight;
  draw();
}

function draw() {
  if (!background.naturalWidth) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0);
  if (!state.photo) return;

  // Keep the photo inside the inner edge of the gold frame.
  const cx = canvas.width * 0.5;
  const cy = canvas.height * (964 / 1672);
  const radius = canvas.width * (197 / 941);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  const scale = Math.max((radius * 2) / state.photo.width, (radius * 2) / state.photo.height) * state.zoom;
  const width = state.photo.width * scale;
  const height = state.photo.height * scale;
  ctx.translate(cx + state.x, cy + state.y);
  ctx.rotate(state.rotation * Math.PI / 180);
  ctx.drawImage(state.photo, -width / 2, -height / 2, width, height);
  ctx.restore();

  // Restore the original ribbon in front of the photo. Its upper edge follows
  // the curve of this artwork, so the text and gold trim stay visible.
  const sx = canvas.width / 941;
  const sy = canvas.height / 1672;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 1207 * sy);
  ctx.lineTo(250 * sx, 1207 * sy);
  ctx.quadraticCurveTo(470 * sx, 1098 * sy, 700 * sx, 1128 * sy);
  ctx.lineTo(canvas.width, 1128 * sy);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(background, 0, 0);
  ctx.restore();
}

function loadPhoto(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(url);
    state.photo = image;
    state.zoom = 1;
    state.rotation = 0;
    state.x = 0;
    state.y = 0;
    zoomInput.value = "1";
    rotationInput.value = "0";
    uploadPanel.hidden = true;
    controls.hidden = false;
    draw();
  };
  image.src = url;
}

fileInput.addEventListener("change", (event) => loadPhoto(event.target.files[0]));
document.querySelector("#upload").addEventListener("click", () => fileInput.click());
document.querySelector("#change").addEventListener("click", () => fileInput.click());
zoomInput.addEventListener("input", () => { state.zoom = Number(zoomInput.value); draw(); });
rotationInput.addEventListener("input", () => { state.rotation = Number(rotationInput.value); draw(); });
document.querySelector("#rotate90").addEventListener("click", () => {
  state.rotation = (state.rotation + 90) % 360;
  rotationInput.value = String(state.rotation);
  draw();
});
document.querySelector("#reset").addEventListener("click", () => {
  state.zoom = 1; state.rotation = 0; state.x = 0; state.y = 0;
  zoomInput.value = "1"; rotationInput.value = "0"; draw();
});

canvas.addEventListener("pointerdown", (event) => {
  if (!state.photo) return;
  state.dragging = true;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", (event) => {
  if (!state.dragging) return;
  const scale = canvas.width / canvas.getBoundingClientRect().width;
  state.x += (event.clientX - state.lastX) * scale;
  state.y += (event.clientY - state.lastY) * scale;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  draw();
});
canvas.addEventListener("pointerup", () => { state.dragging = false; });
canvas.addEventListener("pointercancel", () => { state.dragging = false; });

document.querySelector("#download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "meu-banner-4-meeting.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

background.addEventListener("load", resizeCanvas);
