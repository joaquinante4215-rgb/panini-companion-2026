# Panini Companion 2026

## Cómo correr la app en tu computadora

1. Instala Node.js.
2. Abre esta carpeta en VS Code o en Terminal.
3. Ejecuta:

```bash
npm install
npm run dev
```

4. Abre la dirección que aparezca, normalmente:
http://localhost:5173

## Cómo subir a Vercel

1. Sube esta carpeta a GitHub.
2. Entra a Vercel.
3. Crea un nuevo proyecto desde ese repositorio.
4. Vercel detectará Vite automáticamente.
5. Da clic en Deploy.

## Notas

- La app guarda el avance en el navegador usando localStorage.
- Si la abres en otro celular o iPad, todavía no sincroniza automáticamente.
- La siguiente fase recomendada es Firebase para sincronizar entre dispositivos.


## Cambios v2

- Se quitó el botón Reiniciar para evitar borrados accidentales.
- Se agregó botón Deshacer para revertir la última captura o movimiento.
- El historial de deshacer guarda hasta 10 movimientos.


## Cambios v3 - UX de captura

- Captura continua con Enter.
- Feedback visual para nueva, repetida y error.
- Limpieza automática del campo después de capturar.
- Sugerencia simple para códigos de 2 letras.
- Botones rápidos de países frecuentes.
- Botones y campo más cómodos para iPad/celular.


## Cambios v4 - Respaldo

- Botón Exportar: descarga un archivo `.json` con todo el avance.
- Botón Importar: restaura un respaldo `.json`.
- Mantiene captura express, deshacer y guardado automático local.
- Recomendación: exportar respaldo después de cada sesión importante de captura.
