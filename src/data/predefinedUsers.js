// Lista centralizada de usuarios predefinidos (admins y usuarios de prueba)
const predefinedUsers = [
  // ADMINISTRADORES
  {
    email: 'admin@dep.com',
    password: 'admin123',
    nombre: 'Administrador DEP',
    rol: 'admin'
  },
  {
    email: 'dar.cerna@dep.com',
    password: 'Dep2411',
    nombre: 'Darickson Cerna - Admin',
    rol: 'admin'
  },
  {
    email: 'e.arias@dep.com',
    password: 'Dep2411',
    nombre: 'Estefania Arias - Admin',
    rol: 'admin'
  },
  {
    email: 'pablosalas@dep.com',
    password: 'Dep2411',
    nombre: 'Pablo Salas - Admin',
    rol: 'admin'
  },
  {
    email: 'byron@dep.com',
    password: 'Dep2411',
    nombre: 'Byron - Admin',
    rol: 'admin'
  },

  // USUARIOS NORMALES
  {
    email: 'ventas@dep.com',
    password: 'ventas123',
    nombre: 'Departamento de Ventas DEP',
    rol: 'user'
  },
  {
    email: 'cliente@dep.com',
    password: 'cliente123',
    nombre: 'Cliente Premium DEP',
    rol: 'user'
  }
];

export default predefinedUsers;
