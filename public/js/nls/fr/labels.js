define({
  title   : 'Démo de l\'API Search',
  subtitle: 'Ceci est un exemple d\'utilisation de l\'api Out de SmartData.',
  step1   : 'I - Sélectionnez les DataStreams',
  step2   : 'II - Sélectionnez une opération',
  form    : {
    searchMeta       : 'Par Description',
    searchField      : 'Par Champ',
    searchId         : 'Par Id',
    searchPlaceHolder: 'Rechercher des DataStreams publics'
  },
  search  : {
    by: 'Par',
      created : 'Création :'
    },
    selection: {
      fields: 'Champs :',
      max2  : 'Vous ne pouvez choisir que deux DataStreams.'
    },
    options:{
      join:'Jointure',
      exec:'Exécuter',
      noStream: 'Veuillez sélectionner deux DataStreams.'
  }
})
;