define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    default    : {
      _id    : '',
      name   : '',
      user   : {
        id       : '',
        firstname: 'dfdfdfgdf',
        lastname : 'dfgdf'
      },
      desc   : '',
      meta   : null,
      private: false,
      created: 0,
      updated: 0,
      sources: []
    },
    // Define the id attribute
    idAttribute: '_id'
  })
});