import type {ReactNode} from 'react'
import {Navigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext.tsx";

function ProtectedRoute({children}:{children:ReactNode}) {
    const {token, isLoading} = useAuth()

    if (isLoading) {
        return (<div className="flex min-h-screen items-center justify-center bg-slate-100">
            <p role="status" className="text-slate-600"> Cargando... </p>
        </div>)
    }

    if (!token) {
        return <Navigate to='/login' replace/>
    }

    return <>{children}</>

}

export default ProtectedRoute