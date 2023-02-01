import subscriptionsData from '../../fixtures/subscriptions/subscriptions.json';
import emptySubscriptionsData from '../../fixtures/subscriptions/empty-subscriptions.json';
import { SUBSCRIPTION_TYPE } from '../../../src/utils/subscriptions';

const incidentSubscriptions = subscriptionsData.data.subscriptions
  .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.incident)
  .sort((a, b) => a.incident_id.incident_id - b.incident_id.incident_id);

const entitySubscriptions = subscriptionsData.data.subscriptions
  .filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.entity)
  .sort((a, b) => a.entityId.name - b.entityId.name);

describe('Subscriptions', () => {
});
