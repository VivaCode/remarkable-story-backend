
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', users => {
        users.increments();

        users.string('username', 255).notNullable().unique();
        users.string('password', 255).notNullable();
        users.string('country', 100).notNullable();
        users.string('title', 50).notNullable();
        users.string('email', 255).notNullable();
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  
};
