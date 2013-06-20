define(['underscore', 'jquery', 'resthub', 'conf', 'collection/streams', 'view/searchView', 'view/streamsView',
  'i18n!nls/labels',
  'hbs!template/app'],
  function(_, $, Resthub, conf, Streams, SearchView, StreamsView, labels, appTemplate) {

    return Resthub.View.extend({
      /* Default values */
      template        : appTemplate,
      labels          : labels,
      search          : {
        form      : null,
        input     : null,
        mode      : '',
        collection: new Streams(),
        last      : ''
      },
      streams         : {
        collection: new Streams()
      },
      /** Initialisation */
      initialize      : function() {
        //view render
        this.render();
        //subviews render
        new SearchView({root: '.bloc-search-list', collection: this.search.collection}).render();
        new StreamsView({root: '.bloc-streams-list', collection: this.streams.collection}).render();
        //Init search form
        this.search.form = this.$('.bloc-search');
        this.search.input = this.search.form.find('input');
        //Events
        this.on('search:changeMode', this.searchChangeMode);
        //init search mode
        this.trigger('search:changeMode', 'meta');
      },
      events          : {
        'keyup input'        : 'searchQuery',
        'click [data-mode]'  : 'modeClick',
        'click [data-close]' : 'searchClean',
        'click [data-add]'   : 'addStream',
        'click [data-remove]': 'removeStream'
      },
      /**
       * Change the mode of searching
       * @param mode string [meta, field, id]
       */
      searchChangeMode: function(mode) {
        this.search.mode = mode;
        this.search.form.find('button').removeClass('btn-info');
        this.search.form.find('button[data-mode="' + mode + '"]').addClass('btn-info');
      },
      /** When a button is clicked to change the mode */
      modeClick       : function(event) {
        this.trigger('search:changeMode', $(event.target).data('mode'));
        this.search.input.focus();
        this.searchQuery();
      },
      /** Clean the input */
      searchClean     : function() {
        this.search.input.val('');
        this.search.collection.reset();
      },
      /** Request SmartData search api */
      searchQuery     : function() {
        //Retrieve input value
        var query = this.search.input.val();
        if(query != '') {
          //Init ajax parameters
          var params = {
            url : conf.searchUrl,
            type: 'POST',
            data: {size: 6}
          };
          //adding the request to the parameters
          params.data[this.search.mode] = query;
          //exec the request
          $.ajax(params)
            .done(_.bind(function(data) {
              //Reset the collection with the new list
              this.search.collection.reset(data.results);
            }, this))
            .fail(_.bind(function() {
              //empty the collection
              this.search.collection.reset();
            }, this));
        }
        // If the input is empty
        else {
          this.searchClean();
        }
      },
      /** Add a stream to the selection list */
      addStream       : function(event) {
        //Retrieve the id in button data
        var id = $(event.target).data('add');
        //Retrieve the stream in the search list
        var stream = this.search.collection.get(id);
        //Add to the selection list
        this.streams.collection.add(stream);
      },
      /** Remove a stream from the selection list */
      removeStream    : function(event) {
        //Retrieve the id
        var id = $(event.target).data('remove');
        //Remove the stream
        this.streams.collection.remove(id);
      }
    })
      ;
  })
;
