'use client'

import { createContext, useState, useContext } from 'react'

const HeaderContext = createContext()

export function HeaderProvider({ children }) {
  const [visible, setVisible] = useState(true)
  const toggleHeader = () => setVisible(prev => !prev)
  
  return (
    <HeaderContext.Provider value={{ visible, toggleHeader }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  return useContext(HeaderContext)
}