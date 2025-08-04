# Documentación del Frontend en ReactJS

## Introducción

Este documento proporciona detalles sobre el frontend desarrollado en ReactJS, incluyendo la estructura del proyecto utilizando Atomic Design y el puerto en el que se ejecuta.

## Estructura del Proyecto

El frontend sigue la metodología de diseño atómico (Atomic Design). La estructura del proyecto está organizada de la siguiente manera:

```sh
edemco-frontend-react/
│
├── node_modules/ # Módulos de Node.js
├── public/ # Archivos estáticos públicos
│ ├── banner-energia-renovable-vf.png
│ ├── ico-logo.ico
│ └── Logo-removebg-preview.png
│
├── src/ # Código fuente del proyecto
│ ├── components/ # Componentes
│ │ ├── atoms/ # Componentes atómicos
│ │ ├── layouts/ # Layouts
│ │ ├── molecules/ # Componentes moléculas
│ │ ├── organisms/ # Componentes organismos
│ │ └── pages/ # Páginas
│ ├── jsons/ # Archivos JSON
│ ├── services/ # Servicios API
│ └── utils/ # Utilidades
│
├── .env # Variables de entorno
├── .env.example # Ejemplo de archivo de variables de entorno
├── .eslintrc # Configuración de ESLint
├── .gitignore # Archivos y directorios ignorados por Git
├── .prettierignore # Archivos y directorios ignorados por Prettier
├── docFront.md # Documentación del frontend
├── eslint.config.js # Configuración de ESLint
├── index.html # Archivo HTML principal
├── package-lock.json # Archivo de bloqueo de dependencias de npm
├── package.json # Archivo de configuración de npm
├── README.md # Archivo README
├── vite.config.js # Configuración de Vite
│
├── Layout.css # Estilos de layout
├── Layout.jsx # Componente de layout
├── main.jsx # Punto de entrada de la aplicación
├── routes.jsx # Configuración de rutas
└── styles.css # Estilos globales
```

## Puerto del Servidor de Desarrollo

- **Puerto**: 5173

## Dependencias

Las dependencias principales del proyecto incluyen:

- React
- React DOM
- React Router DOM
- React Toastify
- Eslint
- Prettier
- Standard
- Vite (para la configuración y ejecución del servidor de desarrollo)

## Instalación Front

1. Instala los paquetes de NPM

```sh
npm install
```

2. Ejecuta el proyecto

```sh
npm run dev
```
