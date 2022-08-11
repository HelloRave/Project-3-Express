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
  return db.createTable('variants', {
    variant_id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    stock: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    product_image_url: {
      type: 'string',
      length: 500
    },
    product_thumbnail_url: {
      type: 'string',
      length: 500
    },
    product_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'flavours_products_product_fk',
        table: 'products',
        mapping: 'product_id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    flavour_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'flavours_products_flavour_id',
        table: 'flavours',
        mapping: 'flavour_id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('variants');
};

exports._meta = {
  "version": 1
};
