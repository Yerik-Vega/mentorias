import { useState} from "react";
import type {SubmitEvent} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {registerUser} from '../api';

function RegisterForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("")

        if (!email.trim() || !password.trim() || !name.trim()) {
            setMessage("complete todos los campos");
            return;
        }

        if (name.trim().length > 100) {
            setMessage("nombre invalido")
            return;
        }

        if (password.trim().length > 72 || password.trim().length < 7) {
            setMessage("contraseña invalido")
            return;
        }

        try {
            await registerUser({email, name, password})
            navigate("/login",{state:{message:"Cuenta creada Correctamente. Inicia Sesión."}})
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.detail ?? "no se pudo registrar al usuario")
            } else {
                setMessage("ocurrio un error inesperado.")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input id = "name"
                       type="name"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="Ana Garcia... la que todas las IAs ponen xd"
                       className="input w-full"
                       required
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id = "email"
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="Correo@gmail.com"
                       className="input w-full"
                       required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input id = "password"
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Correo@gmail.com"
                       className="input w-full"
                       required
                />
            </div>
            <button type="submit" className="btn btn-primary w-full">Registrarse</button>
            {message && (<p role="status" className="text-center text-sm" >{message}</p>)}
        </form>
    )
}

export default RegisterForm;