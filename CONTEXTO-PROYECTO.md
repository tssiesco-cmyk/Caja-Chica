# Contexto para continuar: Caja chica ACHE

Resumen de las decisiones y del estado del proyecto al 30 de octubre de 2026. Este archivo sirve para continuar en otro chat o computadora; no es una transcripción completa del chat. Las instrucciones nuevas del usuario tienen prioridad sobre este resumen.

## Mensaje para pegar en un chat nuevo

> Estoy continuando el sistema Caja Chica ACHE de IESCO. Lee CONTEXTO-PROYECTO.md, README.md y CONTINUAR-EN-CASA.md, e inspecciona el código actual antes de cambiarlo. Usa este documento para conocer las decisiones ya acordadas. El sistema registra solo gastos, con un máximo de S/ 400 por caja, y tiene secciones separadas de Caja chica y Sustento de caja. Actualmente usa archivos locales; SQL Server todavía no está integrado. Conserva mis registros y evidencias. Después te indicaré el siguiente cambio.

## Ubicación y repositorio

- Repositorio del usuario: https://github.com/tssiesco-cmyk/Caja-Chica
- Rama usada: `main`.
- Carpeta activa en la computadora de trabajo: `C:\Users\IESCO TSS 2\Documents\Trabajo\Caja Chica`.
- En casa, la ruta puede ser otra. Trabajar en la carpeta que el usuario abra, sin asumir que existen las rutas del equipo del trabajo.
- Durante el desarrollo se usó también `Documents\ChatGPT\Caja Chica` como carpeta auxiliar. El proyecto que el usuario ejecuta y subió a GitHub es el de `Documents\Trabajo\Caja Chica`.
- La URL local utilizada en el trabajo fue http://127.0.0.1:5174 porque 5173 estaba ocupado. Usar siempre el puerto que indique Vite en cada computadora.

## Objetivo

Software para administrar rendiciones de caja chica y sus sustentos. El usuario trabaja con Vite, React y Node.js. Proporcionó el Excel `BALANCE CAJA CHICA ACHE.xlsx` y capturas como referencias visuales y de negocio.

El usuario corrigió varias interpretaciones durante el chat: quiere una aplicación con una tabla editable inspirada en ese formato, no una imagen estática de una hoja ni un sistema general de ingresos y egresos.

Los archivos originales del Excel y las capturas estaban en Descargas e Imágenes del equipo de trabajo. No se copiaron íntegramente a GitHub. El logo de IESCO que se utiliza en la aplicación se extrajo del Excel y sí está en `frontend/public/iesco.png`.

## Reglas definitivas acordadas

### Cajas y saldo

- Solo se registran gastos.
- Cada caja agrupa gastos hasta un máximo de **S/ 400.00**.
- El saldo de una caja se calcula como `400 - suma de sus gastos guardados`.
- Los importes se almacenan en céntimos enteros; S/ 400 equivale a `40000`.
- Cada caja conserva sus propios registros. No mezclar gastos entre cajas.
- Al crear la siguiente caja, se cierra la anterior, se traslada el saldo sobrante y se calcula la reposición de referencia para Finanzas.
- Ejemplo: gastos de S/ 380, saldo de S/ 20; la siguiente muestra S/ 20 de saldo anterior y S/ 380 como reposición de referencia. Su capacidad total de gastos es S/ 400.
- No exigir registrar un ingreso ni confirmar un depósito para poder guardar gastos. Esa fue una interpretación anterior que el usuario corrigió.
- La columna **Ingreso** sigue en la tabla por el formato proporcionado, pero se usa para las referencias verdes de apertura: depósito/reposición y saldo anterior. No es un formulario de ingresos.
- Nueva caja debe asignar automáticamente el número siguiente: 043 → 044, etc.
- Si un gasto excede el saldo restante, advertir y permitir pasarlo completo al formulario de la caja siguiente. No dividir un mismo comprobante entre cajas ni registrar el gasto sin que el usuario lo guarde.
- Un gasto individual de más de S/ 400 se rechaza con la regla actual.
- Las cajas cerradas permiten consulta y exportación; sus gastos quedan bloqueados para edición.

### Documentos

- Opciones activas: **Factura** y **Recibo de gastos**.
- Se retiró **Boleta** porque el usuario la maneja dentro del flujo interno de Recibo de gastos. No volver a agregarla como opción independiente sin una nueva indicación.
- Los tipos históricos pueden seguir apareciendo en el modelo de datos para conservar registros viejos. La API ya no acepta crear documentos de tipo boleta.
- Al elegir Recibo de gastos en una fila, debe aparecer directamente **Crear recibo de gastos**.
- Ese botón abre el formulario completo con los datos ya escritos y una vista previa.
- Crear el recibo guarda también el gasto una sola vez. No duplicarlo al volver a la tabla.
- Numeración independiente por caja: `ER-ACHE-042-01`, `ER-ACHE-042-02`; la caja siguiente comienza en `ER-ACHE-043-01`.
- La vista previa muestra el número previsto; el servidor asigna el definitivo al guardar.

### Evidencias y pagos

- Se pueden adjuntar imágenes y PDF a los gastos.
- Medios de pago: efectivo, transferencia, Yape y Plin. Medio de pago y tipo de documento son campos distintos.
- Límite actual: ocho evidencias por gasto, de hasta 10 MB cada una.
- Formatos admitidos: JPG, PNG y PDF; el servidor revisa también la firma básica del archivo.
- Las imágenes se incorporan como páginas adicionales al PDF del recibo. Los PDF adjuntos se abren desde el detalle; actualmente no se fusionan al recibo.
- Si falla una carga después de guardar el gasto, el gasto permanece guardado y se puede reintentar el adjunto desde su detalle. No registrar otro gasto por ese motivo.

## Interfaz que se debe conservar

### Caja chica

Tabla editable dentro del software con columnas de fecha, concepto, proyecto, factura/recibo, ingreso, egreso, saldo final y acciones.

- **Agregar fila de gasto** y **Agregar otro importe** permiten capturar una nueva fila.
- **Editar** permite corregir un gasto existente, conservando su identificador, correlativo y evidencias.
- Los cambios de importe recalculan los saldos de las filas siguientes y los totales.
- Antes de guardar se muestra un saldo previsto, claramente diferenciado del saldo guardado.
- **Gasto con evidencia** abre el formulario completo.
- En cabecera se muestran fondo de S/ 400, gastos guardados y saldo disponible.
- El diseño conserva logo, título `CAJA ACHE NNN`, filas verdes de apertura, totales, diferencia/saldo restante y espacios de firma.
- Exportación XLSX con Ingreso, Egreso y Saldo final. La exportación es una función adicional; la pantalla principal debe seguir siendo editable.

Ejemplo de comprobación de la imagen definitiva: gastos de 40 + 19.90 + 25 + 130 + 12 + 40 + 20 + 20 + 60 = **S/ 366.90**; saldo final **S/ 33.10**. Después del primer gasto debe mostrar S/ 360 y después del segundo S/ 340.10.

### Sustento de caja

- Sección separada con una agrupación llamada `Sustento Caja NNN` por cada caja chica creada.
- La agrupación existe aunque no tenga recibos. Actualmente se deriva de las cajas en la aplicación; no es una carpeta de Windows por cada caja.
- Guarda la relación entre los recibos de esa caja y sus evidencias.
- Permite consultar los recibos y abrir sus PDF.

### Formato del recibo

Seguir la captura más reciente del usuario: marco exterior, logo IESCO arriba a la izquierda, número de recibo arriba a la derecha, título centrado, total, lugar, fecha, “Recibí de”, cantidad, concepto en un recuadro, proyecto y nombre/espacio de firma del responsable.

El PDF actual usa A4 horizontal y reproduce esa estructura. No se copió la firma de la captura ni se implementó firma digital. Se deja espacio para la firma manual.

### Validaciones y avisos

- Evitar que Guardar falle sin explicar el motivo.
- Mostrar un aviso con los campos que faltan y señalar visualmente los campos inválidos.
- Obligatorios: fecha válida, concepto de al menos tres caracteres e importe positivo dentro del límite. Factura requiere serie y número. El formulario completo también exige lugar y “Recibí de”.
- **Proyecto y evidencias son opcionales**. No impedir guardar porque estén vacíos.
- Avisos diseñados por tipo: error rojo, advertencia ámbar, éxito verde e información azul.
- Las confirmaciones para cerrar una caja o descartar una fila están integradas al diseño, en lugar de `window.confirm`.
- Al cancelar un formulario se limpian sus errores. No presentar una validación de campos como si fuera un fallo de conexión.

## Arquitectura y archivos clave

Monorepo con npm workspaces:

```text
frontend/  Vite + React + TypeScript
backend/   Node.js + Express + TypeScript
```

| Archivo | Responsabilidad |
| --- | --- |
| `frontend/src/main.tsx` | Estado general, secciones, formulario completo, adjuntos y llamadas a API |
| `frontend/src/ExpenseTable.tsx` | Tabla activa con captura y edición de gastos |
| `frontend/src/ReceiptPreview.tsx` | Vista previa del recibo |
| `frontend/src/Feedback.tsx` | Avisos por tipo y confirmaciones |
| `frontend/src/validation.ts` | Validación visible de formularios |
| `frontend/src/style.css` | Estilos y adaptación a pantallas pequeñas |
| `frontend/vite.config.ts` | Proxy de `/api` al backend y aviso de backend no disponible |
| `backend/src/server.ts` | API, persistencia local, evidencias y exportación Excel |
| `backend/src/domain.ts` | Regla de saldo, máximo y numeración |
| `backend/src/receiptPdf.ts` | Generación visual del recibo PDF |
| `backend/src/sql.ts` | Punto de conexión preparado para SQL Server, aún sin uso |
| `backend/sql/001_schema.sql` | Esquema inicial para una base SQL Server nueva |
| `backend/regression.mjs` | Prueba de integración con datos temporales aislados |

`frontend/src/CashSheet.tsx` es una vista anterior que permanece en el código. La tabla activa se importa desde `ExpenseTable.tsx`; comprobar los imports antes de editar una vista.

## Almacenamiento y SQL Server

- **No está conectado a una base SQL todavía.**
- Datos actuales: `backend/data/demo.json`.
- Evidencias: `backend/uploads/`.
- Respaldar y transportar ambas carpetas juntas.
- No usar PostgreSQL: el usuario eligió **Microsoft SQL Server**, administrado mediante **SQL Server Management Studio**.
- SSMS es el administrador, no el motor de base de datos. Esa integración se hará más adelante.
- Ya se incluyó el paquete `mssql`, un esquema SQL y `.env.example`. Configurar variables por sí solo no cambia el repositorio JSON por SQL.
- La conexión preparada usa autenticación SQL. Autenticación integrada de Windows requerirá configuración adicional si se elige después.
- Al integrar SQL se necesitarán transacciones, bloqueo de la caja, asignación de correlativo sin carreras y validación del total de gastos hasta S/ 400.
- El modo JSON es local y no debe ejecutarse desde dos instancias del backend sobre el mismo archivo.

## Ejecutar y verificar

Node.js 22 o posterior. Desde la raíz del proyecto:

```powershell
npm ci
npm run dev
```

La API escucha en `127.0.0.1:3001`. Usar la URL Local que muestre Vite. Iniciar ambos procesos desde la raíz, no únicamente frontend. SQL Server y Docker no son necesarios para la versión actual.

Comprobaciones disponibles:

```powershell
npm run build
npm test
node backend/regression.mjs
```

Al preparar este contexto habían pasado compilación, pruebas de dominio y validación, y la regresión de creación/edición, límite, numeración, arrastre, adjuntos, PDF y Excel. También se revisaron en pantalla los avisos por campos vacíos, el acceso directo al recibo y la vista previa. Se renderizó y revisó la primera página del nuevo PDF.

No probar registrando gastos ficticios dentro de los datos reales del usuario. La regresión usa su propio directorio temporal.

## Llevar el proyecto a casa

- Las instrucciones de instalación están en `CONTINUAR-EN-CASA.md`.
- GitHub transporta el código; **no** transporta automáticamente los datos de cajas, evidencias ni este chat.
- El respaldo local preparado está en `transferencia-local/Caja-Chica-para-casa-2026-10-30.zip`, dentro de la carpeta del proyecto en el equipo de trabajo.
- El ZIP es una copia del momento en que se creó. No incluye automáticamente los cambios ni registros posteriores. Este contexto también se puede descargar por separado o desde GitHub.
- Ese ZIP privado no se sube a Git. La carpeta `transferencia-local/` está ignorada.
- En casa, clonar el repositorio e instalar con `npm ci`; para recuperar los registros del respaldo, copiar `backend/data` y `backend/uploads` con la aplicación detenida.
- Si ya hay registros en el destino, respaldarlos antes: copiar el archivo no fusiona las cajas.
- La carpeta clonada queda conectada al repositorio. La carpeta extraída del ZIP no incluye `.git`.
- Los futuros cambios de código se sincronizan con commit/push y pull; los datos JSON no se sincronizan entre equipos.

## Pendientes reales

1. Integrar SQL Server cuando esté disponible, con migración de los datos locales si se requiere.
2. Incorporar usuarios, permisos y auditoría antes de uso compartido.
3. Preparar respaldos automatizados y almacenamiento protegido de evidencias.
4. Mejorar mantenimiento/organización del código, que contiene archivos con formato compacto y alguna vista antigua sin uso.
5. Revisar dependencias antes de uso productivo: en la instalación inicial se reportaron avisos moderados relacionados con ExcelJS/uuid. No asumir que ya están resueltos sin verificar el archivo de bloqueo actual.

No se ha desplegado un servicio en Internet. Subir el repositorio a GitHub no publica la aplicación ni su base de datos. La versión actual es para desarrollo y evaluación local.
