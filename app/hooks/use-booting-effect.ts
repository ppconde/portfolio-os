import { useEffect, useState } from "react"

export const useBootingEffect = () => {
    const isProd = process.env.NODE_ENV === 'production'
    const [isBooting, setIsBooting] = useState(isProd)

    useEffect(() => {
        if (isProd) {
            const timeout = setTimeout(() => setIsBooting(false), 3000)
            return () => clearTimeout(timeout)
        }
    }, [isProd])

    return isBooting
}