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


## Cambios v9.0 - Multiusuario familiar local

- Perfiles familiares independientes.
- Migración automática del álbum actual al perfil inicial "Joaquín".
- Selector de perfiles.
- Crear nuevo perfil con nombre, emoji y color.
- Ranking familiar.
- Vista de intercambios internos:
  - quién tiene repetida
  - quién la necesita
- La sincronización en nube multiusuario queda preparada para v9.2.


## Cambios v9.1 - Motor familiar real

- Captura y Familia quedan en pantallas independientes.
- El selector de perfiles, ranking y comparador viven dentro de la pestaña Familia.
- Migración reforzada:
  - si hay avance local previo, se intenta convertir automáticamente al perfil Valentina.
  - si existía Joaquín, se renombra a Valentina.
- Comparador familiar mejorado:
  - resumen por perfil
  - faltantes
  - repetidas disponibles
  - intercambios ideales por par de perfiles
  - sugerencias más claras


## Fix v9.1.3
- Se corrigió el render de la pestaña Familia.
- Ahora la pestaña Familia muestra ProfileBar, Ranking familiar y FamilyDashboard.


## Cambios v9.2 - Herramientas familiares

- Opción para eliminar perfiles desde Familia coleccionista.
- No permite eliminar el último perfil.
- Listado para WhatsApp / imprimir por perfil:
  - faltantes
  - repetidas disponibles
- Botones:
  - Copiar
  - WhatsApp
  - Imprimir


## Cambios v9.3 - Familia limpia

- Se retiró la sección visual de Intercambios familiares para reducir saturación.
- Eliminar perfil ahora aparece como icono sutil 🗑️ en cada perfil.
- El perfil activo aparece dentro del recuadro de Avance total.
- El listado para WhatsApp / imprimir ahora agrupa faltantes y repetidas por Grupo A, Grupo B, etc., y Especiales.


## Cambios v9.4 - PIN y limpieza visual

- Perfil activo reducido a badge sutil.
- Cambio de perfil protegido con PIN.
- Cada perfil puede tener PIN independiente.
- PIN default: 2026.
- Creación de perfiles ahora pide PIN.


## Fix v9.4.1

- Los perfiles nuevos ahora siempre arrancan con álbum vacío.
- Avance inicial del nuevo perfil: 0%.
- No copian avance, repetidas, especiales ni extras del perfil activo.


## Cambios v9.4.2 - Tipo de coleccionista

- Se elimina la opción de color al crear perfiles.
- Se reemplaza por la pregunta: “¿Quién colecciona?”
  - 👧 Coleccionista niña
  - 👦 Coleccionista niño
- La respuesta se guarda como `avatarType`.
- El color visual se asigna automáticamente:
  - niña → rosa
  - niño → azul
- Esto prepara la app para asignar avatares automáticos en el siguiente sprint.


## Fix v9.4.4

- Se eliminó el badge repetido del perfil activo debajo del recuadro de avance.
- En Familia Coleccionista ya no se muestra “niña/niño”; solo nombre y avance.


## v10.1 - Cloud Sync seguro

- Se restaura la arquitectura completa de v9.4.
- Se mantiene Exportar / Importar.
- La nube ya NO se siembra vacía automáticamente.
- Si Firestore está vacío, la app muestra "nube vacía" y espera a que importes/valides el avance real.
- El botón "Guardar nube" sube manualmente el avance actual como fuente oficial.
- Listener en tiempo real para que otros dispositivos reciban cambios.


## v11.2 safe - Custom Collector

- Valentina conserva Goleadora Estrella.
- Nuevos coleccionistas crean personaje personalizado:
  - avatar emoji
  - nombre del personaje
  - frase
- Sin tocar Firebase.
- Corrección construida desde la versión estable para evitar errores de parseo.


## v11.3 - Fix creación de coleccionista

- Se elimina el campo “Nombre del personaje”.
- El nombre del perfil también define el personaje.
- La app propone automáticamente una frase futbolera mundialista según el nombre.
- Nombre del perfil y PIN quedan dentro de “Crea tu personaje”.
- El PIN ya no aparece por default y se captura como password.
- Se corrige la pantalla negra al crear nuevo coleccionista.


## v11.3.1 - JSX fix

- Corrige el botón Crear que causaba error de parseo.
- Mantiene las mejoras de creación de coleccionista.


## v11.3.2 - Runtime fix

- Corrige pantalla negra al presionar Crear.
- Elimina referencias antiguas a `emoji` y `avatarType`.
- Nuevo coleccionista se crea con álbum en 0%.
- Mantiene nombre, PIN, avatar emoji y frase sugerida.


## v11.4 - Selección de personaje

- Nuevo coleccionista pide:
  - Nombre del coleccionista
  - Selección de personaje en lista desplegable
  - PIN
  - Frase mundialista
- Se elimina el campo de imagen/avatar emoji.
- La selección de personaje guarda tipo/género para futuros avatares.


## v11.4.1 - Div fix

- Corrige el bloque JSX de creación de coleccionista.
- Elimina etiqueta `div` extra antes del botón Crear.


## v12.0 - Family Premium Cards

- Familia Coleccionista ahora usa tarjetas visuales premium.
- Cada tarjeta muestra avatar, nombre, personaje, avance, barra de progreso, estampas obtenidas e insignia activa.
- Se agregan temas visuales por personaje.
- No se modifica Firebase, ranking, listados, importar/exportar ni nube.


## v12.3 - Avatar assets reales

- Se cambia la estrategia de avatares: ahora son imágenes reales en `src/assets/avatars/`.
- La app carga el avatar según el tipo de personaje.
- Se incluye primer set de avatares recortados del mockup aprobado para validar la arquitectura.
- Siguientes pasos: sustituir estos assets por ilustraciones finales individuales.
- No se toca Firebase, nube, import/export, ranking ni listados.


## v12.4 - Pair avatar fix

- Corrige avatares de pareja:
  - Los Galácticos = hombre-hombre
  - La Dupla del Gol = hombre-mujer
  - Las Dueñas de la Cancha = mujer-mujer
- Se reemplazan los assets duplicados que causaban que todas las parejas se vieran como dos hombres.
- No se modifica Firebase, nube, ranking, listados ni lógica de avance.


## v12.5 - Pair assets final

- Corrige definitivamente los assets de pareja:
  - La Dupla del Gol: hombre-mujer, en el mismo contexto, interactuando.
  - Las Dueñas de la Cancha: mujer-mujer, en el mismo contexto, interactuando.
- Ya no se usan copias superpuestas de personajes individuales.
- No se modifica Firebase, nube, avance, ranking, listados ni import/export.
