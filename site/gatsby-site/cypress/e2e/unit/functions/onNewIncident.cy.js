const { SUBSCRIPTION_TYPE } = require('../../../../src/utils/subscriptions');

const onNewIncident = require('../../../../../realm/functions/onNewIncident');

const subscriptionsToNewIncidents = [
  {
    _id: '6356e39e863169c997309500',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63320ce63ec803072c9f529c',
  },
  {
    _id: '6356e39e863169c997309501',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63321072f27421740a80af29',
  },
];

const subscriptionsToNewEntityIncidents = [
  {
    _id: '6356e39e863169c997309502',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'google',
    userId: '63321072f27421740a80af23',
  },
  {
    _id: '6356e39e863169c997309503',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'facebook',
    userId: '63321072f27421740a80af24',
  },
  {
    _id: '6356e39e863169c997309504',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'tesla',
    userId: '63321072f27421740a80af25',
  },
];

const fullDocument = {
  'Alleged deployer of AI system': [],
  'Alleged developer of AI system': ['google'],
  'Alleged harmed or nearly harmed parties': ['facebook'],
  __typename: 'Incident',
  date: '2018-11-16',
  description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
  incident_id: 1,
  nlp_similar_incidents: [],
  reports: [1, 2],
  title: '24 Amazon workers sent to hospital after robot accidentally unleashes bear spray',
};

describe('Functions', () => {
});
