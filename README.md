# Que comemos hoy v2.0

## Descripción

Esta aplicación te permite gestionar tus recetas favoritas y crear menús semanales.

Las recetas que se añaden se insertan en una base de datos PostgreSql de Supabase y se sincronizan en tiempo real.

Los menús semanales se guardan en el storage del dispositivo para que sigan disponibles aunque se salga de la aplicación.

## Cómo usar la aplicación

Para usar la aplicacion se genera una apk desde expo, se instala en el dispositivo movil y se ejecuta.

<img src="./assets/Vista_mis_recetas.jpg" width="200"><img src="./assets/Vista_detalle_receta.jpg" width="200"><img src="./assets/Vista_añadir_receta.jpg" width="200">

## Novedades

### v 2.0

- [x] Añadida opción de actualizar receta (hay que crear un input por cada ingrediente y por cada paso)
- [x] Modificada la imagen inicial
- [x] Añadir un input para buscar receta en Mis recetas
- [x] Mejorada la interfaz de formulario de agregar receta
- [x] En la vista Mis recetas se muestran las recetas ordenadas por nombre
- [x] Añadida confirmación para eliminar menú semanal
- [x] En el listado de mis recetas ahora se muestran dos columnas
- [x] Mejoras visuales en todas las vistas
- [ ] Gestionar los de la autorización en supabase
