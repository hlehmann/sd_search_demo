define({
  title    : 'Démo de l\'API Search',
  subtitle : 'Ceci est un exemple d\'utilisation de l\'api Out de SmartData.',
  step1    : 'I - Sélectionnez deux DataStreams',
  step2    : 'II - Effectuer une jointure',
  step3    : 'III - Enregistrer la jointure',
  form     : {
    searchMeta       : 'Par Description',
    searchField      : 'Par Champ',
    searchId         : 'Par Id',
    searchPlaceHolder: 'Rechercher des DataStreams publics'
  },
  search   : {
    by     : 'Par',
    created: 'Création :'
  },
  selection: {
    fields: 'Champs :'
  },
  options  : {
    join         : 'Jointure',
    joinExec     : 'Exécuter',
    joinTest     : 'Echantillon',
    joinCompleted: 'Terminé : %s contenus générés.',
    joinBetween  : 'Jointure entre %s et %s',
    noStream     : 'Veuillez sélectionner deux DataStreams.',
    available    : 'Sélectionnez les champs à comparer.'
  },
  result   : {
    view                    : 'Voir le résultat',
    noData                  : 'Aucune donnée générée',
    save                    : 'Enregister',
    downloadJSON            : 'Télécharger dans un fichier JSON',
    download                : 'Télécharger',
    datasource              : 'Enregistrer dans SmartData :',
    addStream               : 'Ajouter également un nouveau DataStream',
    user                    : 'Utilisateur',
    password                : 'Mot de passe',
    saveBtn                 : 'Enregistrer le DataSource',
    dataSourceCreationFailed: 'Erreur lors de la création du DataSource :',
    dataStreamCreationFailed: 'Erreur lors de la création du DataStream :',
    sendDataFailed          : 'Erreur lors de l\'envoi des données :',
    saving                  : 'Enregistrement...',
    saved                   : 'Création d\'un DataSource terminé : ',
    streamSaved             : 'Création d\'un DataStream terminé : '
  }
})
;