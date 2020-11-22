/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useState, useEffect } from "react"
import axios from "axios"

import IosPin from 'react-ionicons/lib/IosPin'
import MdBriefcase from 'react-ionicons/lib/MdBriefcase'
import IosGlobeOutline from 'react-ionicons/lib/IosGlobeOutline'
import LogoTwitter from 'react-ionicons/lib/LogoTwitter'
import LogoGitHub from 'react-ionicons/lib/LogoGitHub'

const Bio = props => {
  useEffect(() => {
    if (props.username && author.login !== props.username) {
      axios
      .get("https://api.github.com/users/" + props.username)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data)
          setAuthor(res.data)
        } else {
          setAuthor({login: props.username})
        }
      })
      .catch(error => {
        setAuthor({login: props.username})
      });
    }
  });

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const [author, setAuthor] = useState({name: "default"});

  return (
    <div className="bio">
      {author.avatar_url && (
        <img
          src={author.avatar_url}
          alt={author?.name || ``}
          className="bio-avatar"
          style={{
            borderRadius: "50%",
            height: 50,
            width: 50
          }}
        />
      )}
      {author?.name && (
        <p>
          Written by <strong>{author.name}</strong><br/>
          {author?.location && (
            <span style={{marginRight: 5}}>
              <IosPin style={{verticalAlign: "-2%"}} fontSize="16px" color="#333" />
              {author.location}
            </span>
          )}
          {author?.company && (
            <span style={{marginRight: 5}}>
              <MdBriefcase style={{verticalAlign: "-7%", marginRight: 2}} fontSize="16px" color="#333" />
              {author.company}
            </span>
          )}
          {author?.blog && (
            <span style={{marginRight: 5}}>
              <a href={author.blog} target="_blank" rel="noreferrer">
                <IosGlobeOutline style={{verticalAlign: "-7%", marginRight: 2}} fontSize="16px" color="#333" />
              </a>
            </span>
          )}
          {author?.login && (
            <span style={{marginRight: 5}}>
              <a href={"https://github.com/" + author.login} target="_blank" rel="noreferrer">
                <LogoGitHub style={{verticalAlign: "-7%", marginRight: 2}} fontSize="16px" color="#333" />
              </a>
            </span>
          )}
          {author?.twitter_username && (
            <span style={{marginRight: 5}}>
              <a href={"https://twitter.com/" + author.twitter_username} target="_blank" rel="noreferrer">
                <LogoTwitter style={{verticalAlign: "-7%", marginRight: 2}} fontSize="16px" color="#333" />
              </a>
            </span>
          )}
        </p>
      )}
    </div>
  )
}

export default Bio
