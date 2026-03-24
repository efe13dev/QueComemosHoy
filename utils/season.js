export function getSeason() {
  const month = new Date().getMonth();
  const day = new Date().getDate();

  // Hemisferio norte
  // Primavera: 20 marzo - 20 junio
  if (
    (month === 2 && day >= 20) ||
    month === 3 ||
    month === 4 ||
    (month === 5 && day < 20)
  ) {
    return "spring";
  }

  // Verano: 20 junio - 22 septiembre
  if (
    (month === 5 && day >= 20) ||
    month === 6 ||
    month === 7 ||
    (month === 8 && day < 22)
  ) {
    return "summer";
  }

  // Otoño: 22 septiembre - 21 diciembre
  if (
    (month === 8 && day >= 22) ||
    month === 9 ||
    month === 10 ||
    (month === 11 && day < 21)
  ) {
    return "autumn";
  }

  // Invierno: resto del año
  return "winter";
}
