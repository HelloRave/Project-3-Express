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
  return db.addColumn('products', 'category_id', {
    type: 'smallint',
    unsigned: true,
    notNull: true,
    defaultValue: 1,
    foreignKey: {
      name: 'category_product_fk',
      table: 'categories',
      mapping: 'category_id',
      rules: {
        onDelete: 'cascade',
        onUpdate: 'restrict'
      }
    }
  });
};

exports.down = function(db) {
  return db.removeColumn('products', 'category_id');
};

exports._meta = {
  "version": 1
};
