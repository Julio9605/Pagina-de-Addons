WotLK Addons Hub — primera versión
==================================

Qué incluye
- Página responsive con estilo oscuro/minimalista.
- Buscador por nombre, descripción, categoría y palabras clave.
- Filtros de categoría y orden alfabético.
- Tarjetas destacadas y catálogo completo.
- Espacios visuales reservados para publicidad.
- Catálogo separado en data/addons.json, para facilitar futuras actualizaciones.

IMPORTANTE
Los addons incluidos en el JSON son ejemplos de catálogo. Las versiones/compatibilidad no han sido verificadas y no se incluyen archivos ZIP de addons. Antes de publicar, confirma que cada versión sea compatible con WoW 3.3.5a y añade únicamente enlaces/archivos que tengas derecho a distribuir.

Cómo probar
1. Extrae la carpeta.
2. Sube todo su contenido a un servidor web, conservando la estructura.
3. Abre index.html desde el dominio/servidor.
   No abras index.html directamente con file://, porque el navegador puede bloquear la lectura de data/addons.json.

Cómo agregar un addon
Edita data/addons.json y añade otro objeto dentro del array. Mantén comas entre objetos. Campos:
- id: identificador único sin espacios.
- nombre: nombre mostrado.
- categoria: categoría para el filtro.
- versionJuego: por ejemplo 3.3.5a.
- versionAddon: versión que verificaste.
- descripcion: explicación breve.
- palabrasClave: array de palabras para el buscador.
- imagen: ruta relativa a una imagen, por ejemplo images/mi-addon.jpg (puede quedar vacío).
- descarga: ruta relativa a un ZIP dentro del servidor o URL externa autorizada (puede quedar vacío).
- destacado: true o false.

Cuando descarga esté vacío, el botón aparecerá desactivado con el mensaje de que falta el enlace.

Publicidad
Los espacios son marcadores visuales; no generan ingresos por sí solos. Más adelante puedes insertar el código de una plataforma publicitaria aprobada o acuerdos directos, respetando sus políticas y las leyes aplicables.

Panel de administración
Esta versión no tiene backend ni login. El panel privado previsto para la siguiente etapa necesitará un backend (por ejemplo PHP con base de datos) y controles de seguridad. No pongas contraseñas ni credenciales en HTML o JavaScript.
