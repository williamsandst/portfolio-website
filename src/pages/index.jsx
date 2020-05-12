import React, { Component } from "react";
import Helmet from "react-helmet";
import MainLayout from "../layout/layout";
import Header from "../layout/header";
import config from "../../data/SiteConfig";
import SEO from "../components/SEO/SEO";
import ProjectListing from "../components/ProjectListing/ProjectListing";
import AboutShort from "../components/About/AboutShort";

class HomePage extends React.Component {
    render() {
      const postEdges = this.props.data.allMarkdownRemark.edges;
      return (
        <MainLayout>
        <Helmet title={config.siteTitle} />
        <SEO />
        <Header>
          <div className="landing-container">
            <AboutShort></AboutShort>
            <div className="posts-container">
              <ProjectListing postEdges={postEdges} />
            </div>
          </div>
          </Header>
        </MainLayout>
      );
    }
  }
  
  export default HomePage;
  
  /* eslint no-undef: "off" */
  // Show only pinned projects
  export const pageQuery = graphql`
    query IndexQuery {
      allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/(projects)/"  }, frontmatter:{ tags: { in: ["pinned"] } }}, sort: { fields: [fields___date], order: DESC })
      {
        edges {
          node {
            fields {
              slug
              date
            }
            excerpt
            timeToRead
            frontmatter {
              title
              tags
              cover {
                childImageSharp {
                fixed(width: 274, height: 365, quality:90) {
                  ...GatsbyImageSharpFixed
                    }
                }
              }
              date
            }
          }
        }
      }
    }
  `;
  