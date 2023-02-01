const { SUBSCRIPTION_TYPE } = require('../../../../src/utils/subscriptions');

const processNotifications = require('../../../../../realm/functions/processNotifications');

const pendingNotificationsToNewIncidents = [
  {
    _id: '63616f37d0db19c07d081300',
    type: SUBSCRIPTION_TYPE.newIncidents,
    incident_id: 217,
    processed: false,
  },
  {
    _id: '63616f82d0db19c07d081301',
    type: SUBSCRIPTION_TYPE.newIncidents,
    incident_id: 218,
    processed: false,
  },
];

const pendingNotificationsToNewEntityIncidents = [
  {
    _id: '63616f82d0db19c07d081302',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'google',
    processed: false,
  },
  {
    _id: '63616f82d0db19c07d081303',
    type: SUBSCRIPTION_TYPE.entity,
    incident_id: 219,
    entity_id: 'facebook',
    isUpdate: true,
    processed: false,
  },
];

const pendingNotificationsToIncidentUpdates = [
  {
    _id: '63616f82d0db19c07d081304',
    type: 'incident-updated',
    incident_id: 219,
    processed: false,
  },
  {
    _id: '63616f82d0db19c07d081305',
    type: 'new-report-incident',
    incident_id: 219,
    report_number: 2000,
    processed: false,
  },
];

const subscriptionsToNewIncidents = [
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63320ce63ec803072c9f5291',
  },
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.newIncidents,
    userId: '63321072f27421740a80af22',
  },
];

const subscriptionsToNewEntityIncidents = [
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'google',
    userId: '63321072f27421740a80af23',
  },
  {
    _id: '6356e39e863169c997309586',
    type: SUBSCRIPTION_TYPE.entity,
    entityId: 'facebook',
    userId: '63321072f27421740a80af24',
  },
];

const subscriptionsToIncidentUpdates = [
  {
    userId: '63320ce63ec803072c9f5291',
    type: SUBSCRIPTION_TYPE.incident,
    incident_id: 219,
  },
  {
    userId: '63321072f27421740a80af22',
    type: SUBSCRIPTION_TYPE.incident,
    incident_id: 219,
  },
];

const recipients = [
  {
    email: 'test1@email.com',
    userId: '63320ce63ec803072c9f5291',
  },
  {
    email: 'test2@email.com',
    userId: '63321072f27421740a80af22',
  },
  {
    email: 'test3@email.com',
    userId: '63321072f27421740a80af23',
  },
  {
    email: 'test4@email.com',
    userId: '63321072f27421740a80af24',
  },
];

const incidents = [
  {
    incident_id: 217,
    'Alleged developer of AI system': [],
    'Alleged deployer of AI system': [],
    'Alleged harmed or nearly harmed parties': [],
    AllegedDeployerOfAISystem: [],
    AllegedDeveloperOfAISystem: [],
    AllegedHarmedOrNearlyHarmedParties: [],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2],
    title: '217 Amazon workers sent to hospital',
  },
  {
    incident_id: 218,
    'Alleged developer of AI system': [],
    'Alleged deployer of AI system': [],
    'Alleged harmed or nearly harmed parties': [],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2],
    title: '218 Amazon workers sent to hospital',
  },
  {
    incident_id: 219,
    'Alleged developer of AI system': ['google', 'facebook'],
    'Alleged deployer of AI system': ['facebook'],
    'Alleged harmed or nearly harmed parties': ['tesla'],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2, 2000],
    title: '218 Amazon workers sent to hospital',
  },
];

const reports = [
  {
    report_number: 2000,
    title: 'Report title',
    authors: ['Pablo Costa', 'Aimee Picchi'],
  },
];

const entities = [
  {
    entity_id: 'google',
    name: 'Google',
  },
  {
    entity_id: 'facebook',
    name: 'Facebook',
  },
  {
    entity_id: 'boston-university',
    name: 'Boston University',
  },
];

const buildEntityList = (allEntities, entityIds) => {
  const entityNames = entityIds.map((entityId) => {
    const entity = allEntities.find((entity) => entity.entity_id === entityId);

    return entity
      ? `<a href="https://incidentdatabase.ai/entities/${entity.entity_id}">${entity.name}</a>`
      : '';
  });

  if (entityNames.length < 3) {
    return entityNames.join(' and ');
  }

  return `${entityNames.slice(0, -1).join(', ')}, and ${entityNames[entityNames.length - 1]}`;
};

const stubEverything = () => {
  const notificationsCollection = {
    find: (() => {
      const stub = cy.stub();

      stub
        .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.newIncidents })
        .as(`notifications.find(${SUBSCRIPTION_TYPE.newIncidents})`)
        .returns({ toArray: () => pendingNotificationsToNewIncidents });

      stub
        .withArgs({ processed: false, type: SUBSCRIPTION_TYPE.entity })
        .as(`notifications.find(${SUBSCRIPTION_TYPE.entity})`)
        .returns({ toArray: () => pendingNotificationsToNewEntityIncidents });

      stub
        .withArgs({ processed: false, type: { $in: ['new-report-incident', 'incident-updated'] } })
        .as(`notifications.find('new-report-incident', 'incident-updated')`)
        .returns({ toArray: () => pendingNotificationsToIncidentUpdates });

      return stub;
    })(),
    updateOne: cy.stub().as('notifications.updateOne').resolves(),
  };

  const subscriptionsCollection = {
    find: (() => {
      const stub = cy.stub();

      stub
        .withArgs({ type: SUBSCRIPTION_TYPE.newIncidents })
        .as(`subscriptions.find("${SUBSCRIPTION_TYPE.newIncidents}")`)
        .returns({ toArray: () => subscriptionsToNewIncidents });

      for (const pendingNotification of pendingNotificationsToNewEntityIncidents) {
        stub
          .withArgs({ type: SUBSCRIPTION_TYPE.entity, entityId: pendingNotification.entity_id })
          .as(
            `subscriptions.find("${SUBSCRIPTION_TYPE.entity}", "${pendingNotification.entity_id}")`
          )
          .returns({ toArray: () => subscriptionsToNewEntityIncidents });
      }

      for (const pendingNotification of pendingNotificationsToIncidentUpdates) {
        stub
          .withArgs({
            type: SUBSCRIPTION_TYPE.incident,
            incident_id: pendingNotification.incident_id,
          })
          .as(
            `subscriptions.find("${SUBSCRIPTION_TYPE.incident}", "${pendingNotification.incident_id}")`
          )
          .returns({ toArray: () => subscriptionsToIncidentUpdates });
      }

      return stub;
    })(),
  };

  const incidentsCollection = {
    findOne: (() => {
      const stub = cy.stub();

      for (let index = 0; index < incidents.length; index++) {
        const incident = incidents[index];

        stub
          .withArgs({ incident_id: incident.incident_id })
          .as(`incidents.findOne(${incident.incident_id})`)
          .returns(incidents.find((i) => i.incident_id == incident.incident_id));
      }

      return stub;
    })(),
  };

  const reportsCollection = {
    findOne: (() => {
      const stub = cy.stub();

      for (let index = 0; index < reports.length; index++) {
        const report = reports[index];

        stub
          .withArgs({ report_number: report.report_number })
          .as(`reports.findOne(${report.report_number})`)
          .returns(reports.find((r) => r.report_number == report.report_number));
      }

      return stub;
    })(),
  };

  const entitiesCollection = {
    find: cy.stub().returns({
      toArray: cy.stub().as('entities.find').resolves(entities),
    }),
  };

  global.context = {
    // @ts-ignore
    services: {
      get: cy.stub().returns({
        db: cy.stub().returns({
          collection: (() => {
            const stub = cy.stub();

            stub.withArgs('notifications').returns(notificationsCollection);
            stub.withArgs('subscriptions').returns(subscriptionsCollection);
            stub.withArgs('incidents').returns(incidentsCollection);
            stub.withArgs('entities').returns(entitiesCollection);
            stub.withArgs('reports').returns(reportsCollection);

            return stub;
          })(),
        }),
      }),
    },
    functions: {
      execute: (() => {
        const stub = cy.stub();

        for (const user of recipients) {
          stub
            .withArgs('getUser', { userId: user.userId })
            .as(`getUser(${user.userId})`)
            .returns(recipients.find((r) => r.userId == user.userId));
        }

        stub.withArgs('sendEmail').as('sendEmail').returns({ statusCode: 200 });

        return stub;
      })(),
    },
  };

  global.BSON = { Int32: (x) => x };

  return {
    notificationsCollection,
    subscriptionsCollection,
    incidentsCollection,
    entitiesCollection,
    reportsCollection,
  };
};

describe('Functions', () => {
});
