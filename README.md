# Que comemos hoy v3.1.1

![Version](https://img.shields.io/badge/version-3.1.1-orange)
![Expo](https://img.shields.io/badge/Expo-52-000?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.76.9-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)

Aplicación móvil para gestionar recetas y crear menús semanales con una estética neobrutalista, sincronizada con Supabase y pensada para uso diario.

## Descripción

Aplicación desarrollada con React-Native que te permite gestionar tus recetas favoritas y crear menús semanales.

Las recetas que se añaden se insertan en una base de datos PostgreSql de Supabase y se sincronizan en tiempo real.

Los menús semanales se guardan en el storage del dispositivo para que sigan disponibles aunque se salga de la aplicación.

## Capturas

### v 3.0 
<img src="./assets/vista_splash.png" width="200">
<img src="./assets/vista_menu_semanal.png" width="200">
<img src="./assets/vista_mis_recetas.png" width="200">
<img src="./assets/vista_detalle_receta.png" width="200">

## Tabla de contenidos

- **Características clave**
- **Stack técnico**
- **Requisitos previos**
- **Instalación y ejecución**
- **Variables de entorno**
- **Configuración de Supabase (tablas)**
- **Estructura del proyecto**
- **Comandos disponibles**
- **Builds con EAS**
- **Compartir recetas (cómo funciona)**

## Características clave

- Estilo neobrutalista con animaciones fluidas en el splash y UI.
- Gestión de recetas: crear, listar, actualizar y eliminar.
- Menú semanal sincronizado con Supabase y persistente en el dispositivo.
- Compartir recetas como imagen desde el detalle (expo-sharing + react-native-view-shot) con fallback a texto.
- Búsqueda/ordenación en “Mis recetas”.
- Tipografías: Sora (UI) y New Super Mario Font U (branding splash).

## Stack técnico

- React Native 0.76.9 + Expo 52.
- React Navigation (bottom-tabs, native-stack).
- Supabase JS (PostgreSQL) + AsyncStorage como storage de sesión.
- Expo Linear Gradient, Expo Font, React Native Animatable, React Native SVG.
- Expo Sharing y React Native View Shot para compartir capturas de recetas.

## Compartir recetas (cómo funciona)

- Se captura la vista de detalle de la receta con `captureRef()` de `react-native-view-shot` (PNG temporal con fondo blanco) y se comparte con `expo-sharing` si está disponible (`Sharing.isAvailableAsync()`).
- En caso de no estar disponible o si falla la captura/compartición de imagen, se usa `Share.share()` para enviar un texto formateado (nombre, tiempo, personas, ingredientes y pasos).
- Formato de imagen: `image/png` mediante `Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle })`.
- Plataforma: la disponibilidad varía según dispositivo/OS (no soportado en web). En simuladores/emuladores puede no estar disponible.
- Configuración: con Expo no requiere configuración nativa adicional.

## Requisitos previos

- Node.js LTS y npm.
- Cuenta y proyecto en Supabase.
- Expo CLI instalado globalmente (opcional pero recomendado).

## Instalación y ejecución

```bash
# 1) Instalar dependencias
npm install

# 2) Copiar/crear variables de entorno
cp .env.example .env   # (si existiera). En su defecto, edita .env y rellena tus claves

# 3) Iniciar el proyecto
npm run start           # abre el DevTools de Expo
# o directamente en Android
npm run android
```

## Variables de entorno

Archivo `.env` en la raíz del proyecto. Ejemplo:

```env
EXPO_PUBLIC_SUPABASE_URL=tu-url-de-supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
```

Estas variables se consumen desde `@env` mediante la configuración de Babel en `babel.config.js`:

```js
plugins: [["module:react-native-dotenv", { envName: "APP_ENV", moduleName: "@env", path: ".env" }]]
```

## Configuración de Supabase (tablas)

- Tabla `recipes`
  - Campos recomendados: `id` (uuid), `name` (text), `category` (text), `time` (int), `image` (text/url), `people` (int), `ingredients` (text[] o json), `preparation` (text[] o text).
  - Usos en código: ver `data/api.js` (`getRecipes`, `saveRecipe`, `updateRecipe`, `deleteRecipe`).

- Tabla `weekly_menus`
  - Campos: `id` (text; usa el día: lunes, martes, ...), `menu_data` (text).
  - Usos en código: ver `data/api.js` (`obtenerMenuSemanal`, `actualizarRecetaDelDia`).

## Estructura del proyecto (resumen)

```text
.
├─ assets/
│  ├─ fonts/
│  └─ *.png
├─ components/
│  ├─ ui/ (inputs, botones, dropdowns)
│  └─ svg/
├─ data/
│  └─ api.js            # llamadas a Supabase
├─ screens/
│  ├─ HomeScreen.jsx
│  ├─ MyRecipesScreen.jsx
│  ├─ DetailRecipeScreen.jsx
│  └─ AddRecipeScreen.jsx
├─ utils/
│  ├─ supabase.js       # cliente configurado con @env + AsyncStorage
│  └─ theme.js          # paleta y helpers de estilo
├─ App.js               # carga de fuentes y entrada Expo
└─ Navigation.js        # navegación (tabs + stacks) y Splash
```

## Comandos disponibles

```bash
npm run start      # iniciar Expo
npm run android    # abrir en Android
npm run web        # abrir en web
npm run lint       # revisar lint
npm run lint:fix   # arreglar lint automáticamente
```

## Builds con EAS

Perfiles definidos en `eas.json`:

- `preview` (Android APK): `eas build -p android --profile preview`
- `preview2` (Gradle release): `eas build -p android --profile preview2`
- `preview3` (Development Client): `eas build -p android --profile preview3`
- `preview4` (Internal distribution): `eas build -p android --profile preview4`
- `production`: `eas build -p android --profile production`

## Novedades

### v 3.0

- [x] Cambio de estilo a neobrutalista
- [x] Añadida posibilidad de compartir recetas
