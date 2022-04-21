import { forwardRef, useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  useImperativeHandle(ref, () => {
    return {
      close: () => setVisible(false)
    }
  })

  return (
    <div>
      <div style = {hideWhenVisible}>
        <button onClick = {() => setVisible(!visible)}>{props.label}</button>
      </div>
      <div style = {showWhenVisible}>
        {props.children}
        <button onClick = {() => setVisible(!visible)}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  label: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable