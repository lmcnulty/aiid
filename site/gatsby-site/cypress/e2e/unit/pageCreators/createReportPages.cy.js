import createReportPages from '../../../../page-creators/createReportPages';

const response = {
  data: {
    reports: {
      nodes: [
        {
          report_number: 1,
          language: 'en',
        },
        {
          report_number: 2,
          language: 'es',
        },
      ],
    },
  },
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

describe('createReportPages', () => {
});
