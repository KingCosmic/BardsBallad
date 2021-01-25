import React from "react"

import SEO from "../components/seo"

// TODO: add in the theme provider and everything
// and a location check with some regex to see if perhaps a loading
// can be shown while it loads the correct page (to fix our issue
// with routes leading to 404)

const NotFoundPage = () => (
  <div>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </div>
)

export default NotFoundPage
