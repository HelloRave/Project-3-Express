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
  return db.createTable('orders', {
    order_id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    total_cost: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    order_date: {
      type: 'date',
      notNull: true
    },
    payment_ref: {
      type: 'string',
      length: 500,
      notNull: true
    },
    address_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_address_fk',
        table: 'addresses',
        mapping: 'address_id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    status_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_status_dk',
        table: 'statuses',
        mapping: 'status_id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_user_fk',
        table: 'users',
        mapping: 'user_id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
