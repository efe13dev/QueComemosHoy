import { supabase } from './supabase';

export const actualizarRecetaDelDia = async (dia, nuevaReceta) => {
  try {
    // Asegurarnos de que menu_data nunca sea null o cadena vacía
    // Usar un espacio en blanco si no hay receta
    const menu_data = nuevaReceta?.trim() ? nuevaReceta.trim() : ' ';
    const diaLowerCase = dia.toLowerCase();

    console.log(`Guardando en Supabase - Día: ${diaLowerCase}, Receta: "${menu_data}"`);

    // Primero verificamos si existe el registro
    const { data: existingData, error: checkError } = await supabase
      .from('weekly_menus')
      .select('*')
      .eq('id', diaLowerCase)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 es "no se encontró ningún registro"
      console.error('Error al verificar si existe el registro:', checkError);
      throw checkError;
    }

    // Si no existe, hacemos un insert, de lo contrario un update
    let result;
    if (!existingData) {
      console.log(`No existe registro para ${diaLowerCase}, creando uno nuevo.`);
      result = await supabase.from('weekly_menus').insert({
        id: diaLowerCase,
        menu_data
      });
    } else {
      console.log(`Actualizando registro existente para ${diaLowerCase}.`);
      result = await supabase
        .from('weekly_menus')
        .update({ menu_data })
        .eq('id', diaLowerCase);
    }

    const { data, error } = result;

    if (error) {
      console.error('Error en operación de base de datos:', error);
      throw error;
    }
    
    console.log(`Operación exitosa para ${diaLowerCase}.`);
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
    const { data: existingData, count, error: countError } = await supabase
      .from('weekly_menus')
      .select('*', { count: 'exact' });

    if (countError) throw countError;

    // Si no hay datos, inicializamos la tabla con valores por defecto
    if (count === 0 || !existingData || existingData.length === 0) {
      console.log('No se encontraron datos de menú. Inicializando con valores por defecto.');
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
        .upsert(defaultMenus);

      if (insertError) {
        console.error('Error al insertar valores por defecto:', insertError);
        throw insertError;
      }
      console.log('Valores por defecto insertados correctamente.');
    } else {
      console.log(`Se encontraron ${count} registros de menú.`);
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

export const obtenerMenuSemanalSinInicializar = async () => {
  try {
    // Simplemente obtenemos los datos existentes sin inicializar
    const { data, error } = await supabase
      .from('weekly_menus')
      .select('*')
      .order('id');

    if (error) throw error;
    
    console.log(`Se obtuvieron ${data?.length || 0} registros de menú (sin inicializar).`);
    return { data, error: null };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en obtenerMenuSemanalSinInicializar:', error.message);
    return { data: null, error };
  }
};
