# CHANGELOG

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

### 🛠 Internal Improvements
- **Refactoring**: Implemented a centralized global error handler.
- **Refactoring**: Converted `installMenu` and `uninstallMenu` to asynchronous functions.
- **Logging**: Cleaned up and standardized error logging across the application.
- **Dependencies**: Moved `png-to-ico` to `devDependencies`.

## 1.0.0 (2026-02-28)
- **Initial public release** 🚀