import React from 'react';
import { useUserContext } from 'contexts/userContext';
import Actions from 'components/discover/Actions';
import IncidentReportCard, { CardChild } from 'components/IncidentReportCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const IncidentCard = ({ item, authorsModal, submittersModal, flagReportModal }) => {
  const { isRole, loading } = useUserContext();

  return (
    <IncidentReportCard
      id={`r${item.report_number}`}
      report={item}
      className="mt-2 mb-2 IncidentCard"
      style={{ maxWidth: '800px' }}
    >
      <CardChild position="footer" className="justify-around text-muted-gray">
        <Actions
          item={item}
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
        />
        {!loading && isRole('incident_editor') && (
          <a
            data-cy="edit-report"
            href={`/cite/edit?report_number=${item.report_number}`}
            style={{ color: 'inherit' }}
            title="edit"
          >
            <Button variant="link">
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          </a>
        )}
      </CardChild>
    </IncidentReportCard>
  );
};

export default IncidentCard;
