import { supabase } from './supabase';

export const actualizarRecetaDelDia = async (dia, nuevaReceta) => {
  try {
    // Asegurarnos de que menu_data nunca sea null o cadena vacía
    // Usar un espacio en blanco si no hay receta
    const menu_data = nuevaReceta?.trim() ? nuevaReceta.trim() : ' ';
    const diaLowerCase = dia.toLowerCase();

    console.log(`Guardando en Supabase - Día: ${diaLowerCase}, Receta: "${menu_data}"`);

    const { data, error } = await supabase.from('weekly_menus').upsert({
      id: diaLowerCase,
      menu_data
    });

    if (error) {
      console.error('Error en upsert:', error);
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en actualizarRecetaDelDia:', error.message);
    return { data: null, error };
  }
};

export const obtenerMenuSemanal = async () => {
  try {
    // Primero verificamos si hay datos
    const { count, error: countError } = await supabase
      .from('weekly_menus')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Si no hay datos, inicializamos la tabla con valores por defecto
    if (count === 0) {
      const diasSemana = [
        'lunes',
        'martes',
        'miercoles',
        'jueves',
        'viernes',
        'sabado',
        'domingo'
      ];
      const defaultMenus = diasSemana.map((dia) => ({
        id: dia,
        menu_data: ' '
      }));

      const { error: insertError } = await supabase
        .from('weekly_menus')
        .insert(defaultMenus);

      if (insertError) throw insertError;
    }

    // Ahora obtenemos los datos
    const { data, error } = await supabase
      .from('weekly_menus')
      .select('*')
      .order('id');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en obtenerMenuSemanal:', error.message);
    return { data: null, error };
  }
};
