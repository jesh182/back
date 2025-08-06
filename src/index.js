const express = require("express");
const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server-express");

const { PORT } = require("./consts");
const typeDefs = require("./schemas/schema");
const resolvers = require("./schemas/resolvers");
const models = require("./db/models");

dotenv.config();

const initServer = async () => {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers, context: { models } });
  try {
    await models.sequelize.authenticate();
    await models.sequelize.sync();
    console.log("Connection to database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  await server.start();
  server.applyMiddleware({ app });
  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  app.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

initServer();
