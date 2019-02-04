exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "IloveHelping",
          password: "helpinghands",
          country: "Peru",
          title: "Head Helper",
          email: "helpinghandsperson1@email.com"
        },
        {
          username: "BongSau",
          password: "helpinghands",
          country: "China",
          title: "Head Honcho",
          email: "bongsau@email.com"
        },
        {
          username: "IhelpInphIlIppInes",
          password: "helpinghands",
          country: "Philippines",
          title: "Helper",
          email: "helpingphi@email.com"
        }
      ]);
    });
};
