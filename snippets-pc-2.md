# Snippets for Frontend

## Hook for Axios

Custom hook that creates an authenticated Axios instance with the base URL and authorization token from the auth context. This ensures all API calls include the user's authentication token automatically.

```
import type { AxiosInstance } from "axios";
import axios from "axios";
import constants from "../components/common/constants";
import { useAuth } from "../components/auth/useAuth";

export const useAxiosForApi = (): [AxiosInstance] => {
    const auth = useAuth();

    if (!auth.token) {
        throw new Error("No auth token available. This hook cannot be used outside of an authenticated context.");
    }

    const instance = axios.create({ baseURL: constants.API_HOST, headers: { Authorization: "Bearer " + auth.token } });
    return [instance,];
};
```

## Interceptors in Axios

Axios interceptors allow you to intercept requests and responses before they are handled. The request interceptor automatically adds the JWT token to every request. The response interceptor handles 401 errors by clearing the session and redirecting to login.

```
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener el token guardado en localStorage
    const token = localStorage.getItem('token');

    // Si existe un token, agregarlo al header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError<ApiError>) => {
    // Si el servidor responde con 401 (No autorizado)
    if (error.response?.status === 401) {
      // Limpiar datos de sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Hook for LocalStorage

Custom React hook that manages state synchronized with browser's localStorage. It persists data across page refreshes and provides a simple API similar to useState. Useful for storing user preferences, tokens, or any client-side data.

```
import { useState } from "react";

export const useLocalStorage = (keyName: string, defaultValue: string): [string, (value: string) => void] => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // try to get the value
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return value;
            } else {
                window.localStorage.setItem(keyName, defaultValue);
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });

    const setValue = (newValue: string) => {
        try {
            window.localStorage.setItem(keyName, newValue);
        } catch (err) {
            console.log(err);
        }

        setStoredValue(newValue);
    };

    return [storedValue, setValue];
};
```

## Routing Example

React Router setup demonstrating protected and public routes. Public routes (login/register) use a basic layout, while protected routes require authentication and use a different layout. The ProtectedRoute wrapper ensures only authenticated users can access certain pages.

```
<AuthProvider>
    <Routes>
    <Route element={<LayoutLogin />}>
        <Route path="/auth/register" element={<Register />}></Route>
        <Route path="/auth/login" element={<Login />}></Route>
    </Route>
    <Route element={<ProtectedRoute>
        <Layout />
    </ProtectedRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/auth/logout" element={<Logout />}></Route>
    </Route>
    </Routes>
</AuthProvider>
```

## Recommended Documentation

- CSS, HTML and JS: https://developer.mozilla.org/en-US/
- React: https://react.dev/learn
- Typescript: https://www.typescriptlang.org/docs/
- Vite: https://vite.dev/guide/
- Tailwind: https://tailwindcss.com/
- Axios: https://axios-http.com/es/docs/intro
- ShadCN: https://ui.shadcn.com/docs/components/chart
- DaysiUI: https://daisyui.com/
- RadixUI: https://www.radix-ui.com/themes/docs/overview/getting-started
