import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "/ECT111-github.io/", // ต้องตรงกับชื่อ repo เป๊ะ
})
