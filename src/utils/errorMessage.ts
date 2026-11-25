import axios from "axios";


export function errorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        return (error.response?.data?.description ?? "No se pudo contactar al servidor.")
    }

    return "Ocurrio un error inesperado."
}