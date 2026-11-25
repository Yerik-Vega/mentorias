import {Link,useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

function Header() {
    const {user,logout} = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }
    return (
        <header className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <Link to="/dashboard" className = "btn btn-ghost text-xl">
                    MentoriasUTEC
                </Link>
            </div>
            <div className="navbar-end gap-2">
                {user ? (
                    <>
                    <span className="px-2 text-sm font-medium"> Hola, {user.name}</span>
                        <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                            Cerrar Sesión
                        </button>
                    </>
                ):(<>
                    <Link to={"/login"}> Iniciar Sesión </Link>
                    <Link to={"/register"} className="btn btn-primary btn-sm">
                        Registrarse
                    </Link>
                </>)}
            </div>
        </header>
    )
}
export default Header;