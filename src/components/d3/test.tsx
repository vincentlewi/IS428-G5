import { useState, useEffect } from 'react'

export default function Test() {
    const generateDataset = () => (
        Array(10).fill(0).map(() => ([
        Math.random() * 80 + 10,
        Math.random() * 35 + 10,
        ]))
    )
    const [dataset, setDataset] = useState(
        generateDataset()
    )
    
    useEffect(() => {
        const interval = setInterval(() => {
        setDataset(generateDataset())
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <svg viewBox="0 0 100 50">
        {dataset.map(([x, y]) => (
            <circle
            cx={x}
            cy={y}
            r="3"
            key={`${x}-${y}`}
            />
        ))}
        </svg>
    )
}