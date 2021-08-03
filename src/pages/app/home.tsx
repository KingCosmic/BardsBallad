import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Layout from '../../components/Layout'
import PostCard from '../../components/Home/PostCard'
import SEO from '../../components/seo'

function Creations({ data }) {
  const posts = data.allGhostPost.edges;

  return (
    <Layout>
      <SEO title='news' />
      <div className='grid gap-4 grid-cols-4 w-full h-full p-4'>
        {posts.map(({ node }) =>
          // The tag below includes the markup for each post - components/common/PostCard.js
          <PostCard key={node.id} post={node} />
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query homePageQuery {
    allGhostPost(sort: { order: DESC, fields: [published_at] }) {
      edges {
        node {
          id
          slug
          title
          html
          published_at
          feature_image
          excerpt
          tags {
            id
            slug
          }
          primary_tag {
            id
            slug
          }
          primary_author {
            profile_image
            id
            slug
          }
        }
      }
    }
  }
`

export default Creations
