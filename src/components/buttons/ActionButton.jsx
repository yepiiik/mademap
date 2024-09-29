import React from 'react'
import style from './ActionButton.module.css'

function ActionButton({children, ...props}) {
  return (
    <button className={style.ActionButton} style={{width: '100%'}} {...props}>{children}</button>
  )
}

export default ActionButton