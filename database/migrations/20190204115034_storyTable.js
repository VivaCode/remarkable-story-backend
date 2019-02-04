exports.up = function(knex, Promise) {
  return knex.schema.createTable("stories", story => {
    story.increments();

    story.string("title", 120).notNullable();
    story.string("description", 120).notNullable();
    story.string("story", 400).notNullable();
    story.date('date');
    story.string('country', 100).notNullable();
    story.foreign("country").references("users.country");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("stories");
};
