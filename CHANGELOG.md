# CHANGELOG

<!-- ####################################################################################################### -->

## 2.8.1 (2026-04-26)
### Fixed
- **Button Duplication:** Resolved an issue where control buttons were duplicated after saving the page or re-initializing the viewer.

### Changed
- **Demo Migration:** Moved all demo examples from a personal repository to the official organization repository: [html360.github.io](https://html360.github.io/).
<!-- ####################################################################################################### -->

## 2.8.0 (2026-04-22)
### ✨ Features
- **Goodbye Manual Copying**: Orientation coordinates now flow directly from your preview window to your project.
- **One-Click Workflow**: Open the target panorama, find your angle, and let the system handle the math.
- **Integrated Setup**: Enhanced bridge between the controller and the viewer for a lag-free crafting experience.

<!-- ####################################################################################################### -->

## 2.7.0 (2026-04-12)
### ✨ Features
- Added button to copy view orientation as URL parameters.
- Implemented automatic view parsing from query strings (yaw, pitch, hfov).

### 🛠 Technical Changes
- Update html360-gen to the latest version.
- Removed redundant/internal typings for html360-gen
- Adjusted esbuild configuration (disabled minifyIdentifiers) to ensure production stability with complex generic types

<!-- ####################################################################################################### -->

## 2.6.0 (2026-04-06)
### ✨ Features
- **Gigapixel Support**: New multires command for 40K+ panoramas using tile slicing.
- **Binary Core**: Integrated pre-compiled generate.py (Pannellum) for Win/Mac/Linux via `@html360/gen`.
- **Zero-Dependency**: No Python installation required.

<!-- ####################################################################################################### -->

## 2.5.1 (2026-03-27)
- Repair broken build caused by minification

<!-- ####################################################################################################### -->

## 2.5.0 (2026-03-27)
### ✨ Features
- **Visual 3D Tour Editor**: Create interconnected panoramas directly in your browser. No coding required.
- **Smart URL Autocomplete**: When linking panoramas, the editor automatically indexes and suggests relative paths for all processed files.
- **Rich Information Spots**: Add interactive tooltips with text descriptions and external web links (e.g., Wikipedia).
- **Precision Crosshair**: New high-contrast central crosshair with a dual-outline design for perfect visibility on any background (snow, sky, or shadows).
- **Interactive States**: Visual feedback (scaling and color changes) when the crosshair hovers over active hotspots.

---
*This release marks a milestone in AI-human co-creation, bringing professional 3D-tour editing capabilities to everyone.*

<!-- ####################################################################################################### -->


## 2.4.0 (2026-03-18)
### ✨ Features
- **Viewport Persistence (Editor Mode)**: You can now set the default starting angle (yaw and pitch) directly in the browser. Rotate the panorama to the perfect spot, hit Save, and the HTML file will remember that exact view the next time it's opened.
- **Zero-UI Experience**: We’ve embraced a minimalist aesthetic. By default, there are no buttons or overlays on the screen—just your panorama. Nothing stands between you and the 360° immersion.
- **Smart Context Menu**: All essential tools have migrated to a clean, modern context menu accessible via Right-Click (Desktop) or Long Press (Mobile)
  - **Fullscreen**: Instant immersion in one tap.
  - **Save**: Inject the current coordinates into the file’s code.
  - **Credits**: Quick links to the project's roots—html360 and Pannellum.


### 🛠 Technical Changes
- **Optimized Build Pipeline**:  Clear separation between Production and Development builds.
  - **Production**: Clean, lightweight builds with Source Maps disabled for maximum performance and privacy.
  - **Development**: Full debugging capabilities and source maps enabled for local coding.


<!-- ####################################################################################################### -->

## 2.3.0 (2026-03-13)
### ✨ Features
- **Raw Original Mode (`-r`, `--raw`)**: New processing mode that embeds images as-is without any compression or resizing. Perfect for archiving and high-end desktop viewing.
- **Smart Suffixe**: Generated HTML files now include suffixe in their names:
  - `_RAW.html` for original quality versions.
- **Enhanced Windows Integration**:
  - `install-menu` now adds two distinct options to the "Send To" menu:
    - **html360 (8K)**: Fast, web-optimized 8K WebP.
    - **html360 (Raw Original)**: Bit-perfect copy of your source.
  - `install-menu` and `uninstall-menu` now automatically remove legacy shortcuts from previous versions to keep your "Send To" menu clean.
- **Strict Format Validation**: Added explicit checks for supported formats (JPG, PNG, WebP).
- **HEIC Warning**: Informative error message when attempting to process Apple's HEIC format, explaining browser incompatibility.


<!-- ####################################################################################################### -->

## 2.2.2 (2026-03-11)
- Update README.md


<!-- ####################################################################################################### -->

## 2.2.1 (2026-03-09)
- Update README.md

<!-- ####################################################################################################### -->

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