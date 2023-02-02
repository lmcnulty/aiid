const { ObjectID } = require('bson');

const Translator = require('../../../src/utils/Translator');

const reports = [
  {
    _id: new ObjectID('60dd465f80935bc89e6f9b01'),
    authors: ['Alistair Barr'],
    date_downloaded: '2019-04-13',
    date_modified: '2020-06-14',
    date_published: '2015-05-19',
    date_submitted: '2019-06-01',
    description: 'Description of report 1',
    epoch_date_downloaded: 1555113600,
    epoch_date_modified: 1592092800,
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    image_url: 'http://url.com',
    language: 'en',
    report_number: 1,
    source_domain: 'blogs.wsj.com',
    submitters: ['Roman Yampolskiy'],
    tags: [],
    text: 'Report 1 **text**',
    plain_text: 'Report 1 text',
    title: 'Report 1 title',
    url: 'https://url.com/stuff',
  },
  {
    _id: new ObjectID('60dd465f80935bc89e6f9b02'),
    authors: ['Alistair Barr'],
    date_downloaded: '2019-04-13',
    date_modified: '2020-06-14',
    date_published: '2015-05-19',
    date_submitted: '2019-06-01',
    description: 'Description of report 2',
    epoch_date_downloaded: 1555113600,
    epoch_date_modified: 1592092800,
    epoch_date_published: 1431993600,
    epoch_date_submitted: 1559347200,
    image_url: 'http://url.com',
    language: 'es',
    report_number: 2,
    source_domain: 'blogs.wsj.com',
    submitters: ['Roman Yampolskiy'],
    tags: [],
    text: 'Report 2 **text**',
    plain_text: 'Report 2 text',
    title: 'Report 2 title',
    url: 'https://url.com/stuff',
  },
];

describe('Translations', () => {
});
