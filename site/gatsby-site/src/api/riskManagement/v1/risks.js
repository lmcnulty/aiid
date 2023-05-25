import { MongoClient } from 'mongodb';

import config from '../../../../config';

export default async function handler(req, res) {

  const mongoClient = new MongoClient(config.mongodb.translationsConnectionString);

  const incidentsCollection = mongoClient.db('aiidprod').collection('incidents');
  
  const classificationsCollection = mongoClient.db('aiidprod').collection('classifications');

  const classificationsMatchingSearchTags = await classificationsCollection.find(
    getRiskClassificationsMongoQuery(req.query),
  ).toArray();

  const incidentIdsMatchingSearchTags = classificationsMatchingSearchTags.map(classification => classification.incident_id);

  const incidentsMatchingSearchTags = await incidentsCollection.find(
    {
      incident_id: {
        $in: incidentIdsMatchingSearchTags
      },
    },
    { projection: { incident_id: 1, title: 1, description: 1 }}
  ).toArray();

  const failureAttributeQuery = {
    attributes: {
      $elemMatch: { 
        short_name: {
          $in: [
            "Known AI Technical Failure", 
            "Potential AI Technical Failure"
          ]
        }
      }
    }
  };
  const failureClassificationsMatchingIncidentIdsMatchingSearchTags = await classificationsCollection.find(
    {
      incident_id: {
        $in: incidentIdsMatchingSearchTags
      },
      ...failureAttributeQuery
    },
    { 
      projection: {
        namespace: 1,
        incident_id: 1,
        ...failureAttributeQuery
      }
    }
  ).toArray();
  
  // TODO: Use a shorter name for this
  const failureClassificationsMatchingIncidentIdsMatchingSearchTags_ByFailure = (
    groupable(failureClassificationsMatchingIncidentIdsMatchingSearchTags).groupByMultiple(
      classification => tagsFromClassification(classification)
    )
  );

  const risks = Object.keys(failureClassificationsMatchingIncidentIdsMatchingSearchTags_ByFailure).map(
    failure => {
      const failureClassifications = failureClassificationsMatchingIncidentIdsMatchingSearchTags_ByFailure[failure];
      return {
        tag: failure,
        precedents: failureClassifications.map(failureClassification => {
          const classificationsMatchingIncidentIdOfFailureClassification = classificationsMatchingSearchTags.filter(
           c => c.incident_id == failureClassification.incident_id 
          );
          return {
            incident_id: failureClassification.incident_id,
            title: incidentsMatchingSearchTags.find(
              incident => incident.incident_id == failureClassification.incident_id
            )?.title,
            description: incidentsMatchingSearchTags.find(
              incident => incident.incident_id == failureClassification.incident_id
            )?.description,
            tags: classificationsMatchingIncidentIdOfFailureClassification.map(c => tagsFromClassification(c))
          }
        }) 
      }
    }
  ).sort((a, b) => b.precedents.length - a.precedents.length);

  res.status(200).json(risks);

}

function getRiskClassificationsMongoQuery(queryParams) {
  const tagStrings = queryParams.tags.split('___');

  const tagSearch = {};

  for (const tagString of tagStrings) {
    const parts = tagString.split(":");
    const namespace = parts[0];
    tagSearch[namespace] ||= [];
    const tag = {};
    tag.short_name = parts[1];
    if (parts.length > 2) {
      tag.value_json = {$regex: `"${parts[2]}"`};
    }
    tagSearch[namespace].push(tag);
  }
  console.log(`tagSearch`, tagSearch);

  return {
    $or: Object.keys(tagSearch).map(
      namespace => ({
        namespace,
        attributes: {
          $elemMatch: {
            $or: tagSearch[namespace]
          }
        }
      })
    )
  }
}

var tagsFromClassification = (classification) => (
  // classification:
  // {
  //   attributes: [
  //     { short_name: "Known AI Goal"},
  //       value_json: '["Content Recommendation", "Something"]' }
  //     ...
  //   ]
  // }
  joinArrays(
    classification.attributes.map(
      attribute => (
        [].concat(JSON.parse(attribute.value_json))
          .filter(value => Array.isArray(value) || typeof value !== 'object')
          .map(
            value => [
              classification.namespace,
              attribute.short_name,
              value
            ].join(':')
          )
      )
    )
  )
);

var joinArrays = (arrays) => arrays.reduce((result, array) => result.concat(array), []);

var groupable = (array) => {
  array.groupBy = (keyFunction, valueFunction) => {
    const groups = {};
    for (const element of array) {
      const key = keyFunction(element);
      groups[key] ||= [];
      groups[key].push(
        valueFunction ? valueFunction(element) : element
      );
    }
    return groups;
  }
  array.groupByMultiple = (keyFunction, valueFunction) => {
    const groups = {};
    for (const element of array) {
      const keys = keyFunction(element);
      console.log(`keys`, keys);
      for (const key of keys) {
        groups[key] ||= new Set();
        groups[key].add(
          valueFunction ? valueFunction(element) : element
        );
      }
    }
    for (const group in groups) {
      groups[group] = Array.from(groups[group]);
    }
    return groups;
  }
  return array;
}
