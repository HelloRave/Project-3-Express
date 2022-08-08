// Setting up database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'foo',
        password: 'bar',
        database: 'protein'
    }
})

const bookshelf = require('bookshelf')(knex)

module.exports = bookshelf