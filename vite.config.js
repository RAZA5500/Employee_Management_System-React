import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// Deny every powerful browser feature — camera, mic, location, USB/serial/HID,
// bluetooth, clipboard and friends. An empty allowlist "()" means nobody may
// use it, not even this site, so the browser refuses instead of prompting.
// Kept in sync with the Permissions-Policy header in vercel.json (production).
const PERMISSIONS_POLICY =
  "accelerometer=(), ambient-light-sensor=(), attribution-reporting=(), autoplay=(), bluetooth=(), browsing-topics=(), camera=(), captured-surface-control=(), clipboard-read=(), clipboard-write=(), compute-pressure=(), display-capture=(), encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), local-fonts=(), magnetometer=(), microphone=(), midi=(), otp-credentials=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), usb=(), web-share=(), window-management=(), xr-spatial-tracking=()";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Pinned: the API's CORS allowlist names this exact port. Without
    // strictPort, Vite silently moves to 5174 when 5173 is busy and every
    // request then dies as "Failed to fetch". Better to fail loudly here.
    port: 5173,
    strictPort: true,
    headers: { "Permissions-Policy": PERMISSIONS_POLICY },
  },
  preview: {
    port: 4173,
    strictPort: true,
    headers: { "Permissions-Policy": PERMISSIONS_POLICY },
  },
});
