const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    skills: [Skill]!
    skill(id: ID!): Skill
    sessions: [Session]!
    session(id: ID!): Session
    # Queries for the current user
    me: User
  }

  type Skill {
    id: ID!
    name: String
    user: User!
  }

  type Link {
    id: ID!
    url: String!
    desc: String
  }

  type User {
    id: ID!
    email: String!
    skills: [Skill!]!
    sessions: [Session!]!
  }

  type Session {
    name: String
    skills: [Skill!]!
    links: [Link!]!
    details: String
    user: User!
  }

  type Mutation {
    # if false, insert session failed -- check errors
    insertSession(
      name: String
      links: [ID]!
      details: String
      skills: [ID]!
    ): SessionUpdateResponse!

    # if false, remove failed -- check errors
    removeSession(sessionId: ID!): SessionUpdateResponse!

    #
    insertSkill(name: String!): SkillUpdateResponse!
    removeSkill(skillId: ID!): SkillUpdateResponse!

    login(email: String): String # login token
  }

  type SessionUpdateResponse {
    success: Boolean!
    message: String
    Skills: [Skill]
  }

  type SkillUpdateResponse {
    success: Boolean!
    message: String
    id: ID!
  }
`;

module.exports = typeDefs;
