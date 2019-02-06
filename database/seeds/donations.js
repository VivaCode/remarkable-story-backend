
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('donations').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('donations').insert([
        {amount: 2, user_id: 1, comment: '', name: '', country: 'China'},
        {amount: 2, user_id: 2, comment: '', name: '', country: 'America'},
        {amount: 2, user_id: 3, comment: '', name: '', country: 'Brazil'}
      ]);
    });
};
