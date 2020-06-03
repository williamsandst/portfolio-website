import React, { Component } from "react";
import { Link } from "gatsby";

import styled from "@emotion/styled"
import _ from "lodash";

import "../layout/layout.css";

/*a {
  display: inline-block;
}
span {
  display: inline-block;
  padding: 0.3rem 0.5rem;
  background: $light;
  border-radius: $border-radius;
  color: lighten($font-color, 10%);
  font-size: 0.8rem;
  font-weight: 400;
  margin: 0 0.5rem 0.5rem 0;

  .count {
    color: $primary-color;
    font-weight: 700;
    margin-left: 0.25rem;
  }

  &:hover,
  &:active,
  &:focus {
    background: darken($light, 5%);
    color: $font-color;
  }*/

const TagContainerCSS = styled.div`
display: inline-block; 
padding: 0.2rem 0.5rem; 
margin: 0 0.5rem 0.5rem 0; 
background-color: var(--button); 
border-radius: 6px; font-size: 80%;
&:hover {
  background: var(--buttondown); 
  color: var(--textNormal);
} 

a {
    color: var(--textNormal);
}
`

class ProjectTagContainer extends Component {
  render() {
    const tag = this.props.tag;
    const toPath = (tag.tagType )
    return (
      <TagContainerCSS>
        <Link
              key={tag}
              style={{ textDecoration: "none" }}
              to={`/project-tags/${_.kebabCase(tag)}`}
            >
              {tag}
          </Link>
      </TagContainerCSS>
    );
  }
}

// Component for listing the tags of a project/blog post
class ProjectPostTags extends Component {
  render() {
    const { tags } = this.props;
    return (
      <div className="post-tag-container">
        {tags &&
          tags.map(tag => (
            <ProjectTagContainer tag={tag}>
            </ProjectTagContainer>
          ))}
      </div>
    );
  }
}

export default ProjectPostTags;
