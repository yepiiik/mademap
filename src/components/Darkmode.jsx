import React, { useState, useEffect } from 'react'
import { isDarkThemePrefered } from '../config/base'

function Darkmode() {
  const [darkmode, setDarkmode] = useState(isDarkThemePrefered)

  useEffect(() => {
    const body = document.querySelector('body');
    body.setAttribute('theme', darkmode ? 'dark' : 'light');
    if (darkmode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    console.log(darkmode)
  }, [darkmode])

  return (
    <button className='darkmode_btn' onClick={() => {setDarkmode(!darkmode); console.log(!darkmode)}}>Dark/Light</button>
  )
}

export default Darkmode