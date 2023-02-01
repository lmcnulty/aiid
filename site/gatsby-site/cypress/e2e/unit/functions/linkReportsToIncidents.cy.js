const linkReportsToIncidents = require('../../../../../realm/functions/linkReportsToIncidents');

//should be on its own /cypress/unit folder or something

const incident_1 = {
  AllegedDeployerOfAISystem: [],
  AllegedDeveloperOfAISystem: [],
  AllegedHarmedOrNearlyHarmedParties: [],
  date: '2018-11-16',
  description: 'Description 1',
  incident_id: 1,
  nlp_similar_incidents: [],
  reports: [1, 2],
  title: 'Title 1',
  embedding: {
    vector: [1, 2, 3],
    from_reports: [1, 2],
  },
};

const incident_2 = {
  AllegedDeployerOfAISystem: [],
  AllegedDeveloperOfAISystem: [],
  AllegedHarmedOrNearlyHarmedParties: [],
  date: '2018-11-16',
  description: 'Description 2',
  incident_id: 2,
  nlp_similar_incidents: [],
  reports: [3],
  title: 'Title 2',
  embedding: {
    vector: [4, 5],
    from_reports: [3],
  },
};

const report_1 = {
  report_number: 1,
  title: 'Report 1',
  embedding: {
    vector: [1, 2, 3, 4],
  },
};

const report_2 = {
  report_number: 2,
  title: 'Report 2',
  embedding: {
    vector: [6, 7, 8],
  },
};

const report_3 = {
  report_number: 3,
  title: 'Report 3',
  embedding: {
    vector: [10],
  },
};

describe('Functions', () => {
});
