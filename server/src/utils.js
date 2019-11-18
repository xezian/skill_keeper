const SQL = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/datasources/config.json")[env];

module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    let itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};

module.exports.createStore = () => {
  const db = new SQL(config.database, config.username, config.password, config);
  const users = db.define("user", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    token: SQL.STRING
  });

  const sessions = db.define("session", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    name: SQL.STRING,
    details: SQL.STRING,
    userId: SQL.INTEGER
  });

  const skills = db.define("skill", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    name: SQL.STRING,
    shared: SQL.BOOLEAN,
    userId: SQL.INTEGER
  });

  const links = db.define("link", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE
  });

  users.hasMany(sessions);
  users.hasMany(skills);
  sessions.hasMany(links);
  sessions.hasMany(skills);

  db.sync();

  return { users, sessions, skills, links };
};
