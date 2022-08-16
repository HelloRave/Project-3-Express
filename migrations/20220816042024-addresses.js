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
  return db.createTable('addresses', {
    address_id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    address_line_1: {
      type: 'string',
      length: 500,
      notNull: true
    },
    address_line_2: {
      type: 'string',
      length: 500
    },
    country: {
      type: 'string',
      length: 200,
      notNull: true
    },
    state: {
      type: 'string',
      length: 200
    },
    city: {
      type: 'string',
      length: 200
    },
    postal_code: {
      type: 'string',
      length: 20,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('addresses');
};

exports._meta = {
  "version": 1
};
