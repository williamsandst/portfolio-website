import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image"

class ProjectListing extends React.Component {
  getPostList() {
    const postList = [];
    this.props.postEdges.forEach(postEdge => {
      postList.push({
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.fields.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      });
    });
    return postList;
  }

  render() {
    const postList = this.getPostList();
    console.log(postList);
    return (
      <div>
        {/* Your post list here. */
        postList.map(post => (
          <div>
            <Link to={post.path} key={post.title}>
              <h1>{post.title}</h1>
            </Link>
            <Img
            className="project-cover"
            fixed={post.cover.childImageSharp.fixed}
            alt="cover"
            />
          </div>
        ))}
      </div>
    );
  }
}

export default ProjectListing;
