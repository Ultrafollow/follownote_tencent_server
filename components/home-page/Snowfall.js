'use client'
import Snowfall from 'react-snowfall';      

export default function SnowfallComponent() {
    return (<Snowfall
        color = '#FFC8B4'
        snowflakeCount={60}
        style={{
            zIndex: -1,
            width: '100vw',
            height: '100vh',
            position: 'fixed',
        }}
        />)
}