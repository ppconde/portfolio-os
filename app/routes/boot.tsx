import { useEffect, useState } from 'react'

export default function Boot() {
    const [bootMessages, setBootMessages] = useState<string[]>([])
    const [isBooting, setIsBooting] = useState(true)

    useEffect(() => {
        const messages = [
            'Starting Windows 98...',
            'Checking system memory...',
            'Memory Test Passed: 65536K OK',
            'Loading system files...',
            'Initializing drivers...',
            'Loading MS-DOS...',
            'Welcome to Windows 98!',
        ]

        messages.forEach((msg, index) => {
            setTimeout(() => {
                setBootMessages((prev) => [...prev, msg])
            }, index * 1000) // 1 second delay for each message
        })

        setTimeout(() => setIsBooting(false), messages.length * 1000)
    }, [])

    return (
        <div className="font-mono flex h-screen w-full flex-col justify-center bg-black px-5 text-green-500">
            <div className="space-y-2">
                {bootMessages.map((msg, index) => (
                    <p key={index} className="leading-relaxed">
                        {msg}
                    </p>
                ))}
            </div>
            {!isBooting && (
                <div className="mt-4 animate-pulse">
                    <p className="font-bold">Press Enter to continue...</p>
                </div>
            )}
        </div>
    )
}