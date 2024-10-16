import { useEffect, useState } from "react"

export const useBootingEffect = () => {
    const [isBooting, setIsBooting] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => setIsBooting(false), 3000)
        return () => clearTimeout(timeout)
    }, [])

    return isBooting
}