# API de Gestión de Usuarios 

## Table of Contents
- [Descripción](#descripción)
- [Prerequisitos](#prerequisitos)
- [Inicio Rapido](#inicio-rapido)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Capas de la Arquitectura](#capas-de-la-arquitectura)
- [Características Técnicas](#características-técnicas)
- [Configuración](#configuración)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Testing](#testing)
- [Cliente de Pruebas WebSocket](#cliente-de-pruebas-websocket)
- [Documentacion del API ](#documentacion-del-api )
- [Endpoints Principales](#endpoints-principales)
- [Contribución](#contribución)
- [Contacto](#contacto)

## Descripción
API RESTful de gestión de usuarios construida con NestJS, implementando arquitectura limpia (ports & adapters) y características avanzadas de seguridad y comunicación en tiempo real.

## Prerequisitos

```html
Node.js >= 20.0.0
MongoDB >= 6.0
npm >= 9.0.0
```

### Inicio Rapido

```bash
# Install dependencies
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/mongoose @nestjs/config @nestjs/swagger @nestjs/websockets
npm install mongoose class-validator class-transformer bcrypt jsonwebtoken socket.io
npm install --save-dev @types/node @types/mongoose @types/bcrypt @types/jsonwebtoken @nestjs/testing supertest
```

## Estructura del Proyecto

```html
src/
├── domain/                 # Reglas de negocio y entidades core
│   ├── entities/           # Modelos de dominio
│   ├── repositories/       # Interfaces de repositorios
│   └── value-objects/      # Objetos de valor inmutables
│
├── application/            # Casos de uso y lógica de aplicación
│   ├── use-cases/          # Implementación de casos de uso
│   └── ports/              # Puertos de entrada/salida
│
├── infrastructure/         # Implementaciones técnicas
│   ├── persistence/        # Implementación de bases de datos
│   ├── websocket/          # Configuración de WebSockets
│   └── logging/            # Sistema de logging
│
├── interfaces/             # Adaptadores de entrada
│   ├── http/               # Controladores REST y DTOs
│   └── websocket/          # Eventos WebSocket
│
└── shared/                 # Utilidades compartidas
    ├── config/             # Configuraciones
    └── utils/              # Funciones auxiliares
```

## Capas de la Arquitectura

- #### Domain Layer:
    - Contiene las entidades core del negocio
    - Define interfaces de repositorios
    - Implementa objetos de valor
    - No tiene dependencias externas
- #### Application Layer
    - Implementa casos de uso
    - Define puertos de entrada/salida
    - Orquesta el flujo de datos
    - Independiente de frameworks
- #### Infrastructure Layer
    - Implementa persistencia de datos
    - Configura WebSockets
    - Maneja logging
    - Implementa servicios externos
- #### Interface Layer
    - Expone API REST
    - Maneja DTOs
    - Implementa middlewares
    - Gestiona eventos WebSocket

## Características Técnicas

### Autenticación y Seguridad
- JWT con cookies seguras
- Middleware de autenticación
- Encriptación de contraseñas
- Validación de datos
### Comunicación en Tiempo Real
- WebSockets con Socket.IO
- Notificaciones de operaciones
- Eventos en tiempo real
### Persistencia
- MongoDB con Mongoose
- - Repositorios abstractos
Schemas validados

## Configuración
Variables de Entorno:
```html
PORT=3000
MONGODB_URI=mongodb://localhost:27017/users-api
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
NODE_ENV=development
```
## Instalación y Ejecución
```bash
$ npm install

$ npm run start:dev

$ npm run start:prod

$ npm run start:debug

$ npm run test

$ npm run test:e2e

$ npm run test:cov
```

## Cliente de Pruebas WebSocket

Se incluye un cliente HTML para pruebas en tiempo real de eventos WebSocket:

1. Abre `src/test/test-client.html` en tu navegador
2. El cliente se conecta automáticamente a `http://localhost:3000`
3. Observa eventos en tiempo real:
   - Estado de conexión
   - Operaciones de usuarios
   - Conexiones/desconexiones de usuarios

Eventos monitoreados:
- `connect`: Conexión inicial WebSocket
- `userOperation`: Operaciones CRUD
- `userConnection`: Nuevas conexiones de usuarios
- `userDisconnection`: Desconexiones de usuarios

WebSocket Events: 
```html
Evento	            Descripción
userOperation	    Notifica operaciones CRUD
userConnected	    Usuario conectado
userDisconnected	Usuario desconectado
```
## Documentacion del API 
Accede a la documentación Swagger en:

http://localhost:3000/api-docs


## Endpoints Principales
```html
Método	Ruta	        Descripción	        Auth
POST	/auth/register	Registro de usuario	 No
POST	/auth/login	    Inicio de sesión	 No
POST    /aut/logout/:id Cierre de sesión     Sí
GET	    /users	        Listar usuarios	     Sí
GET	    /users/:id	    Obtener usuario	     Sí
PUT	    /users/:id	    Actualizar usuario	 Sí
DELETE	/users/:id	    Eliminar usuario	 Sí
```

## Contribución
- Fork el proyecto
- Crea tu Feature Branch
- Commit tus cambios
- Push al Branch


## Contacto
- Autor - Fidel Alejandro Cepero Salazar
- Website - https://vrus-c98rvxkdr-fidelsalazars-projects.vercel.app/
- Telegram - [Fidel Salazar](https://t.me/fidelsalazar)

## Recursos Adicionales
- [Documentación NestJS](https://docs.nestjs.com/)
- [Documentación MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentación Socket.IO](https://socket.io/docs/)