# 🏓 Sistema de Gestión de Padel

Una aplicación web moderna para la gestión de reservas y torneos de padel, desarrollada con React y Vite.

## 🚀 Características

- **Autenticación de usuarios** con login y registro
- **Sistema de reservas** de canchas de padel
- **Gestión de torneos** con inscripciones
- **Panel de administración** para gestión completa
- **Interfaz responsive** y moderna
- **Navegación con React Router**
- **Persistencia de sesión** con localStorage

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento para aplicaciones React
- **Fetch API** - Para comunicación con el backend
- **localStorage** - Para persistencia de datos del usuario

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn** (gestor de paquetes)

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sistema-padel.git
cd sistema-padel
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el backend

Asegúrate de que tu servidor backend esté ejecutándose en:
- **URL base:** `https://padel-gestionado.com/api/`
- **Endpoints disponibles:**
  - `login.php`
  - `register.php`
  - `reservar.php`
  - `mis_reservas.php`
  - `cancelar_reserva.php`
  - `torneos.php`
  - `inscribir.php`
  - `mis_torneos.php`
  - `usuarios.php`
  - `crear_torneo.php`
  - `eliminar_torneo.php`
  - `todas_las_reservas.php`
  - `eliminar_usuario.php`
  - `eliminar_reserva.php`

## 🚀 Ejecutar el proyecto

### Modo desarrollo

```bash
npm run dev
```

El servidor de desarrollo se ejecutará en `http://localhost:5173`

### Modo producción

```bash
npm run build
npm run preview
```

## 📱 Uso de la aplicación

### 1. Registro de usuarios
- Ve a `/register` para crear una nueva cuenta
- Completa el formulario con nombre, email y contraseña

### 2. Inicio de sesión
- Ve a `/login` para acceder con tus credenciales
- El sistema redirigirá automáticamente al menú principal

### 3. Funcionalidades principales
- **Reservas:** Hacer reservas de canchas
- **Mis Reservas:** Ver y cancelar reservas existentes
- **Torneos:** Inscribirse en torneos disponibles
- **Mis Torneos:** Ver torneos en los que estás inscrito
- **Panel Admin:** Gestión completa (solo administradores)

### 4. Panel de administración
- **Usuarios:** Ver y eliminar usuarios registrados
- **Torneos:** Crear, ver y eliminar torneos
- **Reservas:** Ver y eliminar todas las reservas del sistema

## 🔐 Roles de usuario

### Usuario normal
- Hacer reservas
- Inscribirse en torneos
- Gestionar sus propias reservas y torneos

### Administrador
- Todas las funcionalidades de usuario normal
- Acceso al panel de administración
- Gestión completa del sistema

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── LoginForm.jsx          # Formulario de login
│   ├── RegisterForm.jsx       # Formulario de registro
│   ├── Home.jsx              # Página principal
│   ├── Reservas.jsx          # Hacer reservas
│   ├── MisReservas.jsx       # Ver reservas del usuario
│   ├── Torneos.jsx           # Ver torneos disponibles
│   ├── MisTorneos.jsx        # Ver torneos del usuario
│   └── AdminPanel.jsx        # Panel de administración
├── App.jsx                   # Componente principal con rutas
├── main.jsx                  # Punto de entrada
└── App.css                   # Estilos globales
```

## 🌐 Rutas de la aplicación

- `/` - Página principal (requiere login)
- `/login` - Formulario de login
- `/register` - Formulario de registro
- `/reservas` - Hacer reservas
- `/mis-reservas` - Ver mis reservas
- `/torneos` - Ver torneos
- `/mis-torneos` - Ver mis torneos
- `/admin` - Panel de administración (solo admins)

## 🔧 Scripts disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Construir para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar linter
```

## 🐛 Solución de problemas

### Error de conexión con el backend
- Verifica que el servidor backend esté ejecutándose
- Comprueba que las URLs de la API sean correctas
- Revisa la consola del navegador para errores de red

### Problemas de sesión
- Limpia el localStorage del navegador
- Verifica que los datos del usuario se guarden correctamente
- Revisa la consola para errores de JavaScript

## 📝 Notas de desarrollo

- El proyecto usa **React Router** para navegación
- La autenticación se maneja con **localStorage**
- Los estados se sincronizan automáticamente entre componentes
- El diseño es **responsive** y funciona en móviles y desktop

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
