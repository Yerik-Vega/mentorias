import {createContext, useContext, useEffect, useState} from "react"
import type {ReactNode} from "react";
import {getCurrentUser,loginUser} from "../api.ts";
import type {User} from "../types";

type AuthContextValue = {
    user: User|null
    token: string|null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () =>void
}

const AuthContext = createContext<AuthContextValue|null>(null)

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<User|null>(null)
    const [token, setToken] = useState<string|null>(()=>localStorage.getItem("token"))
    const [isLoading, setIsLoading] = useState(()=>Boolean(localStorage.getItem("token")))

    useEffect(() => {
        const savedToken = localStorage.getItem("token")
        if (!savedToken) return
        let cancelled = false

        getCurrentUser()
            .then((currentUser) => {if(!cancelled) setUser(currentUser)})
            .catch(()=>{
                if(!cancelled){
                    localStorage.removeItem("token")
                    localStorage.removeItem("user")
                    setToken(null)
                    setUser(null)
                }
            }).finally(()=>{ if(!cancelled) setIsLoading(false)})
        return () => { cancelled = true }
    },[])

    async function login(email: string, password: string) {
        const data = await loginUser(email, password)

        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data))
        setToken(data.token)

        try {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        }catch(err){
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setToken(null)
            setUser(null)
            throw err
        }
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user,token,isLoading,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth must be used within a AuthProvider")
    return context
}