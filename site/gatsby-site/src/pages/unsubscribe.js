import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../elements/Button';
import Link from '../components/ui/Link';
import { useMutation } from '@apollo/client';
import { DELETE_SUBSCRIPTIONS } from '../graphql/subscriptions';
import { NumberParam, StringParam, useQueryParams } from 'use-query-params';

const Unsubscribe = (props) => {
  const [pageMessage, setPageMessage] = useState(null);

  let errorMessage = null;

  const { t } = useTranslation();

  const [DeleteSubscriptions] = useMutation(DELETE_SUBSCRIPTIONS);

  const [{ type: subscriptionType, incidentId, userId }] = useQueryParams({
    type: StringParam,
    incidentId: NumberParam,
    userId: StringParam,
  });

  if (
    !subscriptionType ||
    !userId ||
    (subscriptionType == 'incident' && !incidentId) ||
    (subscriptionType !== 'all' && subscriptionType !== 'incident')
  ) {
    errorMessage = t('Invalid parameters');
  }

  const unsubscribe = async () => {
    try {
      const query = {
        type: subscriptionType,
        userId: { userId },
      };

      if (subscriptionType === 'incident') {
        query.incident_id = { incident_id: `${incidentId}` };
      }

      await DeleteSubscriptions({ variables: { query } });

      setPageMessage(t('You have successfully unsubscribed.'));
    } catch (error) {
      setPageMessage(t('An unknown error has ocurred'));
    }
  };

  return (
    <Layout {...props}>
      {errorMessage || pageMessage ? (
        <>
          <p>
            {errorMessage}
            {pageMessage}
          </p>
          <Link to={'/'}>
            <Trans>Continue</Trans>
          </Link>
        </>
      ) : (
        <>
          <p>
            {subscriptionType === 'incident' && (
              <Trans>
                Do you want to unsubscribe from{' '}
                <Link to={`/cite/${incidentId}`}>incident {{ incidentId }}</Link> updates?
              </Trans>
            )}
            {subscriptionType === 'all' && (
              <Trans>Do you want to unsubscribe from all notifications?</Trans>
            )}
          </p>
          <Button variant="primary" onClick={unsubscribe}>
            <Trans>Confirm</Trans>
          </Button>
        </>
      )}
    </Layout>
  );
};

export default Unsubscribe;
