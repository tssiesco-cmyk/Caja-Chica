# Caja chica ACHE

Aplicación local con Vite + React + TypeScript y Node.js + Express. SQL Server queda preparado para una integración posterior.

## Ejecutar

Desde esta carpeta, con Node.js 22 o posterior:

```powershell
npm install
npm run dev
```

Abrir la dirección Local que muestre Vite. La API utiliza 127.0.0.1:3001; mantener ambos procesos abiertos. No iniciar únicamente frontend. Si no hay conexión, revisar los mensajes de la API en la terminal.

## Regla de negocio actual

Tipos disponibles al registrar: **Factura** y **Recibo de gastos**. La opción Boleta se retiró según el flujo interno solicitado; los datos antiguos se conservan. Al seleccionar recibo en una fila aparece **Crear recibo de gastos**: abre el formulario con los datos escritos y una vista previa del formato. Al crear el recibo se guarda también el gasto una sola vez y se abre su detalle para consultar el PDF y las evidencias.

Validación visible: fecha, concepto e importe son obligatorios; una factura necesita serie y número, y el formulario completo también pide lugar y “Recibí de”. Proyecto y evidencias son opcionales. Los campos inválidos se marcan y se listan las correcciones necesarias. Los avisos distinguen error (rojo), advertencia (ámbar), éxito (verde) e información (azul), con confirmaciones integradas al diseño.

Solo se registran gastos. Cada caja agrupa hasta S/ 400 en gastos; el backend rechaza ingresos y gastos que superen el saldo restante. El saldo anterior y la reposición de IESCO se muestran como referencias de cabecera, no como movimientos ni como confirmación de un depósito real.

Ejemplo: caja con S/ 380 gastados tiene S/ 20 restantes. Al crear la siguiente se trasladan S/ 20 y se muestra una reposición de referencia de S/ 380. La siguiente caja puede agrupar hasta S/ 400 en gastos sin tener que registrar ingresos.

Nueva caja asigna automáticamente el número consecutivo, cierra la anterior y crea la vista de Sustento de Caja. Un gasto que no cabe se puede pasar completo al formulario de la siguiente; debe revisarse y guardarse allí. No se divide el comprobante. Los datos del formulario sin guardar no sobreviven al cierre del navegador.

## Secciones

En Caja chica, usar **Agregar fila de gasto** o **Agregar otro importe** para ingresar fecha, concepto, proyecto, documento y egreso directamente en la tabla. Pulsar **Guardar** para persistir y descontar el importe del saldo. **Editar** permite corregir un gasto guardado; al guardar se recalculan las filas posteriores y los totales sin cambiar el número de recibo ni los adjuntos. **Gasto con evidencia** abre el formulario completo. Los gastos de cajas cerradas quedan bloqueados.

El saldo visible se calcula como S/ 400 menos los gastos guardados de la caja seleccionada. Los cambios en curso tienen un saldo previsto separado hasta guardarlos. Ejemplo de referencia: gastos S/ 40 + 19.90 + 25 + 130 + 12 + 40 + 20 + 20 + 60 = S/ 366.90; saldo final S/ 33.10. Ingreso corresponde a las referencias verdes de apertura; los gastos se registran en Egreso.

- Caja chica: hoja de rendición con logo IESCO del Excel de referencia, encabezado por caja, filas verdes de referencias, fecha, concepto, proyecto, factura/recibo, importe, saldo, totales y firmas. Permite buscar, registrar y ver gastos, y exportar a Excel.
- Sustento de caja: agrupación por caja, vista de recibos internos, PDF y evidencias.

Documentos admitidos: factura y recibo interno. Medios de pago: efectivo, transferencia, Yape y Plin. Los recibos se numeran por caja, por ejemplo ER-ACHE-043-01. Hasta ocho archivos JPG, PNG o PDF de 10 MB por gasto. El PDF del recibo incorpora imágenes como páginas adicionales; los PDF adjuntos se consultan aparte. Firmas manuales, sin firma digital.

## Datos y compatibilidad

Se conservan en `backend/data/demo.json` y `backend/uploads`. Respaldar ambas carpetas juntas. Los ingresos de versiones anteriores se conservan en el archivo histórico pero ya no se muestran ni afectan el límite de gastos. No se importa automáticamente el historial del Excel. No ejecutar dos instancias sobre el mismo archivo demo.

## Verificación

```powershell
npm run build
npm test
node backend/regression.mjs
```

La prueba de regresión usa datos temporales aislados: límite 400, arrastre 20, reposición informativa 380, numeración, evidencias, PDF y Excel.

## SQL Server y alcance

No está conectado aún. `backend/sql/001_schema.sql` prepara las tablas de una base nueva, y `backend/src/sql.ts` contiene el punto de conexión. Falta implementar el repositorio SQL con transacciones para saldo y correlativos. Configurar `.env` por sí solo no cambia el almacenamiento local.

Esta entrega es una versión local de evaluación sin usuarios ni permisos. Antes del uso compartido faltan integración SQL, autenticación, auditoría, respaldos y almacenamiento protegido. La exportación reproduce la estructura de rendición y sus cálculos, sin copiar medidas exactas de celdas del Excel original.
