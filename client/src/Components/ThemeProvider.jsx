import React, { Children } from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({ children }) => {
    // const state = useSelector((state) => state);
    // console.log(state, "This is the state");
    const { theme } = useSelector((state) => state.theme)
    // console.log(theme, "This is the theme state");
    return (
        <div className={theme}>
            <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
                {children}
            </div>
        </div>
    )
}

export default ThemeProvider