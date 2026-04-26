<p align="center">
  <img src="src/view/assets/html360.svg" width="128" alt="html360 logo">
</p>

A simple CLI tool to pack 360° equirectangular panoramas into a single, standalone HTML file. 
Perfect for sharing with friends via messengers or viewing offline.

<!-- ####################################################################################################### -->

## 💡 The Core Idea
The philosophy of **html360** is to make a 360° panorama feel like a simple, universal file (like a image or video). 

You can open it on any device without:
- Installing special software (**any modern web browser is all you need**).
- Relying on external services (Google Photos, Yandex Panoramas, etc.).
- An internet connection.

<!-- ####################################################################################################### -->

## 🖼️ Live Demo
Experience the power of **html360** with these interactive examples:
- **Standard (8K Optimized)**: [View 8K Demo](https://html360.github.io/LiveDemo/1.html)
  
  *Perfect for messengers. Single 8MB HTML file, fast and portable.*

- **Multiresolution (Gigapixel Panorama)**: [View 23K Demo](https://html360.github.io/Multiresolution/index.html)
  
  *The Milky Way (23,520 x 11,760 px). Infinite zoom, seamless tile loading.*

  *Image Credit: [P. Horálek & J. C. Casado / ESO](https://www.eso.org/public/images/potw2137b/)*


<!-- ####################################################################################################### -->

## 🚀 Quick Start
Install it globally:
```
npm install -g html360
```
Or run it without installation using `npx`:
```
npx html360 panorama_1.jpg panorama_2.jpg
```

<!-- ####################################################################################################### -->

## ✨ Windows Integration

One of the coolest features of **html360** is the ability to pack panoramas directly from your File Explorer. No terminal skills required for your friends!

![Windows Context Menu Preview](assets/windows-integration-v2.gif)
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

<!-- ####################################################################################################### -->

## ✨ Viewport Persistence
You can now define exactly what your audience sees first.

![Viewport Persistence](assets/viewport-persistence.gif)
*Rotate -> Right-click -> Save*
### How it works
1. Open your generated `.html` panorama in any browser.
2. Pan and tilt to find the **perfect starting angle**.
3. **Right-click** (Desktop) or **Long Press** (Mobile) to open the new context menu.
4. Select **Save**. Done! A new standalone .html file is downloaded, with your chosen coordinates baked into the code as the new default starting point.

<!-- ####################################################################################################### -->

## ✨ Create Interactive 3D Tours Right in Your Browser
Transform a collection of panoramas into a connected 3D experience without leaving your browser:

![3D-Tour-Editor-Demo](assets/3d-tour-editor.gif)

*   **Visual Editor:** Add transition points and info-spots with a few clicks.
*   **Smart Autocomplete:** Linked panoramas are automatically indexed, making it easy to connect scenes via relative URLs.
*   **Rich Info-Spots:** Embed text descriptions and external web links directly into your 360° space.

### 🛠 How to build your tour:
1. **Batch Process:** Run `html360 *.jpg` to generate HTML files for all your rooms.
2. **Enter Edit Mode:** Open any panorama and toggle the **Editor** (Right-click).
3. **Aim & Add Panorama:** Use the new **precision crosshair** to point at a door, select "Add Panorama", and pick the next room from the **smart autocomplete** list.
4. **Add Context:** Drop info-spots with text to make the tour informative.
5. **Baked-in Result:** Click **Save**. A new standalone HTML file is generated with all your hotspots and transitions baked inside. 

<!-- ####################################################################################################### -->

## ✨ Precision Tour Crafting
Take full control over your interactive 3D tours. 

![Copy Orientation Demo](assets/copy-orientation-v2.gif)

By default, a panorama has only one "home" position. With the **Orientation Copy** feature, you can define exactly what the user sees at every step. Now there are two ways to do this:
- **Manual**: Open a panorama in a new tab and copy coordinates manually.
- **Automatic (v2.8.0)**: Open the destination panorama in the built-in preview window. Just find the perfect view — the coordinates will sync automatically as you rotate the camera.


<!-- ####################################################################################################### -->

## ✨ 8K Optimization
Be default `html360` uses **Sharp** to compress high-resolution panoramas while preserving **8K quality** (8192×4096).

*   **Before:** ~50 MB (Raw JPEG)
*   **After:** **~8 MB** (Optimized WebP inside HTML)

This results in a **~80% reduction** in file size, making your interactive 360° scenes incredibly fast to load and easy to share.

<!-- ####################################################################################################### -->

## ✨ Raw Original Mode
For archival purposes or high-end desktop viewing, use the **Raw Original** mode (`-r` or `--raw`). This skips all compression and embeds your source file bit-for-bit into the HTML.

> ### 💡 Tip
> Use **8K mode** for sharing on mobile and web, and **Raw Original** for your personal high-quality collection where every pixel matters.
>
> **8K mode** is so precise that visual differences are virtually indistinguishable on **12K (12000×6000)** panoramas, even with moderate zooming. Significant visual improvements with **Raw Original** only become noticeable on ultra-high-resolution sources, such as **21K (21456×10728)** or higher, particularly when preserving fine textures and original color depth.

<!-- ####################################################################################################### -->

## ✨ Multiresolution: Gigapixel Panoramas
Forget about browser RAM or GPU limits. html360 can now process extreme resolution images (NASA/ESO 40K+ scale) by slicing them into thousands of smart interactive tiles.
- **Beyond 8K**: Automatically bypasses the MAX_TEXTURE_SIZE limits of modern browsers.
- **On-Demand Loading**: The viewer only loads the specific tiles you are looking at. This makes exploring giant gigapixel scenes instant and fluid.
- **Synchronous Pipeline**: Slicing is performed sequentially to protect your CPU and RAM from overloading when handling massive source files.

```bash
html360 multires massive_pano_01.tif massive_pano_02.tif ...
```
*This mode supports the same parameters as the original generate.py (haov, vaov, voffset, horizon, etc.), but with optimized defaults for maximum out-of-the-box quality.*

### Professional Multires Mode
The **Multiresolution** mode is a "heavy artillery" feature and works differently from the standard html360 experience:
1. **Breaking the "One File" Rule**: Instead of a single standalone HTML file, this mode generates a folder containing thousands of image fragments. This is technically required for browsers to "digest" gigapixel images piece by piece.
2. **Web Hosting Required**: Due to browser security policies (CORS), you cannot simply double-click the index.html from your disk. The result must be uploaded to a website or run via a local web server to be viewable.
3. **Specific Use-Cases**: Use this mode for professional web projects where extreme detail is more important than the ability to quickly send a single file via messenger.

### Under the Hood
While **html360** manages the CLI and templates, the heavy lifting is done by the battle-tested generate.py from the Pannellum project.
- **Portability**: We adapted the original script to run within the **Node.js** ecosystem and bundled it into **ready-to-use binaries** for Windows, Linux, and macOS.
- **Zero Dependencies**: You **do not** need to install Python. Everything is pre-compiled and shipped via our @html360/gen package.
- **Smart Defaults**: We’ve fine-tuned the core settings (e.g., default quality is set to 95%) to ensure your gigapixel tours look flawless without manual tweaking.

> ### 💡 Tip
> To truly feel the power of **Infinite Zoom**, we recommend using high-end source images of **60K (60,000 x 30,000 px)** or higher. 
> While standard panoramas look good, it's only at the **Gigapixel scale** that you can zoom into distant horizons and discover microscopic details — like reading a street sign from a kilometer away — without any pixelation. 
> **Pannellum** handles the heavy slicing, so don't be afraid to go big!

<!-- ####################################################################################################### -->

## 💻 Requirements

To use **html360**, you need to have the following installed:

- **[Node.js](https://nodejs.org)**: `v20.10.0` or higher (LTS recommended)
- **Windows** (optional): Only required for the `install-menu` feature

<!-- ####################################################################################################### -->

## 🤝 Built With
Big thanks to these amazing projects that power html360:
*   **[Pannellum](https://pannellum.org)** — the core 360° viewer engine.
*   **[Hugin](https://hugin.sourceforge.io/)** — specifically the nona tool, providing the power for panorama transformations.
*   **[Sharp](https://sharp.pixelplumbing.com)** — for high-speed image optimization.
*   **[Google Gemini](https://deepmind.google)** — for co-authoring the entire project.
*   **The Open Source Community** — and all the amazing dependencies that make this tool possible.

