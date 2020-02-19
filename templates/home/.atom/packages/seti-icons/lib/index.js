'use babel'

const { CompositeDisposable } = require('atom')
const disposables = new CompositeDisposable

const toggle = ( enable, text ) => {
  const body = document.querySelector('body')

  if ( enable ) {
    body.className = `${body.className} ${text}`
  } else {
    body.className = body.className.replace(` ${text}`, '')
  }
}

export const activate = () => {
  disposables.add(
    atom.config.observe('seti-icons.noColor', value =>
      toggle(value, 'seti-icons-no-color')
    )
  )

  // Removes removed setting
  atom.config.unset('seti-icons.iconsPlus')
}

export const deactivate = () => disposables.dispose()
