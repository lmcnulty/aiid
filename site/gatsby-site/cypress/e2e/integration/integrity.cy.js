import { gql } from '@apollo/client';
import { isCompleteReport } from '../../../src/utils/variants';

const isLinked = (reportNumber, incidents) => {
  for (const incident of incidents) {
    for (const linkedReport of incident.reports) {
      if (linkedReport.report_number == reportNumber) {
        return true;
      }
    }
  }

  return false;
};

describe('Integrity', () => {
});
