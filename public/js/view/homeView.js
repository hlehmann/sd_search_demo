define(['jquery', 'resthub', 'conf', 'collection/search', 'collection/selection', 'view/searchView',
  'view/selectionView', 'view/joinView', 'i18n!nls/labels', 'hbs!template/home'],
  function($, Resthub, conf, Search, Selection, SearchView, SelectionView, JoinView, labels, homeTemplate) {

    return Resthub.View.extend({
      /* Default values */
      template        : homeTemplate,
      labels          : labels,
      search          : {
        form      : null,
        input     : null,
        mode      : '',
        collection: new Search()
      },
      selection       : {
        collection: new Selection()
      },
      /** Initialisation */
      initialize      : function() {
        //view render
        this.render();
        //subviews render
        new SearchView({root: '.bloc-search-list', collection: this.search.collection}).render();
        new SelectionView({root: '.bloc-streams-list', collection: this.selection.collection}).render();
        new JoinView({root: '.bloc-join', collection: this.selection.collection}).render();
        //Init search form
        this.search.form = this.$('.bloc-search');
        this.search.input = this.search.form.find('input');
        this.searchChangeMode('meta');
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
        this.searchChangeMode($(event.target).data('mode'));
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
        if(query !== '') {
          this.search.collection.fetch(query, this.search.mode);
        }
        // If the input is empty
        else {
          this.searchClean();
        }
      },
      /** Add a stream to the selection list */
      addStream       : function(event) {
        if(this.selection.collection.length < 2) {
          //Retrieve the id in button data
          var id = $(event.target).data('add');
          //Retrieve the stream in the search list
          var stream = this.search.collection.get(id);
          //Add to the selection list
          this.selection.collection.add(stream);
        }
        else {
          alert(labels.selection.max2);
        }
      },
      /** Remove a stream from the selection list */
      removeStream    : function(event) {
        //Retrieve the id
        var id = $(event.target).data('remove');
        //Remove the stream
        this.selection.collection.remove(id);
      }
    });
  });