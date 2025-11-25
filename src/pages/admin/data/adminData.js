// src/pages/admin/data/adminData.js
export const adminData = [
    {
        type: "text",
        text: [
            { 
                id: 1, 
                content: "👑 Panel de Administración DEP URBAN", 
                variant: "h1", 
                className: "text-4xl font-bold text-center text-gray-800" 
            },
            { 
                id: 2, 
                content: "Gestiona tu tienda urbana con estilo y actitud", 
                variant: "p", 
                className: "text-lg text-gray-600 text-center mt-2" 
            },
        ],
    },
    {
        type: "table",
        title: "📦 Productos Activos",
        columns: ["ID", "Nombre", "Precio", "Categoría", "Stock", "Acciones"],
        data: [], 
        service: "productos",  // Se conectaría con ProductoService
        className: "my-8",
    },
    {
        type: "table", 
        title: "👥 Usuarios Registrados",
        columns: ["ID", "Nombre", "Email", "Rol", "Fecha Registro", "Acciones"],
        data: [],
        service: "usuarios",  // Se conectaría con UsuarioService
        className: "my-8",
    },
    {
        type: "table",
        title: "💰 Ventas Recientes",
        columns: ["ID", "Usuario", "Total", "Fecha", "Estado", "Acciones"],
        data: [],
        service: "ventas",  // Se conectaría con VentaService
        className: "my-8",
    }
];

export default adminData;
