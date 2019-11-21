const { DataSource } = require("apollo-datasource");
const isEmail = require("isemail");

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }
  async getAllSkills({}) {
    const skills = await this.store.skills.findAll({});
    return skills ? skills : null;
  }
  async getSkillByID({ skillId: skillArg }) {
    const skills = await this.store.skills.findOne({
      where: {
        id: skillArg
      },
      order: [["createdAt", "DESC"]]
    });
    return skills && skills[0] ? skills[0] : null;
  }
  async insertSkill({ name }) {
    const userId = this.context.user.id;
    if (!userId) return;
    const res = await this.store.skills.create({ name, userId: userId });
    return res ? { id: res.id, success: 1, message: "good stuff" } : null;
  }
}

module.exports = UserAPI;
