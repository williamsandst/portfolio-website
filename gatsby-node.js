/* eslint "no-console": "off" */

const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const siteConfig = require("./data/SiteConfig");

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  let slug;
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    } else if (parsedFilePath.name !== "index" && parsedFilePath.dir !== "") {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    } else if (parsedFilePath.dir === "") {
      slug = `/${parsedFilePath.name}/`;
    } else {
      slug = `/${parsedFilePath.dir}/`;
    }

    if (Object.prototype.hasOwnProperty.call(node, "frontmatter")) {
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "slug"))
        slug = `/${_.kebabCase(node.frontmatter.slug)}`;
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "date")) {
        const date = moment(node.frontmatter.date, siteConfig.dateFromFormat);
        if (!date.isValid)
          console.warn(`WARNING: Invalid date.`, node.frontmatter);

        createNodeField({ node, name: "date", value: date.toISOString() });
      }
    }
    createNodeField({ node, name: "slug", value: slug });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPostPage = path.resolve("src/templates/blog-post.jsx");
  const projectPostPage = path.resolve("src/templates/project-post.jsx");
  const tagPage = path.resolve("src/templates/tag.jsx");
  const categoryPage = path.resolve("src/templates/category.jsx");

  // Get a full list of markdown posts
  const markdownQueryResult = await graphql(`
   {
    blogPosts: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/(blog)/"  }}) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
                category
                date
              }
            }
          }
        }
    projectPosts: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/(projects)/"  }}) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
              category
              date
            }
          }
        }
      }
    }
  `);

  if (markdownQueryResult.errors) {
    console.error(markdownQueryResult.errors);
    throw markdownQueryResult.errors;
  }

  const tagSet = new Set();
  const categorySet = new Set();

  const blogPostsEdges = markdownQueryResult.data.blogPosts.edges;
  const projectPostsEdges = markdownQueryResult.data.projectPosts.edges;

  // Sort posts
  blogPostsEdges.sort((postA, postB) => {
    const dateA = moment(
      postA.node.frontmatter.date,
      siteConfig.dateFromFormat
    );

    const dateB = moment(
      postB.node.frontmatter.date,
      siteConfig.dateFromFormat
    );

    if (dateA.isBefore(dateB)) return 1;
    if (dateB.isBefore(dateA)) return -1;

    return 0;
  });

  // Sort posts
  projectPostsEdges.sort((postA, postB) => {
    const dateA = moment(
      postA.node.frontmatter.date,
      siteConfig.dateFromFormat
    );

    const dateB = moment(
      postB.node.frontmatter.date,
      siteConfig.dateFromFormat
    );

    if (dateA.isBefore(dateB)) return 1;
    if (dateB.isBefore(dateA)) return -1;

    return 0;
  });

  // Post page creating
  blogPostsEdges.forEach((edge, index) => {
    // Generate a list of tags
    if (edge.node.frontmatter.tags) {
      edge.node.frontmatter.tags.forEach(tag => {
        tagSet.add(tag);
      });
    }

    // Generate a list of categories
    if (edge.node.frontmatter.category) {
      categorySet.add(edge.node.frontmatter.category);
    }

    createPage({
      path: edge.node.fields.slug,
      component: blogPostPage,
      context: {
        slug: edge.node.fields.slug,
      }
    });
  });

  projectPostsEdges.forEach((edge, index) => {
    // Generate a list of tags
    if (edge.node.frontmatter.tags) {
      edge.node.frontmatter.tags.forEach(tag => {
        tagSet.add(tag);
      });
    }

    // Generate a list of categories
    if (edge.node.frontmatter.category) {
      categorySet.add(edge.node.frontmatter.category);
    }

    createPage({
      path: edge.node.fields.slug,
      component: projectPostPage,
      context: {
        slug: edge.node.fields.slug,
      }
    });
  });

  //  Create tag pages
  tagSet.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagPage,
      context: { tag }
    });
  });

  // Create category pages
  categorySet.forEach(category => {
    createPage({
      path: `/categories/${_.kebabCase(category)}/`,
      component: categoryPage,
      context: { category }
    });
  });
};
