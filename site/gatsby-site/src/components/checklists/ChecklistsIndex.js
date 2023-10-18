import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import Card from 'elements/Card';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ExportDropdown from 'components/checklists/ExportDropdown';
import SubscribeButton from 'components/checklists/SubscribeButton';
import {
  DeleteButton,
  removeTypename,
  statusIcon,
  statusColor,
  generateId,
} from 'utils/checklists';
import { FIND_CHECKLISTS, INSERT_CHECKLIST, DELETE_CHECKLIST } from '../../graphql/checklists';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

const ChecklistsIndex = () => {
  const { t } = useTranslation();

  const [insertChecklist] = useMutation(INSERT_CHECKLIST);

  const [deleteChecklist] = useMutation(DELETE_CHECKLIST);

  const addToast = useToastContext();

  const { data: checklistsData, loading: checklistsLoading } = useQuery(FIND_CHECKLISTS);

  const [checklists, setChecklists] = useState([]);

  useEffect(() => {
    setChecklists(checklistsData?.checklists || []);
  }, [checklistsData]);

  if (checklistsLoading) {
    return <Spinner />;
  }
  return (
    <>
      <div className={'titleWrapper'}>
        <div className="w-full flex items-center">
          <h1 className="mr-auto">
            <Trans>Risk Checklists</Trans>
          </h1>
          <Button
            onClick={() => {
              window.location = '/apps/checklists?id=' + generateId();
            }}
          >
            <Trans>New</Trans>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-gray-100 border-1 border-gray-200 rounded shadow-inner p-4">
        {checklists.map((checklist) => (
          <Card className="bg-white shadow" key={checklist.id}>
            <div className="flex items-center gap-2 flex-wrap border-b border-gray-200 p-4">
              <LocalizedLink className="mr-auto" to={`/apps/checklists?id=${checklist.id}`}>
                <h2 className="mb-0">{checklist.name}</h2>
              </LocalizedLink>
              <Button
                color="light"
                onClick={async () => {
                  const newChecklist = {
                    ...checklist,
                    _id: undefined,
                    id: generateId(),
                    name: checklist.name + t(' (Clone)'),
                  };

                  try {
                    await insertChecklist({
                      variables: { checklist: removeTypename(newChecklist) },
                    });
                    setChecklists((checklists) => {
                      const newChecklists = [...checklists];

                      newChecklists.splice(checklists.indexOf(checklist), 0, newChecklist);
                      return newChecklists;
                    });
                  } catch (error) {
                    addToast({
                      message: t('Could not clone checklist.'),
                      severity: SEVERITY.danger,
                      error,
                    });
                  }
                }}
              >
                <Trans>Clone</Trans>
              </Button>
              <SubscribeButton checklistId={checklist.id} />
              <DeleteButton
                type="button"
                onClick={async () => {
                  try {
                    await deleteChecklist({ variables: { query: { id: checklist.id } } });
                    setChecklists((checklists) => checklists.filter((c) => c.id != checklist.id));
                  } catch (error) {
                    addToast({
                      message: t('Could not delete checklist.'),
                      severity: SEVERITY.danger,
                      error,
                    });
                  }
                }}
              >
                <Trans>Delete</Trans>
              </DeleteButton>
              <ExportDropdown {...{ checklist }} />
            </div>
            <ul className="flex gap-2 flex-wrap p-4">
              {(checklist.risks || [])
                .filter((r) => r.risk_status != 'Not Applicable')
                .map((risk) => (
                  <li key={risk.id} className="flex items-center gap-1 text-gray-600 mx-1">
                    <FontAwesomeIcon
                      icon={statusIcon(risk.risk_status)}
                      className={`text-${statusColor(risk.risk_status)}-600`}
                      title={risk.risk_status}
                    />
                    {risk.title}
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ChecklistsIndex;
