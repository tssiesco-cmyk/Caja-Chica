# Continuar el desarrollo en casa

El proyecto usa Vite + React + TypeScript y Node.js + Express. Actualmente funciona con almacenamiento local; no necesitas SQL Server, SSMS ni Docker para iniciarlo.

## Instalar en tu computadora personal

1. Node.js 22 o posterior: https://nodejs.org/en/download
2. Git: https://git-scm.com/downloads
3. Un editor, por ejemplo Visual Studio Code: https://code.visualstudio.com/

Cerrar y volver a abrir la terminal después de instalar. Comprobar:

```powershell
node --version
npm --version
git --version
```

## Descargar tu código de GitHub

Abre una terminal en la carpeta donde quieras trabajar y ejecuta:

```powershell
git clone https://github.com/tssiesco-cmyk/Caja-Chica.git
cd Caja-Chica
npm ci
npm run dev
```

Abre la dirección Local que muestre Vite, normalmente http://127.0.0.1:5173. Si ese puerto está ocupado, mostrará otro. Mantén abierta la terminal. Para detener el sistema, pulsa Ctrl+C.

No hace falta crear un archivo .env para el modo local actual. El backend usa 127.0.0.1:3001. Los puertos y las rutas del disco son locales a cada computadora.

## Llevar los registros actuales de la computadora de trabajo

GitHub contiene el código, pero no los datos ni las evidencias. Para conservar los registros actuales, copia a un USB el ZIP privado que está en la carpeta `transferencia-local` de la computadora de trabajo. No publiques ese ZIP en GitHub.

En casa, antes de iniciar la aplicación:

1. Extrae el ZIP en una carpeta temporal. Contiene una carpeta `Caja-Chica` con código y respaldo de datos.
2. Entra a la carpeta del proyecto que clonaste desde GitHub.
3. Copia `backend/data` y `backend/uploads` desde el respaldo a la misma ubicación del proyecto clonado. Ambas carpetas van juntas.
4. Si ya tienes datos en casa, respáldalos primero. La copia del respaldo sustituye el archivo de datos; no fusiona cajas.
5. Ejecuta `npm run dev` y verifica tus cajas.

También puedes trabajar directamente desde la carpeta extraída ejecutando `npm ci` y `npm run dev`. Sin embargo, el ZIP no incluye la configuración interna de Git; para seguir guardando avances en el mismo repositorio, usa preferiblemente el proyecto clonado y copia allí los datos.

La aplicación genera datos de ejemplo si no encuentra `backend/data/demo.json`. Eso no significa que haya descargado los registros del trabajo. La copia del ZIP es un respaldo del momento en que se preparó; los registros que agregues después no se incorporan automáticamente.

## Revisar y guardar tus avances

Desde la carpeta clonada:

```powershell
npm run build
npm test
git status
git add .
git commit -m "Describe el cambio que realizaste"
git push
```

Si Git solicita identidad en la computadora nueva, puedes configurarla solo para este proyecto con tu nombre y correo:

```powershell
git config user.name "Tu nombre"
git config user.email "Tu correo asociado a GitHub"
```

Para subir cambios debes iniciar sesión con una cuenta que tenga permiso en `tssiesco-cmyk/Caja-Chica`. Git puede abrir el navegador para iniciar sesión. No escribas contraseñas ni tokens dentro del código ni en el chat.

Antes de trabajar en otra computadora, guarda y sube tus cambios. En la otra computadora, con el árbol de trabajo limpio, ejecuta `git pull --ff-only` antes de continuar. Los datos locales y adjuntos no se sincronizan con estos comandos.

## Qué incluye y qué falta

Incluye código, dependencias declaradas, archivo de bloqueo para `npm ci`, pruebas, logo, esquema SQL y ejemplo de variables de conexión. `node_modules` se descarga con `npm ci` y no se transporta en el ZIP. Necesitas Internet para la instalación inicial.

SQL Server está pendiente de integración: hay un esquema en `backend/sql/001_schema.sql` y una conexión preparada en `backend/src/sql.ts`, pero el almacenamiento actual sigue siendo local. No hace falta ejecutar ese script SQL para trabajar en casa.

La app todavía no tiene usuarios ni sincronización entre computadoras. Cada copia maneja su propio archivo de datos. El respaldo privado conserva la información existente sin subirla al repositorio.
