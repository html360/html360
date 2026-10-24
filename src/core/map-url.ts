export const mapUrlTemplate = {
  nakarte: "https://nakarte.me/#m=13/{{lat}}/{{lng}}&r={{lat}}/{{lng}}/",
  yandex: "https://yandex.ru/maps/?ll={{lng}}%2C{{lat}}&pt={{lng}}%2C{{lat}}&z=13",
  google: "https://www.google.com/maps?q={{lat}}%2C{{lng}}&ll={{lat}}%2C{{lng}}&z=13",
}

export const buildMapUrl = (template: string, lat: number, lng: number) => {
  return template
    .replace(/{{lat}}/g, lat.toString())
    .replace(/{{lng}}/g, lng.toString());
}