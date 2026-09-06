import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// Deny every powerful browser feature — camera, mic, location, USB/serial/HID,
// bluetooth and friends. An empty allowlist "()" means nobody may use it, not
// even this site, so the browser refuses the request instead of prompting.
// Kept in sync with the Permissions-Policy header in vercel.json (production).
const PERMISSIONS_POLICY =
  "accelerometer=(), ambient-light-sensor=(), autoplay=(), bluetooth=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), local-fonts=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), usb=(), window-management=(), xr-spatial-tracking=()";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: { "Permissions-Policy": PERMISSIONS_POLICY },
  },
  preview: {
    headers: { "Permissions-Policy": PERMISSIONS_POLICY },
  },
});
