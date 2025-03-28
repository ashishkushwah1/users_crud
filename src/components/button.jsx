import React from 'react'

const Button = ({ loading, className, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center gap-3 ${className}`}
      {...props}
    >
      {props.children}
      {loading && <div className="w-5 h-5 border-3 rounded-full border-t-transparent border-white animate-spin"></div>}
    </button>
  )
}

export default Button
