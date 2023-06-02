import React, { useState, useEffect, useRef, createElement } from 'react';
import Layout from 'components/Layout';
import { useTranslation } from 'react-i18next';
import { Button, Select, TextInput, Textarea, Card } from 'flowbite-react';
import { debounce } from 'debounce';
import { Trans } from 'react-i18next';
import { Formik, Form } from 'formik';
import { graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  useQueryParams,
  StringParam,
  createEnumParam,
  withDefault,
  NumberParam,
  BooleanParam
} from 'use-query-params';

import AiidHelmet from 'components/AiidHelmet';
import Tags from 'components/forms/Tags';
import { classy, classyDiv, classySpan } from 'utils/classy';

import { abbreviatedTag } from 'utils/checklists';
import CheckListForm from 'components/checklists/CheckListForm';

export default function ChecklistsPage(props) {
  const {
    location: { pathname },
    data: { taxa, classifications }
  } = props;

  const [query, setQuery] = useQueryParams({
    id: StringParam,
  });

  const { t } = useTranslation();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const submit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log(values);
    setSubmitting(false);
  }

  const tags = classificationsToTags({ classifications, taxa });

  return (
    <Layout {...props} className="w-full md:max-w-5xl">
      <AiidHelmet path={pathname}>
        <title>{t('Risk Checklists')}</title>
      </AiidHelmet>
      {hydrated && query.id ? (
        <Formik onSubmit={submit} initialValues={{'tags-goals': [], 'tags-methods': [], 'tags-other': [], 'risks': []}}  >
          {(FormProps) => <CheckListForm {...{...FormProps, tags, t}} /> }
        </Formik>
      ) : (
        <h1>Risk Checklists</h1>
      )}
    </Layout>
  );
};



// TODO: Handle identity better than just comparing titles.
var risksEqual = (risk1, risk2) => risk1.title == risk2.title;

function RiskSection({ risk, values, setRisks, setFieldValue, submitForm, tags }) {
  const updateRisk = (attributeValueMap) => {

    const updatedRisks = [...values.risks];

    const updatedRisk = updatedRisks.find(r => risksEqual(r, risk));

    for (const attribute in attributeValueMap) {
      updatedRisk[attribute] = attributeValueMap[attribute];
    }

    setFieldValue('risks', updatedRisks);
    submitForm();
  }

  return (
    <RiskDetails open={risk.startClosed ? undefined : true}>
      <RiskHeaderSummary>
        <RiskTitle title={risk.title} {...{updateRisk}}/>
      </RiskHeaderSummary>
      <RiskLayout>
        <PrecedentsQuery>
          <Label><Trans>Precedents Query</Trans></Label>
          <div className="bootstrap" >
            <Tags 
              id="risk_status"
              value={risk.query_tags}
              onChange={(value) => updateRisk({ query_tags: value })}
              options={tags}
            />
          </div>
        </PrecedentsQuery>
        <Precedents>
          <Label>Precedents</Label>
          <PrecedentsList>
            {risk.precedents.map((precedent) => (
              <Card>
                <div className="h-64 w-64">
                  <h3>{precedent.title}</h3>
                  <p>{precedent.description}</p>
                </div>
              </Card>
            ))}
          </PrecedentsList>
        </Precedents>
        <div className="grid grid-cols-2 gap-4">
          <RiskInfo>
            <label className="-mb-1">Risk Status</label>
            <Select value={risk.risk_status} onChange={(event) => updateRisk({risk_status: event.target.value})}>
              {['Not Mitigated', 'Mitigated'].map((status) => (
                <option value={status}>{status}</option>
              ))}
            </Select>
            <div>
              <Label>Severity</Label>
              <TextInput value={risk.severity} onChange={(event) => updateRisk({severity: event.target.value})}/>
            </div>
            <div>
              <Label>Likelihood</Label>
              <TextInput value={risk.likelihood} onChange={(event) => updateRisk({likelihood: event.target.value})}/>
            </div>
          </RiskInfo>
          <div className="h-full flex flex-col">
            <Label>Risk Notes</Label>
            <Textarea className="h-full shrink-1" value={risk.risk_notes} onChange={(event) => updateRisk({risk_notes: event.target.value})}/>
          </div>
        </div>
      </RiskLayout>
    </RiskDetails>
  );
}


function RiskTitle({ title, updateRisk }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const textStyle = "text-lg text-red-700 px-2";
  return (
    <>
      {editingTitle
       ? (
        <input 
          type="text" value={title}
          onChange={(event) => updateRisk({ title: event.target.value })} 
          onFocusOut={() => setEditingTitle(false)}
          className={`${textStyle} py-0 border-none flex-shrink-1`} 
          style={{maxWidth: '90%'}} 
        />
       ) : <span className={`${textStyle} bg-white`}>{title}</span>
      }
      <button className="bg-white px-2" onClick={() => setEditingTitle((editingTitle) => !editingTitle)}>
        <FontAwesomeIcon icon={editingTitle ? faCheck : faEdit} />
      </button>
    </>   
  );
}


var searchRisks = async ({ values, setFieldValue }) => {
  const queryTags = [...values['tags-goals'], ...values['tags-methods'], ...values['tags-other']];
  const response = await fetch(
    '/api/riskManagement/v1/risks?tags=' +
    encodeURIComponent(queryTags.join('___'))
  );
  const results = response.ok ? await response.json() : null;
  console.log(`results`, results);

  const risksToAdd = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const newRisk = {
      ...emptyRisk(),
      title: abbreviatedTag(result.tag),
      query_tags: [result.tag],
      precedents: result.precedents,
      description: result.description,
    };
    if (i > 0) {
      newRisk.startClosed = true;
    }
    if (!values.risks.some(existingRisk => risksEqual(result, newRisk))) {
      risksToAdd.push(newRisk);
    }
  }
  setFieldValue('risks', values.risks.concat(risksToAdd));
   
  // Example result:
  // [ { "tag": "GMF:Failure:Gaming Vulnerability",
  //     "precedents": [
  //       { "incident_id": 146,
  //         "url": "https://incidentdatabase.ai/cite/146",
  //         "title": "Research Prototype AI, Delphi, Reportedly Gave Racially Biased Answers on Ethics",
  //         "description": "A publicly accessible research model[...]moral judgments.",
  //         "query_tags": [ "GMF:Known AI Technology:Language Modeling", ],
  //         "risk_tags": [ "GMF:Known AI Technical Failure:Distributional Bias", ]
  //       },
  //     ]
  //   }
  // ]
}



function classificationsToTags({ classifications, taxa }) {
  const tags = new Set();

  for (const classification of classifications.nodes) {
    
    const taxonomy = taxa.nodes.find(t => t.namespace == classification.namespace);

    for (const attribute of classification.attributes) {

      const field = taxonomy.field_list.find(
        f => f.short_name == attribute.short_name
      );
      
      if (field) {
        const value = JSON.parse(attribute.value_json);

        if (Array.isArray(value)) {
          for (const item of value) {
            if (String(item).length < 20) {
              tags.add(
                [ classification.namespace,
                  attribute.short_name,
                  String(item),
                ].join(':')
              );
            }
          }
        } else if (String(value).length < 20) {
          tags.add(
            [ classification.namespace,
              attribute.short_name,
              String(value),
            ].join(':')
          );
        }
      }
    }
  }
  return Array.from(tags);
}

var emptyRisk = () => ({
  title: 'Untitled Risk',
  query_tags: [],
  risk_status: 'Not mitigated',
  risk_notes: '',
  severity: '',
  likelihood: '',
  precedents: [],
  touched: false,
})



var RiskLayout = classyDiv("flex flex-col gap-4");
var PrecedentsQuery = classyDiv();
var Precedents = classyDiv();
var RiskInfo = classyDiv("flex flex-col gap-2");

var PrecedentsList = classyDiv(`
  flex gap-3 p-2  
  h-64 w-full max-w-full 
  overflow-x-auto
  bg-gray-100
  border-1 border-gray-200 
  rounded 
  shadow-inner
`);

var RiskDetails = classy('details', `
  relative max-w-full
  border-red-700 border-t-1 open:border-1
  open:p-6 open:rounded
  [&[open]>summary]:before:content-['⏷']
        [&>summary]:before:content-['⏵']
`);
var RiskHeaderSummary = classy('summary', `
  absolute -top-4 left-3 w-full flex px-2 

  before:w-4 before:pl-1 before:bg-white 
  before:text-lg before:text-red-700
`);


export const query = graphql`
  query ChecklistsPageQuery {
    taxa: allMongodbAiidprodTaxa {
      nodes {
        id
        namespace
        weight
        description
        complete_entities
        dummy_fields {
          field_number
          short_name
        }
        field_list {
          field_number
          short_name
          long_name
          short_description
          long_description
          display_type
          mongo_type
          default
          placeholder
          permitted_values
          weight
          instant_facet
          required
          public
          complete_from {
            all
            current
            entities
          }
          subfields {
            field_number
            short_name
            long_name
            short_description
            long_description
            display_type
            mongo_type
            default
            placeholder
            permitted_values
            weight
            instant_facet
            required
            public
            complete_from {
              all
              current
              entities
            }
          }
        }
      }
    }
    classifications: allMongodbAiidprodClassifications {
      nodes {
        namespace
        attributes {
          short_name
          value_json
        }
        publish
      }
    }
  }
`;
