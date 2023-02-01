import createCitationPages from '../../../../page-creators/createCitationPages';

const response = {
  data: {
    allMongodbAiidprodIncidents: {
      nodes: [
        {
          incident_id: 1,
          title: 'Google’s YouTube Kids App Presents Inappropriate Content',
          date: '2015-05-19',
          reports: [1, 2],
          editor_similar_incidents: [],
          editor_dissimilar_incidents: [],
          flagged_dissimilar_incidents: [],
          description:
            'YouTube’s content filtering and recommendation algorithms exposed children to disturbing and inappropriate videos.',
          nlp_similar_incidents: [
            {
              incident_id: 55,
              similarity: 0.9990941882133484,
            },
            {
              incident_id: 15,
              similarity: 0.9989638924598694,
            },
            {
              incident_id: 34,
              similarity: 0.998900830745697,
            },
          ],
        },
      ],
    },
    allMongodbAiidprodReports: {
      nodes: [
        {
          title: 'Google’s YouTube Kids App Criticized for ‘Inappropriate Content’',
          report_number: 1,
          language: 'en',
          image_url:
            'http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_20150518174822.jpg',
          cloudinary_id:
            'reports/si.wsj.net/public/resources/images/BN-IM269_YouTub_P_20150518174822.jpg',
        },
        {
          title: 'YouTube Kids app is STILL showing disturbing videos',
          report_number: 2,
          language: 'en',
          image_url:
            'https://i.dailymail.co.uk/i/pix/2018/02/06/15/48EEE02F00000578-0-image-a-18_1517931140185.jpg',
          cloudinary_id:
            'reports/i.dailymail.co.uk/i/pix/2018/02/06/15/48EEE02F00000578-0-image-a-18_1517931140185.jpg',
        },
      ],
    },
  },
  extensions: {},
};

const languages = [
  {
    code: 'en',
    hrefLang: 'en-US',
    name: 'English',
    localName: 'English',
    langDir: 'ltr',
    dateFormat: 'MM/DD/YYYY',
  },
  {
    code: 'es',
    hrefLang: 'es',
    name: 'Spanish',
    localName: 'Español',
    langDir: 'ltr',
    dateFormat: 'DD-MM-YYYY',
  },
  {
    code: 'fr',
    hrefLang: 'fr',
    name: 'French',
    localName: 'Français',
    langDir: 'ltr',
    dateFormat: 'DD-MM-YYYY',
  },
];

describe('createCitationPages', () => {
});
