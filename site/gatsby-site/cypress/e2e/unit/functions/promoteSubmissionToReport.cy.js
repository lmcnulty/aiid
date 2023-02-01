const promoteSubmissionToReport = require('../../../../../realm/functions/promoteSubmissionToReport');

//should be on its own /cypress/unit folder or something

const submission = {
  _id: '5f9c3ebfd4896d392493f03c',
  authors: ['Nedi Bedi and Kathleen McGrory'],
  cloudinary_id: 'something',
  date_downloaded: '2020-10-30',
  date_modified: '2021-07-27',
  date_published: '2017-05-03',
  date_submitted: '2020-10-30',
  description:
    'By NEIL BEDI and KATHLEEN McGRORY\nTimes staff writers\nNov. 19, 2020\nThe Pasco Sheriff’s Office keeps a secret list of kids it thinks could “fall into a life of crime” based on factors like wheth',
  image_url: 'https://s3.amazonaws.com/ledejs/resized/s2020-pasco-ilp/600/nocco5.jpg',
  incident_date: '2015-09-01',
  incident_editors: ['Sean McGregor', 'Khoa Lam'],
  incident_id: 0,
  language: 'en',
  source_domain: 'projects.tampabay.com',
  submitters: ['Kate Perkins'],
  text: '## Submission 1 text\n\n_Markdown content!_',
  plain_text: 'Submission 1 text\n\nMarkdown content!',
  title: 'Submisssion 1 title',
  url: 'https://projects.tampabay.com/projects/2020/investigations/police-pasco-sheriff-targeted/school-data/',
  editor_notes: '',
  developers: ['AI Dev'],
  deployers: ['Youtube'],
  harmed_parties: ['Adults'],
  nlp_similar_incidents: [],
  editor_dissimilar_incidents: [],
  editor_similar_incidents: [],
  tags: [],
};

const incident = {
  AllegedDeployerOfAISystem: [],
  AllegedDeveloperOfAISystem: [],
  AllegedHarmedOrNearlyHarmedParties: [],
  __typename: 'Incident',
  date: '2018-11-16',
  description:
    'Twenty-four Amazon workers in New Jersey were hospitalized after a robot punctured a can of bear repellent spray in a warehouse.',
  editors: ['Sean McGregor', 'Khoa Lam'],
  incident_id: 1,
  nlp_similar_incidents: [],
  reports: [1, 2],
  title: '24 Amazon workers sent to hospital after robot accidentally unleashes bear spray',
};

describe('Functions', () => {
});
