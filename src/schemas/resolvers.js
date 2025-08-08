const { cacheWrapper } = require('../cache');

const resolvers = {
  Query: {
    async users(root, args, { models }) {
      try {
        const data = await cacheWrapper('v1:users', () =>
          models.User.findAll({
            include: [{ model: models.Post, as: 'posts' }],
          })
        );
        return data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    async user(root, { id }, { models }) {
      try {
        const data = await cacheWrapper(`v1:user:${id}`, () =>
          models.User.findByPk(id, {
            include: [{ model: models.Post, as: 'posts' }],
          })
        );
        return data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },
    async posts(root, args, { models }) {
      try {
        const data = await cacheWrapper('v1:posts', () =>
          models.Post.findAll({
            include: [{ model: models.User, as: 'author' }],
          })
        );
        return data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    },
    async post(root, { id }, { models }) {
      try {
        const data = await cacheWrapper(`v1:post:${id}`, () =>
          models.Post.findByPk(id, {
            include: [{ model: models.User, as: 'author' }],
          })
        );
        return data;
      } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
      }
    },
  },
  Mutation: {
    async createUser(root, { name, email }, { models }) {
      try {
        const user = await models.User.create({
          name,
          email,
        });
        console.info('User created:', user.dataValues);
        return user;
      } catch (error) {
        console.error('Error creating user:', error);
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
        console.info('Post created:', post.dataValues);
        return post;
      } catch (error) {
        console.error('Error creating post:', error);
        throw error;
      }
    },
    async updatePost(root, { id, title, content, published }, { models }) {
      try {
        const post = await models.Post.findByPk(id);
        if (!post) throw new Error('Post not found');

        const postUpdated = await post.update({ title, content, published });
        console.info('Post updated:', postUpdated.dataValues);
        return postUpdated;
      } catch (error) {
        console.error('Error updating post, id: ', id, error);
        throw error;
      }
    },
    async deletePost(root, { id }, { models }) {
      try {
        const post = await models.Post.findByPk(id);
        if (!post) throw new Error('Post not found');

        const postDeleted = await post.destroy();
        console.info('Post deleted:', postDeleted.dataValues);

        return postDeleted;
      } catch (error) {
        console.error('Error deleting post, id: ', id, error);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
