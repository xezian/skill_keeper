module.exports = {
  Query: {
    skills: (_, __, { dataSources }) => dataSources.userAPI.getAllSkills(),
    skill: (_, { id }, { dataSources }) =>
      dataSources.userAPI.getSkillByID({ skillId: id }),
    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString("base64");
    },
    insertSkill: (_, { name }, { dataSources }) =>
      dataSources.userAPI.insertSkill(name)
  }
};
