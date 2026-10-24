import exifr from "exifr";

export const getGps = async (filePath: string) => {
  const gps = await exifr.gps(filePath);

  if (gps?.latitude == null || gps?.latitude == 0 ||
    gps?.longitude == null || gps?.longitude == 0) {
    return null;
  }

  return {
    lat: gps.latitude,
    lng: gps.longitude,
  };
}
