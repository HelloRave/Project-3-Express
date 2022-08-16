'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('statuses', {
    status_id: {
      type: 'smallint',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    status_name: {
      type: 'string',
      length: 50,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('statuses');
};

exports._meta = {
  "version": 1
};
