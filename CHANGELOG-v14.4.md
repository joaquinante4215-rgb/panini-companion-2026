# v14.4 — Saneamiento técnico

Cambios principales:

- Corregidos los botones manuales de la sección Especiales.
- Firebase conserva `id` y `label` de especiales para evitar que se rompan FWC/CC/PAN00 después de recargar nube.
- Respaldo Exportar ahora genera respaldo familiar completo.
- Importar acepta respaldo familiar y respaldo antiguo de perfil único.
- Los perfiles nuevos y existentes reciben metadatos `createdAt`, `firstUsedAt`, `installedAt` y `lastUsedAt` para logros de constancia.
- Guardar nube ya no borra automáticamente perfiles válidos que existan en otro dispositivo; solo elimina el perfil fantasma histórico Mich y Omar.
- `undoStack` queda local, más compacto y limitado a 5 movimientos.
- Se eliminaron assets duplicados de `public/achievements`; las imágenes de logros se cargan desde `src/assets/achievements`.
- Se fijaron versiones de dependencias en `package.json` para evitar cambios inesperados por `latest`.
- `README.md` actualizado a v14.4 y costo de sobre de $25 MXN.

Prueba realizada:

- `npm install --no-audit --no-fund`
- `npm run build` exitoso.

Advertencias esperadas:

- Vite muestra avisos de `use client` de Framer Motion y tamaño de bundle. No bloquean la compilación.
