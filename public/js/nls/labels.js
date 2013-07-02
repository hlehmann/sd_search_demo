define({
  'root': {
    title    : 'Search API Demo',
    subtitle : 'This is an example of how to use the SmartData Out Api.',
    step1    : 'I - Select Two DataStreams',
    step2    : 'II - Join DataStreams',
    step3    : 'III - Save join',
    form     : {
      searchMeta       : 'By Description',
      searchField      : 'By Field',
      searchId         : 'By Id',
      searchPlaceHolder: 'Search public DataStream'
    },
    search   : {
      by     : 'By',
      created: 'Created:'
    },
    selection: {
      fields: 'Fields:'
    },
    options  : {
      join         : 'Join',
      joinExec     : 'Proceed',
      joinTest     : 'Sample',
      joinCompleted: 'Completed : %s generated content.',
      noStream     : 'Please select two DataStreams.',
      available    : 'Select the fields to compare.'
    },
    result   : {
      view                    : 'View result',
      noData                  : 'No Data generated',
      save                    : 'Save',
      downloadJSON            : 'Download in a JSON file',
      download                : 'Download',
      datasource              : 'Save into SmartData:',
      user                    : 'User',
      password                : 'Password',
      saveBtn                 : 'Save new DataSource',
      dataSourceCreationFailed: 'DataSource creation failed:',
      sendDataFailed          : 'Send data failed:',
      saving                  : 'Saving...',
      saved                   : 'Successfully saved into SmartData :'
    }
  },
  'fr'  : true
})
;