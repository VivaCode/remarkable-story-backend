
exports.up = function(knex, Promise) {
  return knex.schema.createTable('donations', donate => {
      donate.increments();

      donate.integer('amount').unsigned().notNullable();
      donate.integer('user_id').unsigned();
      donate.string('comment', 120);
      donate.string('name')
      donate.string('country', 120).notNullable();

      donate.foreign('name').references('users.username')
      donate.foreign('user_id').references('users.id')
      donate.foreign('country').references('users.country')
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('donations')
  
};
