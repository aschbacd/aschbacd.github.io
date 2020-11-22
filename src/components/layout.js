import React from "react"
import { Link } from "gatsby"
import MdHeart from 'react-ionicons/lib/MdHeart'

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Made with <MdHeart style={{verticalAlign: "-10%"}} fontSize="16px" color="red" beat={true} />
        {` `}
        by <a href="https://github.com/aschbacd">aschbacd</a>
      </footer>
    </div>
  )
}

export default Layout
