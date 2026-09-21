/* =====================================================================
   PORTAFOLIO ACADÉMICO — FUENTE DE DATOS (ACADEMIC SYSTEM)
   =====================================================================

   Este archivo es la ÚNICA fuente de verdad del portafolio.
   Todas las páginas (cursos.html, cursos/*.html, visualizar.html)
   leen de aquí para construir la interfaz y calcular el progreso
   automáticamente. No hace falta tocar ningún HTML para:

     - Agregar una evidencia nueva a una semana que ya existe.
     - Agregar una actividad nueva.
     - Agregar una semana o unidad nueva a un curso existente.

   CÓMO AGREGAR UNA EVIDENCIA NUEVA (lo más común):
   --------------------------------------------------------------------
   1. Sube el archivo real a la carpeta correspondiente dentro de
      trabajos/<curso>/unidad-X/semana-Y/
   2. Busca la semana/actividad correspondiente aquí abajo.
   3. Si la evidencia ya existe como "pendiente" (pendiente: true,
      archivo: null), solo complétala:

        { id:"bd2-uI-s02-a1-e1", nombre:"Manual de instalación",
          descripcion:"Instalación y configuración de MS SQL Server",
          archivo:"trabajos/base-datos-ii/unidad-1/semana-2/NOMBRE-DEL-ARCHIVO.pdf",
          tipo:"pdf", pendiente:false }

      El progreso de la semana/curso se recalcula solo.

   4. Si es una evidencia totalmente nueva (no estaba planificada),
      agrégala al array "evidencias" de la actividad correspondiente,
      con un id nuevo y único (sigue el patrón curso-uUNIDAD-sSEMANA-aACTIVIDAD-eN).

   CÓMO AGREGAR UNA SEMANA O ACTIVIDAD NUEVA:
   --------------------------------------------------------------------
   Copia la forma de un objeto "semana" o "actividad" ya existente y
   ajusta número, título y evidencias. No es necesario tocar HTML/CSS/JS.

   CICLO ACADÉMICO:
   --------------------------------------------------------------------
   Cada curso tiene un campo "ciclo" (ej. "V"). Un ciclo dura 16 semanas
   sin importar cuántos cursos tenga matriculados ese ciclo — por eso el
   sistema NO suma las semanas de todos los cursos, sino que las agrupa
   por ciclo. Cuando matricules un curso de un ciclo nuevo (ej. "VI"),
   solo agrega "ciclo": "VI" a ese curso y actualiza "cicloActual" en
   meta; el sistema lo agrupará y sumará automáticamente por separado.

   IMÁGENES: CAMPO "preview" (opcional, solo para evidencias tipo imagen)
   --------------------------------------------------------------------
   Si subes una infografía muy pesada, puedes generar una copia liviana
   (ej. JPG a 1300px de alto) y ponerla en "preview". El visor mostrará
   esa versión liviana en pantalla, pero el botón "Descargar" siempre
   entrega el archivo original de "archivo" tal cual lo subiste. Si no
   defines "preview", el visor simplemente usa "archivo" directamente
   (más simple, aunque algo más lento de cargar si el archivo pesa mucho).

   Para no confundir el original con su copia liviana al abrir la carpeta,
   guarda las copias "preview" dentro de una subcarpeta "_preview" junto
   al original, no al lado directo:

       trabajos/base-datos-ii/unidad-1/semana-1/
           bd2-s01-a01-infografia-01.png            <- original (Descargar)
           _preview/
               bd2-s01-a01-infografia-01-preview.jpg <- copia liviana (Ver)

   VARIOS ARCHIVOS EN UNA MISMA ACTIVIDAD (ej. código + PDF explicativo):
   --------------------------------------------------------------------
   No hay límite de evidencias por actividad. Para Algoritmos, si quieres
   subir el código de un ejercicio JUNTO con un PDF que lo explica, agrega
   DOS evidencias dentro de la misma actividad (una semana de Algoritmos
   empieza con "actividades": [], reemplázalo por esto):

   "actividades": [
     {
       "titulo": "Actividad 01",
       "descripcion": "Implementación con arreglos bidimensionales",
       "evidencias": [
         { "id":"alg-uI-s01-a1-e1", "nombre":"Código fuente",
           "descripcion":"Carpeta con las clases del ejercicio (comprimida en .zip)",
           "archivo":"trabajos/algoritmos/unidad-1/semana-1/codigo-arreglos.zip",
           "tipo":"otro", "pendiente":false },
         { "id":"alg-uI-s01-a1-e2", "nombre":"Informe explicativo",
           "descripcion":"PDF explicando la lógica del código",
           "archivo":"trabajos/algoritmos/unidad-1/semana-1/explicacion-codigo.pdf",
           "tipo":"pdf", "pendiente":false }
       ]
     }
   ]

   Nota sobre "una carpeta con varios archivos de código": una página web
   no puede enlazar a una carpeta directamente (GitHub Pages no permite
   navegar carpetas). Dos opciones:
     a) Comprimir la carpeta en un .zip y subir ESE archivo → tipo:"otro"
        (se descarga tal cual, con todos los archivos adentro).
     b) Si quieres que cada archivo de código se pueda LEER en pantalla
        sin descargar, sube cada uno por separado como su propia
        evidencia con tipo:"codigo" (ej. "e1":"Main.java", "e2":"Utils.java").
   Puedes combinar ambas: el .zip completo como respaldo, y el archivo
   principal como "codigo" para vista rápida.

   TIPOS DE ARCHIVO VÁLIDOS para el campo "tipo":
     "imagen"  -> jpg, jpeg, png, webp
     "pdf"     -> pdf
     "codigo"  -> java, js, html, css, sql, py, txt
     "otro"    -> cualquier otro (doc, docx, ppt, pptx, zip, etc.)

   Si "pendiente" es true o "archivo" es null, el sistema muestra la
   evidencia como "Pendiente de completar" y no genera enlace roto.
   ===================================================================== */

window.PORTAFOLIO = {
  "meta": {
    "nombre": "Fernando Taipe Sulla",
    "carrera": "Ingeniería de Sistemas y Computación",
    "universidad": "Universidad Peruana Los Andes",
    "universidadSigla": "UPLA",
    "logoUniversidad": "imagenes/logo_upla.png",
    "github": "https://github.com/brooks-sx/portafolio-academico",
    "foto": "imagenes/foto_mia.jpeg",
    "cicloActual": "V"
  },
  "cursos": [
    {
      "id": "base-datos-ii",
      "nombre": "Base de Datos II",
      "descripcion": "Actividades, infografías, manuales y evidencias relacionadas con el desarrollo del curso.",
      "ciclo": "V",
      "sumilla": "Asignatura teórico-práctica orientada a administrar bases de datos con DBMS vigentes: arquitecturas de almacenamiento, gestión de instancias, esquemas y estructuras, seguridad, backups y recuperación de fallos, y monitoreo del desempeño y flashback del servidor.",
      "competencia": {
        "nombre": "Gestión de Datos y Analítica Avanzada",
        "descripcion": "Diseña y administra sistemas de almacenamiento, análisis y visualización de datos para la toma de decisiones, aplicando tecnologías de bases de datos, inteligencia de negocios, Big Data y ciencia de datos."
      },
      "logro": "Diseña soluciones analíticas avanzadas usando Big Data, ciencia de datos y herramientas de inteligencia empresarial.",
      "unidades": [
        {
          "numero": "I",
          "titulo": "Arquitecturas de Bases de Datos y Configuración del Entorno Corporativo",
          "semanas": [
            {
              "numero": 1,
              "titulo": "Formulación del Proyecto y Selección de la Arquitectura",
              "temas": [],
              "actividades": [
                {
                  "titulo": "Actividad 01",
                  "descripcion": null,
                  "evidencias": [
                    {
                      "id": "bd2-uI-s01-a1-e1",
                      "nombre": "Infografía 01",
                      "descripcion": "Arquitectura Centralizada",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a01-infografia-01.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a01-infografia-01-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    },
                    {
                      "id": "bd2-uI-s01-a1-e2",
                      "nombre": "Infografía 02",
                      "descripcion": "Arquitectura Cliente Servidor",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a01-infografia-02.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a01-infografia-02-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    },
                    {
                      "id": "bd2-uI-s01-a1-e3",
                      "nombre": "Infografía 03",
                      "descripcion": "Arquitectura Distribuida",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a01-infografia-03.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a01-infografia-03-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    },
                    {
                      "id": "bd2-uI-s01-a1-e4",
                      "nombre": "Infografía 04",
                      "descripcion": "Arquitectura en la Nube y Multitenencia",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a01-infografia-04.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a01-infografia-04-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    }
                  ]
                },
                {
                  "titulo": "Actividad 02",
                  "descripcion": null,
                  "evidencias": [
                    {
                      "id": "bd2-uI-s01-a2-e1",
                      "nombre": "Infografía 01",
                      "descripcion": "Características de la Base de Datos",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a02-infografia-01.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a02-infografia-01-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    },
                    {
                      "id": "bd2-uI-s01-a2-e2",
                      "nombre": "Infografía 02",
                      "descripcion": "Características de los Sistemas de Administración de Bases de Datos",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a02-infografia-02.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a02-infografia-02-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    },
                    {
                      "id": "bd2-uI-s01-a2-e3",
                      "nombre": "Infografía 03",
                      "descripcion": "Desarrollo de la Tecnología de Base de Datos y Estructura de Mercado",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a02-infografia-03.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a02-infografia-03-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    },
                    {
                      "id": "bd2-uI-s01-a2-e4",
                      "nombre": "Infografía 04",
                      "descripcion": "Arquitecturas de los Sistemas de Administración de Bases de Datos",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a02-infografia-04.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a02-infografia-04-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    },
                    {
                      "id": "bd2-uI-s01-a2-e5",
                      "nombre": "Infografía 05",
                      "descripcion": "Impactos Organizacionales de la Tecnología de Base de Datos",
                      "archivo": "trabajos/base-datos-ii/unidad-1/semana-1/bd2-s01-a02-infografia-05.png",
                      "preview": "trabajos/base-datos-ii/unidad-1/semana-1/preview/bd2-s01-a02-infografia-05-p.jpg",
                      "tipo": "imagen",
                      "pendiente": false
                    }
                  ]
                }
              ]
            },
            {
              "numero": 2,
              "titulo": "Despliegue y Configuración de Motores de Datos (DBMS)",
              "temas": [],
              "actividades": [
                {
                  "titulo": "Actividad 01",
                  "descripcion": "Manual de instalación de MS SQL Server",
                  "evidencias": [
                    {
                      "id": "bd2-uI-s02-a1-e1",
                      "nombre": "Manual de instalación",
                      "descripcion": "Instalación y configuración de MS SQL Server",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    }
                  ]
                },
                {
                  "titulo": "Actividad 02",
                  "descripcion": "Infografías",
                  "evidencias": [
                    {
                      "id": "bd2-uI-s02-a2-e1",
                      "nombre": "Infografía 01",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a2-e2",
                      "nombre": "Infografía 02",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a2-e3",
                      "nombre": "Infografía 03",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a2-e4",
                      "nombre": "Infografía 04",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a2-e5",
                      "nombre": "Infografía 05",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a2-e6",
                      "nombre": "Infografía 06",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a2-e7",
                      "nombre": "Infografía 07",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a2-e8",
                      "nombre": "Infografía 08",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    }
                  ]
                },
                {
                  "titulo": "Actividad 03",
                  "descripcion": "Infografías",
                  "evidencias": [
                    {
                      "id": "bd2-uI-s02-a3-e1",
                      "nombre": "Infografía 01",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a3-e2",
                      "nombre": "Infografía 02",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a3-e3",
                      "nombre": "Infografía 03",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a3-e4",
                      "nombre": "Infografía 04",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    },
                    {
                      "id": "bd2-uI-s02-a3-e5",
                      "nombre": "Infografía 05",
                      "descripcion": "Pendiente de completar",
                      "archivo": null,
                      "tipo": null,
                      "pendiente": true
                    }
                  ]
                }
              ]
            },
            {
              "numero": 3,
              "titulo": "Modelamiento Físico y Mecanismos de Integración",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 4,
              "titulo": "Sustentación y Validación de la Infraestructura de Datos",
              "temas": [],
              "actividades": []
            }
          ]
        },
        {
          "numero": "II",
          "titulo": "Administración de Instancias, Estructuras de Almacenamiento y Gestión de Datos Masivos",
          "semanas": [
            {
              "numero": 5,
              "titulo": "Configuración de la Instancia y Gestión de Memoria del Servidor",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 6,
              "titulo": "Arquitectura Física de Almacenamiento y Distribución de Archivos",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 7,
              "titulo": "Organización de Esquemas Lógicos y Estrategias de Indexación",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 8,
              "titulo": "Sustentación y Pruebas de Carga de la Infraestructura de Almacenamiento",
              "temas": [],
              "actividades": []
            }
          ]
        },
        {
          "numero": "III",
          "titulo": "Seguridad Corporativa, Conectividad de Red y Alta Disponibilidad de Datos",
          "semanas": [
            {
              "numero": 9,
              "titulo": "Configuración de Conectividad de Red y Seguridad del Entorno",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 10,
              "titulo": "Gestión de Privilegios, Roles y Auditoría de Datos",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 11,
              "titulo": "Estrategias de Backups Avanzados y Automatización (Jobs)",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 12,
              "titulo": "Recuperación ante Fallos y Planes de Contingencia",
              "temas": [],
              "actividades": []
            }
          ]
        },
        {
          "numero": "IV",
          "titulo": "Monitoreo de Servidores, Optimización del Desempeño y Recuperación Basada en Flashback",
          "semanas": [
            {
              "numero": 13,
              "titulo": "Auditoría, Monitoreo de Eventos y Diagnóstico de Alertas",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 14,
              "titulo": "Afinamiento y Optimización del Desempeño de Consultas (Tuning)",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 15,
              "titulo": "Implementación de Tecnologías de Recuperación Flashback",
              "temas": [],
              "actividades": []
            },
            {
              "numero": 16,
              "titulo": "Sustentación Final e Integración del Proyecto de la Asignatura",
              "temas": [],
              "actividades": []
            }
          ]
        }
      ]
    },
    {
      "id": "algoritmos",
      "nombre": "Algoritmos y Estructura de Datos",
      "descripcion": "Espacio destinado a las actividades, prácticas y evidencias del curso.",
      "ciclo": "V",
      "sumilla": "Asignatura teórico-práctica orientada a resolver problemas computables mediante principios algorítmicos y algoritmos de ordenamiento y búsqueda. Desarrolla la capacidad de construir algoritmos con pilas, colas, recursividad, listas enlazadas, árboles y grafos, fomentando la disciplina de análisis y solución de problemas.",
      "competencia": {
        "nombre": "Desarrollo de Software y Soluciones Tecnológicas",
        "descripcion": "Diseña, implementa y evalúa soluciones de software de manera eficiente y contextualizada, utilizando metodologías de desarrollo, ingeniería de requisitos, arquitectura y estándares de calidad de software."
      },
      "logro": "Desarrolla soluciones de software de complejidad media utilizando principios de diseño modular y metodologías ágiles.",
      "unidades": [
        {
          "numero": "I",
          "titulo": "Conceptos de Algoritmos y Estructuras de Datos",
          "semanas": [
            {
              "numero": 1,
              "titulo": "Arreglos bidimensionales",
              "temas": [
                "Arreglos Bidimensionales.",
                "Representación de arreglos.",
                "Aplicaciones con arreglos bidimensionales."
              ],
              "actividades": [
     {
       "titulo": "Actividad 01",
       "descripcion": "Implementación con arreglos bidimensionales",
       "evidencias": [
         { "id":"alg-uI-s01-a1-e1", "nombre":"Código fuente",
           "descripcion":"Carpeta con las clases del ejercicio (comprimida en .zip)",
           "archivo":"trabajos/algoritmos/unidad-1/semana-1/codigo-arreglos.zip",
           "tipo":"otro", "pendiente":false },
         { "id":"alg-uI-s01-a1-e2", "nombre":"Informe explicativo",
           "descripcion":"Explicación del Codigo",
           "archivo":"trabajos/algoritmos/unidad-1/semana-1/algoritmos-a01.pdf",
           "tipo":"pdf", "pendiente":false }
       ]
     },
     {
       "titulo": "Actividad 02",
       "descripcion": "Implementación con Arreglos Unidimensionales",
       "evidencias": [
         { "id":"alg-uI-s01-a2-e1", "nombre":"Código fuente",
           "descripcion":"Carpeta con las clases del ejercicio (comprimida en .zip)",
           "archivo":"trabajos/algoritmos/unidad-1/semana-1/codigo-arreglos-02.zip",
           "tipo":"otro", "pendiente":false },
         { "id":"alg-uI-s01-a2-e2", "nombre":"Informe explicativo",
           "descripcion":"Explicación del Codigo",
           "archivo":"trabajos/algoritmos/unidad-1/semana-1/algoritmos-a02.pdf",
           "tipo":"pdf", "pendiente":false }
       ]
     }
    ]
            },
            {
              "numero": 2,
              "titulo": "Arreglos paralelos y de objetos",
              "temas": [
                "Arreglos paralelos.",
                "Representación y uso de arreglos paralelos.",
                "Arreglos de Objetos.",
                "Representación y uso de arreglos de objetos."
              ],
              "actividades": [
                {
       "titulo": "Actividad 01",
       "descripcion": "Implementación con Arreglos Bidimensionales",
       "evidencias": [
         { "id":"alg-uI-s02-a1-e1", "nombre":"Código fuente",
           "descripcion":"Carpeta con las clases del ejercicio (comprimida en .zip)",
           "archivo":"trabajos/algoritmos/unidad-1/semana-2/codigo-matriz.zip",
           "tipo":"otro", "pendiente":false },
         { "id":"alg-uI-s02-a1-e2", "nombre":"Informe del Codigo",
           "descripcion":"Explicación del Codigo",
           "archivo":"trabajos/algoritmos/unidad-1/semana-2/algoritmos-s2-01.pdf",
           "tipo":"pdf", "pendiente":false }
       ]
     },
              ]
            },
            {
              "numero": 3,
              "titulo": "ArrayList y Vector",
              "temas": [
                "Clase ArrayList.",
                "Operaciones con ArrayList.",
                "Clase Vector.",
                "Operaciones con Vector."
              ],
              "actividades": []
            },
            {
              "numero": 4,
              "titulo": "LinkedList",
              "temas": [
                "Clase LinkedList.",
                "Operaciones con LinkedList."
              ],
              "actividades": []
            }
          ]
        },
        {
          "numero": "II",
          "titulo": "Pilas, Colas y Recursividad",
          "semanas": [
            {
              "numero": 5,
              "titulo": "Pilas",
              "temas": [
                "Pilas.",
                "TDA pila, definición, representación y operaciones.",
                "Pilas de objetos.",
                "Aplicaciones con pilas.",
                "Clase Stack."
              ],
              "actividades": []
            },
            {
              "numero": 6,
              "titulo": "Colas",
              "temas": [
                "Colas.",
                "TDA cola, definición, representación y operaciones.",
                "Colas de objetos.",
                "Aplicaciones de colas."
              ],
              "actividades": []
            },
            {
              "numero": 7,
              "titulo": "Recursividad",
              "temas": [
                "Recursividad.",
                "Algoritmos y programación recursiva.",
                "Recursividad Múltiple."
              ],
              "actividades": []
            },
            {
              "numero": 8,
              "titulo": "Recursividad anidada",
              "temas": [
                "Recursividad anidada."
              ],
              "actividades": []
            }
          ]
        },
        {
          "numero": "III",
          "titulo": "Listas Enlazadas",
          "semanas": [
            {
              "numero": 9,
              "titulo": "Listas simplemente enlazadas",
              "temas": [
                "Listas Simplemente Enlazadas.",
                "TDA LSE (Listas Simplemente Enlazadas), definición, representación y operaciones.",
                "LSE (Listas Simplemente Enlazadas) de objetos.",
                "Aplicaciones de LSE (Listas Simplemente Enlazadas)."
              ],
              "actividades": []
            },
            {
              "numero": 10,
              "titulo": "Listas circulares simples",
              "temas": [
                "Listas Circulares Simples.",
                "TDA LCS (Lista Circular Simplemente Enlazada), definición, representación y operaciones.",
                "LCS (Lista Circular Simplemente Enlazada) de objetos."
              ],
              "actividades": []
            },
            {
              "numero": 11,
              "titulo": "Listas doblemente enlazadas",
              "temas": [
                "Listas Doblemente Enlazadas.",
                "TDA LDE (Lista Doblemente Enlazada), definición, representación y operaciones.",
                "LDE (Lista Doblemente Enlazada) de objetos."
              ],
              "actividades": []
            },
            {
              "numero": 12,
              "titulo": "Listas circulares dobles",
              "temas": [
                "Listas Circulares Dobles.",
                "TDA LCD (Lista Circular Doble), definición, representación y operaciones.",
                "LCD (Lista Circular Doble) de objetos.",
                "Aplicaciones de LCD (Lista Circular Doble)."
              ],
              "actividades": []
            }
          ]
        },
        {
          "numero": "IV",
          "titulo": "Árboles, Grafos, Métodos de Ordenación y Búsqueda",
          "semanas": [
            {
              "numero": 13,
              "titulo": "Árboles",
              "temas": [
                "Árboles.",
                "TDA árbol, definición, representación y operaciones.",
                "Arboles generales.",
                "Arboles Binarios.",
                "Recorrido de un árbol.",
                "Operaciones en arboles binarios."
              ],
              "actividades": []
            },
            {
              "numero": 14,
              "titulo": "Grafos",
              "temas": [
                "Grafos.",
                "TDA grafo, definición, representación y operaciones.",
                "Representación de grafos.",
                "Conexiones de un grafo."
              ],
              "actividades": []
            },
            {
              "numero": 15,
              "titulo": "Ordenación y búsqueda",
              "temas": [
                "Métodos de ordenación.",
                "Algoritmos de ordenación.",
                "Búsqueda secuencial.",
                "Búsqueda binaria.",
                "El estudiante expone su trabajo final."
              ],
              "actividades": []
            },
            {
              "numero": 16,
              "titulo": "Cierre y evaluación",
              "temas": [
                "Ingreso de notas al sistema.",
                "Evaluación de desempeño final."
              ],
              "actividades": []
            }
          ]
        }
      ]
    }
  ]
};
