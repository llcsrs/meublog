import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { getImage } from "gatsby-plugin-image"

import * as S from "./styled"

const Avatar = () => {
  const { avatarImage } = useStaticQuery(
    graphql`
      query {
        avatarImage: file(relativePath: { eq: "profile-photo.png" }) {
          childImageSharp {
            gatsbyImageData(width: 60, placeholder: TRACED_SVG, layout: CONSTRAINED)
          }
        }
      }
    `
  )

  const image = getImage(avatarImage)

  return <S.AvatarWrapper image={image} alt="Profile Avatar" />
}

export default Avatar
