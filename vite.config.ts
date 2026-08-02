import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MyHondaPlusVehicleCard",
      formats: ["es"],
      fileName: () => "myhondaplus-vehicle-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
