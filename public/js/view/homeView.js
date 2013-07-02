define(['jquery', 'resthub',
  'collection/search', 'collection/selection',
  'view/searchView', 'view/selectionView', 'view/joinView',
  'i18n!nls/labels', 'hbs!template/home'],
  function($, Resthub, Search, Selection, SearchView, SelectionView, JoinView, labels, homeTemplate) {

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
        new SearchView({root: '.bloc-search-list', collection: this.search.collection});
        new SelectionView({root: '.bloc-selection-list', collection: this.selection.collection});
        new JoinView({root: '.bloc-join', collection: this.selection.collection});
        //Init search form
        this.search.form = this.$('.bloc-search');
        this.search.input = this.search.form.find('input');
        //init search mode to 'meta'
        this.searchChangeMode('meta');
      },
      events          : {
        'keyup #input-search'      : 'searchQuery',
        'click button[data-mode]'  : 'modeButtonClick',
        'click button[data-close]' : 'searchClean',
        'click button[data-add]'   : 'addStream',
        'click button[data-remove]': 'removeStream'
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
      modeButtonClick : function(event) {
        this.searchChangeMode($(event.currentTarget).data('mode'));
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
        //Retrieve the id in button data
        var id = $(event.currentTarget).data('add');
        //Retrieve the stream in the search list
        var stream = this.search.collection.get(id);
        //Add to the selection list
        this.selection.collection.add(stream);
      },
      /** Remove a stream from the selection list */
      removeStream    : function(event) {
        //Retrieve the id
        var id = $(event.currentTarget).data('remove');
        //Remove the stream
        this.selection.collection.remove(id);
      }
    });
  });
