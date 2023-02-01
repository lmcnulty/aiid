import createEntitiesPages from '../../../../page-creators/createEntitiesPages';

const response = {
  data: {
    incidents: {
      nodes: [
        {
          incident_id: 1,
          title: 'Incident 1',
          Alleged_deployer_of_AI_system: ['ai-developer-1'],
          Alleged_developer_of_AI_system: ['ai-developer-1'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-1'],
          reports: [1, 2],
        },
        {
          incident_id: 2,
          title: 'Incident 2',
          Alleged_deployer_of_AI_system: ['ai-deployer-1'],
          Alleged_developer_of_AI_system: ['ai-developer-1'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-1', 'party-2'],
          reports: [3],
        },
        {
          incident_id: 3,
          title: 'Incident 3',
          Alleged_deployer_of_AI_system: ['ai-developer-2', 'ai-deployer-2'],
          Alleged_developer_of_AI_system: ['ai-developer-2'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-2'],
          reports: [4, 5],
        },
        {
          incident_id: 4,
          title: 'Incident 4',
          Alleged_deployer_of_AI_system: ['ai-deployer-3'],
          Alleged_developer_of_AI_system: ['ai-developer-1', 'ai-developer-2'],
          Alleged_harmed_or_nearly_harmed_parties: ['party-3'],
          reports: [6, 7, 8],
        },
      ],
    },
    entities: {
      nodes: [
        {
          entity_id: 'ai-deployer-1',
          name: 'AI Deployer 1',
        },
        {
          entity_id: 'ai-deployer-2',
          name: 'AI Deployer 2',
        },
        {
          entity_id: 'ai-deployer-3',
          name: 'AI Deployer 3',
        },
        {
          entity_id: 'ai-developer-1',
          name: 'AI Developer 1',
        },
        {
          entity_id: 'ai-developer-2',
          name: 'AI Developer 2',
        },
        {
          entity_id: 'party-1',
          name: 'Party 1',
        },
        {
          entity_id: 'party-2',
          name: 'Party 2',
        },
        {
          entity_id: 'party-3',
          name: 'Party 3',
        },
      ],
    },
    responses: {
      nodes: [
        {
          report_number: 2,
        },
        {
          report_number: 3,
        },
        {
          report_number: 5,
        },
      ],
    },
  },
};

describe('createEntitiesPages', () => {
});
