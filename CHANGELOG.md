# CHANGELOG

<!-- ####################################################################################################### -->

## 2.2.1 (2026-03-09)
### 📝 Docs
- Update README.md

## 2.2.0 (2026-03-09)
### ✨ Features
- **Full Stream Integration**: Transitioned to a "pipe-through" data flow. Images are read, resized, WebP-compressed, Base64-encoded, and written to the HTML template in a single, continuous stream.
- **Adaptive Concurrency (p-limit)**: The engine now intelligently utilizes all available CPU cores. It processes up to 11 files simultaneously (adaptive to your hardware), maximizing throughput.
- **Zero-Copy Memory Management**: By utilizing native system memory for image processing, we’ve kept the JavaScript Heap nearly empty, preventing "Out of Memory" crashes on 8K+ panoramas.
- **Next-Gen File I/O**: Implemented asynchronous FileHandle for direct streaming to disk, reducing overhead and improving I/O wait times.

### 📈 Benchmark Results (Batch of 21 Panoramas): ###
- **Total Processing Time**: ↓ Reduced from 2:05 min to 34.5 sec (3.6x faster!).
- **JS Heap Usage**: ↓ Consistent ~12 MB instead of massive memory spikes.
- **Resource Efficiency**: High-speed parallel processing without blocking the main event loop.

<!-- ####################################################################################################### -->

## 2.1.1 (2026-03-07)
### 📝 Docs
- Update README.md 

<!-- ####################################################################################################### -->

## 2.1.0 (2026-03-07)
### ✨ Features
- **Loader**: Added loader.
- **Performance Fix**: Implemented deferred initialization to ensure the UI renders before heavy data parsing begins.

### 🛠 Technical Changes
- **Bundled Architecture**: Switched to esbuild for high-speed JS/CSS bundling. All assets are now minified and inlined into a single HTML.
- **TypeScript Migration**: Rewrote the viewer core in TypeScript for better stability and future-proofing.
- **Memory Optimization**: Automatic cleanup of heavy Base64 strings from the DOM after initialization to save RAM.

<!-- ####################################################################################################### -->

## 2.0.0 (2026-03-05)
### ⚠️ BREAKING CHANGES
- **Node.js**: Increased minimum required version to **>=20.10.0**.
- **ES Modules**: Fully migrated from CommonJS (CJS) to **ESM**.
- **TypeScript**: Migrated codebase to **TypeScript** with **esbuild** (targeting ES2020).

### ✨ Features
- **CLI**: The application now displays `--help` by default when run without arguments.
- **CLI**: Added application name to the `--help` output.
- **Metadata**: Application name, description, and version are now dynamically pulled from `package.json`.
- **System**: Added robust handling for missing `APPDATA` environment variable.
- **Batch**: Updated `menu.bat` to ensure it launches the local version of the app.
- **UX**: Implemented `progressBar` termination on critical errors for a smoother exit.
- **Demo**: Added a Live Demo link/module to the project.

### 🛠 Technical Changes
- **Refactoring**: Implemented a centralized global error handler.
- **Refactoring**: Converted `installMenu` and `uninstallMenu` to asynchronous functions.
- **Logging**: Cleaned up and standardized error logging across the application.
- **Dependencies**: Moved `png-to-ico` to `devDependencies`.

<!-- ####################################################################################################### -->

## 1.0.0 (2026-02-28)
- **Initial public release** 🚀