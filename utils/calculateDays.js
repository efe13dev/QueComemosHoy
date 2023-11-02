export function getDayOfWeek (index) {
  const daysOfWeek = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo'
  ];

  if (index >= 0 && index < daysOfWeek.length) {
    return daysOfWeek[index];
  }

  return '';
}

export function numberWeekDay () {
  const date = new Date();
  const dayNumber = date.getDay();
  return dayNumber - 1;
}
