<p align="center">
  <img src="src/view/assets/html360.svg" width="128" alt="html360 logo">
</p>

A simple CLI tool to pack 360° equirectangular panoramas into a single, standalone HTML file. 
Perfect for sharing with friends via messengers or viewing offline.

## 💡 The Core Idea
The philosophy of **html360** is to make a 360° panorama feel like a simple, universal file (like a image or video). 

You can open it on any device without:
- Installing special software (**any modern web browser is all you need**).
- Relying on external services (Google Photos, Yandex Panoramas, etc.).
- An internet connection.

## 🖼️ Live Demo
Experience the result of an 8K panorama processed by html360:
[View Demo](https://d-hand.github.io/Html360/LiveDemo.html)


## 🚀 Quick Start
Install it globally:
```
npm install -g html360
```
Or run it without installation using `npx`:
```
npx html360 panorama_1.jpg panorama_2.jpg
```


## ✨ Windows Integration

One of the coolest features of **html360** is the ability to pack panoramas directly from your File Explorer. No terminal skills required for your friends!

![Windows Context Menu Preview](https://github.com/d-hand/html360/raw/dev/assets/windows-integration-v2.gif)
*Right-click -> Send to -> html360*

### Setup Context Menu
After installing the package globally, run this command **once** to add html360 to your "Send To" menu:
```
html360 install-menu
```
### Remove Context Menu
```
html360 uninstall-menu
```
### How it works
1. Open any folder with your 360° photos.
2. Select one or multiple JPEG/PNG files.
3. Right-click -> Send to -> html360.
4. Done! A standalone .html file will appear next to each image instantly.

## ✨ 8K Optimization
Be default `html360` uses **Sharp** to compress high-resolution panoramas while preserving **8K quality** (8192×4096).

*   **Before:** ~50 MB (Raw JPEG)
*   **After:** **~8 MB** (Optimized WebP inside HTML)

This results in a **~80% reduction** in file size, making your interactive 360° scenes incredibly fast to load and easy to share.

## ✨ Raw Original Mode
For archival purposes or high-end desktop viewing, use the **Raw Original** mode (`-r` or `--raw`). This skips all compression and embeds your source file bit-for-bit into the HTML.

> [!TIP]
> Use **8K mode** for sharing on mobile and web, and **Raw Original** for your personal high-quality collection where every pixel matters.
>
> **8K mode** is so precise that visual differences are virtually indistinguishable on **12K (12000×6000)** panoramas, even with moderate zooming. Significant visual improvements with **Raw Original** only become noticeable on ultra-high-resolution sources, such as **21K (21456×10728)** or higher, particularly when preserving fine textures and original color depth.




## 💻 Requirements

To use **html360**, you need to have the following installed:

- **[Node.js](https://nodejs.org)**: `v20.10.0` or higher (LTS recommended)
- **Windows** (optional): Only required for the `install-menu` feature

## 🤝 Built With
Big thanks to these amazing projects that power html360:
*   **[Pannellum](https://pannellum.org)** — the core 360° viewer engine.
*   **[Sharp](https://sharp.pixelplumbing.com)** — for high-speed image optimization.
*   **[Google Gemini](https://deepmind.google)** — for co-authoring the entire project.
*   **The Open Source Community** — and all the amazing dependencies that make this tool possible.

