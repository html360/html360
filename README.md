<p align="center">
  <img src="src/view/assets/html360.svg" width="128" alt="html360 logo">
</p>

A simple CLI tool to pack 360° equirectangular panoramas into a single, standalone HTML file. 
Perfect for sharing with friends via messengers or viewing offline.

## 💡 The Core Idea
The philosophy of **html360** is to make a 360° panorama feel like a simple, universal file (like a standard image or video). 

You can open it on any device without:
- Installing special software (**any modern web browser is all you need**).
- Relying on external services (Google Photos, Yandex Disk, etc.).
- An internet connection.

It turns a complex interactive experience into a single portable document.

## ✨ Features
- **All-in-one**: JS, CSS, and your photo (WebP Base64) inside one portable HTML.
- **Optimization**: Automatic 8K resizing and WebP conversion via [Sharp](https://sharp.pixelplumbing.com).
- **Zero Dependencies**: The output file works without a server or internet connection.
- **Mobile Ready**: Built-in support for touch gestures and gyroscope.
- **Powered by**: Uses the lightweight [Pannellum](https://pannellum.org) viewer.

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

## 📂 Why use this?
Normally, sharing a 360° panorama requires a web server or a specialized app. html360 converts your image into a single document that you can send as a file. The recipient just needs a browser to open it.

## 📜 License
MIT

## 🛠 Windows Integration

One of the coolest features of **html360** is the ability to pack panoramas directly from your File Explorer. No terminal skills required for your friends!

![Windows Context Menu Preview](https://github.com/d-hand/html360/blob/main/assets/windows-integration.png)
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

## 📊 Optimization Stats
How `html360` saves space while keeping **8K quality** (8192×4096):

| Feature | Raw JPEG (Original) | html360 Output (WebP) | Improvement |
| :--- | :--- | :--- | :--- |
| **File Size** | ~12.0 MB | **~2.4 MB** | **-80% Smaller** |
| **Portability** | Image only | **Single HTML file** | JS/CSS included |
| **Accessibility**| Requires viewer | **Any Browser** | Instant 360° |

## 💻 Requirements

To use **html360**, you need to have the following installed:

- **[Node.js](https://nodejs.org)**: `v20.10.0` or higher (LTS recommended)
- **Windows** (optional): Only required for the `install-menu` feature

## 🤝 Credits
This project was developed with the creative and technical assistance of **Google Gemini**. 
Together, the panoramas were optimized, the CLI architecture was built, and the Windows integration was polished to make **html360** a reality.
