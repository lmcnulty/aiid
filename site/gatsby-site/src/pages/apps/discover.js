import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useQueryParams } from 'use-query-params';
import algoliasearch from 'algoliasearch/lite';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import Helmet from 'react-helmet';
import { useModal, CustomModal } from 'hooks/useModal';

import config from '../../../config';
import Hits from 'components/discover/Hits';
import SearchBox from 'components/discover/SearchBox';
import Pagination from 'components/discover/Pagination';
import Filters from 'components/discover/Filters';
import FiltersModal from 'components/discover/FiltersModal';
import { SearchContext } from 'components/discover/useSearch';
import { queryConfig } from 'components/discover/queryParams';
import VirtualFilters from 'components/discover/VirtualFilters';
import { Container, Row, Col } from 'react-bootstrap';
import LanguageSwitcher from 'components/i18n/LanguageSwitcher';
import useTranslation from 'components/i18n/useTranslation';
import Stats from 'components/discover/Stats';
import ClearFilters from 'components/discover/ClearFilters';
import DisplayModeSwitch from 'components/discover/DisplayModeSwitch';
import styled from 'styled-components';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);

const removeUndefinedAttributes = (obj) => {
  for (const attr in obj) {
    if (obj[attr] === undefined) {
      delete obj[attr];
    }
  }
  return { ...obj };
};

const removeEmptyAttributes = (obj) => {
  for (const attr in obj) {
    if (obj[attr] === '' || obj[attr].length === 0) {
      delete obj[attr];
    }
  }
  return { ...obj };
};

const convertArrayToString = (obj) => {
  for (const attr in obj) {
    if (obj[attr].length > 0) {
      obj[attr] = obj[attr].join('||');
    }
  }
  return { ...obj };
};

const convertStringToArray = (obj) => {
  const stringKeys = [
    'source_domain',
    'authors',
    'submitters',
    'incident_id',
    'flag',
    'classifications',
  ];

  let newObj = {};

  for (const attr in obj) {
    if (stringKeys.includes(attr) && obj[attr] !== undefined) {
      if (obj[attr].indexOf('CSET') >= 0) {
        // The facet separator is double pipe sign - "||"
        newObj[attr] = obj[attr].split('||CSET').map((i) => 'CSET' + i);
        newObj[attr][0] = newObj[attr][0].substr(4);
      } else {
        newObj[attr] = obj[attr].split('||');
      }
    }
  }
  return newObj;
};

const convertRangeToQueryString = (rangeObj) => {
  let rangeQueryObj = {};

  for (const attr in rangeObj) {
    if (rangeObj[attr] !== undefined && rangeObj[attr].min) {
      rangeQueryObj[`${attr}_min`] = rangeObj[attr].min;
    }
    if (rangeObj[attr] !== undefined && rangeObj[attr].max) {
      rangeQueryObj[`${attr}_max`] = rangeObj[attr].max;
    }
  }

  return rangeQueryObj;
};

const convertStringToRange = (query) => {
  const rangeKeys = [
    'epoch_incident_date_min',
    'epoch_incident_date_max',
    'epoch_date_published_min',
    'epoch_date_published_max',
  ];

  let resultObj = {};

  for (const attr in query) {
    if (rangeKeys.includes(attr)) {
      if (attr.includes('_min') && !isNaN(parseInt(query[attr]))) {
        resultObj[attr.split('_min')[0]] = {
          ...resultObj[attr.split('_min')[0]],
          min: parseInt(query[attr]),
        };
      }

      if (attr.includes('_max') && !isNaN(parseInt(query[attr]))) {
        resultObj[attr.split('_max')[0]] = {
          ...resultObj[attr.split('_max')[0]],
          max: parseInt(query[attr]),
        };
      }
    }
  }

  return resultObj;
};

const generateSearchState = ({ query }) => {
  const searchState = {
    query: '',
    refinementList: {},
    range: {},
  };

  const cleanQuery = removeUndefinedAttributes(query);

  const querySearch = cleanQuery.s || '';

  delete cleanQuery.s;

  return {
    ...searchState,
    page: query.page,
    query: querySearch,
    refinementList: {
      ...convertStringToArray(cleanQuery),
    },
    range: {
      ...convertStringToRange(cleanQuery),
    },
  };
};

const getQueryFromState = (searchState) => {
  let query = {};

  if (searchState && searchState.query !== '') {
    query.s = searchState.query;
  }

  if (searchState && searchState.refinementList !== {}) {
    query = {
      ...query,
      ...convertArrayToString(removeEmptyAttributes(searchState.refinementList)),
    };
  }

  if (searchState && searchState.range !== {}) {
    query = {
      ...query,
      ...convertRangeToQueryString(removeEmptyAttributes(searchState.range)),
    };
  }

  query.page = searchState.page;

  return query;
};

const SearchControls = styled.div`
  position: relative;
  min-height: 4.25rem;
  box-sizing: border-box;

  summary {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 38px;
    line-height: 38px;
  }
`;

const ControlsMain = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0px;
  height: 38px;
  width: calc(100% - 14ch);
`;

const ClearFiltersContainer = styled.div`
  margin-left: auto;
  ClearFilters {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0px !important;
  }
`;

const FiltersContainer = styled.div`
  padding-top: 3rem;
  clear: both;
  > div {
    margin-top: 0.75rem;
    margin-bottom: 1.25rem;
  }
`;

function DiscoverApp(props) {
  const [query, setQuery] = useQueryParams(queryConfig);

  const { language } = useTranslation();

  const languageSwitcher = useRef(
    typeof window !== 'undefined' && window.localStorage.getItem('i18n')
  ).current;

  const [indexName, setIndexName] = useState(
    languageSwitcher ? `instant_search-${language.code}` : 'instant_search'
  );

  const [searchState, setSearchState] = useState(generateSearchState({ query }));

  const onSearchStateChange = (searchState) => {
    setSearchState({ ...searchState });
  };

  const toggleFilterByIncidentId = useCallback(
    (incidentId) => {
      const newSearchState = {
        ...searchState,
        refinementList: {
          ...searchState.refinementList,
          incident_id: [incidentId],
        },
      };

      setSearchState(newSearchState);
      setQuery(getQueryFromState(newSearchState), 'push');
    },
    [searchState]
  );

  useEffect(() => {
    const searchQuery = getQueryFromState(searchState);

    const extraQuery = { display: query.display, lang: query.lang };

    setQuery({ ...searchQuery, ...extraQuery }, 'push');
  }, [searchState]);

  useEffect(() => {
    if (languageSwitcher) {
      setIndexName(`instant_search-${language.code}`);
    }
  }, [language]);

  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  const expandFilters = useRef(Object.keys(searchState.refinementList).length > 0);

  return (
    <LayoutHideSidebar {...props}>
      <Helmet>
        <title>Artificial Intelligence Incident Database</title>
      </Helmet>
      <SearchContext.Provider value={{ searchState, indexName, searchClient, onSearchStateChange }}>
        <InstantSearch
          indexName={indexName}
          searchClient={searchClient}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
        >
          <Configure hitsPerPage={28} />

          <VirtualFilters />

          <Container className="container-xl mt-4">
            <Row>
              <Col>
                <SearchBox defaultRefinement={query.s} />
              </Col>
              {languageSwitcher && (
                <Col className="col-auto">
                  <LanguageSwitcher />
                </Col>
              )}
            </Row>

            <SearchControls className="hiddenMobile">
              <ControlsMain className="mt-3">
                <Stats />
                <DisplayModeSwitch />
                <ClearFiltersContainer>
                  <ClearFilters>Clear Filters</ClearFilters>
                </ClearFiltersContainer>
              </ControlsMain>
              <details open={expandFilters.current}>
                <summary className="mt-3">Filter Search</summary>
                <FiltersContainer>
                  <Filters />
                </FiltersContainer>
              </details>
            </SearchControls>

            <FiltersModal />
          </Container>

          <Hits
            toggleFilterByIncidentId={toggleFilterByIncidentId}
            authorsModal={authorsModal}
            submittersModal={submittersModal}
            flagReportModal={flagReportModal}
          />

          <CustomModal {...authorsModal} />
          <CustomModal {...submittersModal} />
          <CustomModal {...flagReportModal} />

          <Pagination />
        </InstantSearch>
      </SearchContext.Provider>
    </LayoutHideSidebar>
  );
}

export default DiscoverApp;
