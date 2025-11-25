// src/pages/auth/Login.jsx (este SÍ es .jsx)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Section from '../../components/templates/Section';
import { useAuth } from '../../contexts/AuthContext';
import loginData from '../../data/auth/loginData';
import predefinedUsers from '../../data/predefinedUsers';
import '../../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const usuariosPredefinidos = predefinedUsers;

            const usuarioValido = usuariosPredefinidos.find(
                u => u.email === formData.email && u.password === formData.password
            );

            if (usuarioValido) {
                login(usuarioValido);
                
                if (usuarioValido.rol === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError('❌ Correo o contraseña incorrectos');
            }
        } catch (error) {
            setError('❌ Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    // Modificar dinámicamente los datos para el Section
    const dynamicLoginData = loginData.map(section => {
        if (section.type === "inputs") {
            return {
                ...section,
                inputs: section.inputs.map(input => ({
                    ...input,
                    value: formData[input.name],
                    onChange: (e) => handleInputChange(input.name, e.target.value)
                }))
            };
        }
        if (section.type === "button") {
            return {
                ...section,
                onClick: handleSubmit,
                disabled: loading,
                text: loading ? '🔄 Cargando...' : section.text
            };
        }
        if (section.type === "text") {
            // Manejar el botón de crear cuenta como JSX
            return {
                ...section,
                text: section.text.map(textItem => {
                    if (textItem.isButton) {
                        return {
                            ...textItem,
                            content: (
                                <Link 
                                    to={textItem.link}
                                    className="text-blue-400 hover:text-blue-300 underline transition font-medium text-lg"
                                >
                                    {textItem.content}
                                </Link>
                            )
                        };
                    }
                    return textItem;
                })
            };
        }
        return section;
    });

    return (
        <div className="login-container">
            <div className="login-card">
                <form onSubmit={handleSubmit}>
                    <Section content={dynamicLoginData} />
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Información de usuarios de prueba */}
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                        <p className="text-yellow-400 font-semibold mb-2 text-center">🧪 Usuarios de Prueba:</p>
                        <p className="text-gray-300 text-sm text-center">👑 <strong>Admin:</strong> admin@dep.com / admin123</p>
                        <p className="text-gray-300 text-sm text-center">👤 <strong>Usuario:</strong> cliente@dep.com / cliente123</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;