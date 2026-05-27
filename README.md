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


## Cambios v5 - Firebase Edition

Esta versión agrega sincronización con Firestore.

### Firestore
Usa el documento:

```text
albums/principal
```

### Notas
- Sigue guardando respaldo local en `localStorage`.
- Guarda automáticamente en Firebase.
- El botón "Guardar nube" fuerza sincronización manual.
- Esta versión usa un álbum único compartido. Después se puede agregar login y múltiples álbumes.


## Cambios v6 - Especiales reales

Las 34 estampas especiales ahora se controlan individualmente:

- Panini 00: 1 estampa (`PAN00`)
- FWC / FIFA World Cup: 19 estampas (`FWC1` a `FWC19`)
- Coca Cola: 14 estampas (`CC1` a `CC14`)

Las especiales:
- suman al total de 994 estampas,
- tienen % de avance,
- tienen repetidas,
- pueden marcarse como cambiadas,
- se pueden capturar desde captura express.


## Cambios v7 - UX después de pruebas reales

- Se eliminó la captura manual por dropdown.
- Sobres abiertos automáticos: 1 sobre por cada 7 estampas capturadas.
- Últimos movimientos ocultos con botón para mostrar/ocultar.
- Opción para quitar capturas erróneas en normales y especiales.
- Sección de hasta 10 Extra Stickers:
  - Nombre del jugador
  - Color: morado, bronce, plata u oro
- Los Extra Stickers no cuentan para el total de 994 ni para el % de avance.


## Cambios v7.1

- Corrección visual del botón de borrar en tarjetas de estampas.
- Los botones de cada estampa ahora se acomodan en grid de 4 columnas.
- El botón de borrar ya no se desborda y queda seleccionable.


## Cambios v8 - Estadísticas inteligentes + PWA

### Estadísticas inteligentes
- Numeralia más clara.
- Recomendación de estrategia: sobres, mixto o intercambio.
- Probabilidad de próxima nueva.
- Estampas útiles esperadas por sobre.
- Tasa de repetición.
- Costo estimado restante con supuesto de $21 MXN por sobre.
- Ranking de selecciones más avanzadas y más atrasadas.

### PWA básica
- Manifest para instalar como app.
- Icono básico.
- Service Worker para cache básico.
- En iPad/celular se puede agregar a pantalla de inicio.
