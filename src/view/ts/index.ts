import pannellum from "./pannellum";

window.addEventListener("load", async () => {
  const dataElement = document.getElementById("panoramaData");
  const base64Data = dataElement!.textContent!.trim();
  const blob = await (await fetch(base64Data)).blob();
  const objectURL = URL.createObjectURL(blob);  

  window!.document!.getElementById("loader")!.style.display = "none";

  const viewer = pannellum.viewer("panorama", {
    type: "equirectangular",
    panorama: objectURL,
    autoLoad: true,
  });

  viewer.on("load", () => {
    URL.revokeObjectURL(objectURL);
    dataElement?.remove();
  });
});
