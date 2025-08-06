const resolvers = {
  Query: {
    async users(root, args, { models }) {
      return models.User.findAll();
    },
    async user(root, { id }, { models }) {
      return models.User.findByPk(id);
    },
    async posts(root, args, { models }) {
      return models.Post.findAll();
    },
    async post(root, { id }, { models }) {
      return models.Post.findByPk(id, {
        include: [{ model: models.User, as: "author" }],
      });
    },
  },
  Mutation: {
    async createUser(root, { name, email }, { models }) {
      try {
        const user = await models.User.create({
          name,
          email,
        });
        console.info("User created:", user.dataValues);
        return user;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },
    async createPost(root, { userId, title, content, published }, { models }) {
      try {
        const post = await models.Post.create({
          userId,
          title,
          content,
          published,
        });
        console.info("Post created:", post.dataValues);
        return post;
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    },
    async updatePost(root, { id, title, content, published }, { models }) {
      try {
        const post = await models.Post.findByPk(id);
        if (!post) throw new Error("Post not found");

        const postUpdated = await post.update({ title, content, published });
        console.info("Post updated:", postUpdated.dataValues);
        return postUpdated;
      } catch (error) {
        console.error("Error updating post, id: ", id, error);
        throw error;
      }
    },
    async deletePost(root, { id }, { models }) {
      try {
        const post = await models.Post.findByPk(id);
        if (!post) throw new Error("Post not found");

        const postDeleted = await post.destroy();
        console.info("Post deleted:", postDeleted.dataValues);

        return postDeleted;
      } catch (error) {
        console.error("Error deleting post, id: ", id, error);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
