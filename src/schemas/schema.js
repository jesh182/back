const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String
    author: User!
    published: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(name: String!, email: String): User!
    createPost(
      title: String!
      content: String
      userId: ID!
      published: Boolean!
    ): Post!
    updatePost(
      id: ID!
      title: String
      content: String
      published: Boolean
    ): Post
    deletePost(id: ID!): Post
  }

  type Subscription {
    postAdded: Post!
    userCreated: User!
  }
`;

module.exports = typeDefs;
