import React, { useEffect, useRef, useState } from 'react';
import Col from 'elements/Col';
import Row from 'elements/Row';
import Container from 'elements/Container';
import algoliasearch from 'algoliasearch/lite';
import config from '../../../config';
import { navigate } from 'gatsby';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { InstantSearch } from 'react-instantsearch';
import SearchBox from 'components/discover/SearchBox';
import Hits from 'components/discover/Hits';
import Controls from './Controls';
import OptionsModal from './OptionsModal';
import createURL from './createURL';
import parseURL from './parseURL';
import { queryConfig } from './queryParams';
import { history } from 'instantsearch.js/es/lib/routers';
import Pagination from './Pagination';
import debounce from 'lodash/debounce';

import REFINEMENT_LISTS, { FIRST_ROW } from 'components/discover/REFINEMENT_LISTS';
import Filter from './Filter';
import ClearFilters from './ClearFilters';

import { AccordionFilter } from './Filter';
import { Accordion, Modal } from 'flowbite-react';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);

function mapping() {
  return {
    stateToRoute: (uiState) => uiState,
    routeToState: (routeState = {}) => routeState,
  };
}

export default function Discover() {
  const { locale } = useLocalization();

  const [indexName] = useState(`instant_search-${locale}-featured`);

  const [width, setWidth] = useState(0);

  const handleWindowSizeChange = useRef(
    debounce(() => {
      setWidth(window.innerWidth);
    }, 1000)
  ).current;

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    handleWindowSizeChange();

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  if (width == 0) {
    return null;
  }

  const modalControls = width <= 767;
  const toolbarFilters = 767 < width && width < 1920; 
  const sidebarFilters = 1920 <= width

  console.log(`modalControls`, modalControls);
  console.log(`toolbarFilters`, toolbarFilters);
  console.log(`sidebarFilters`, sidebarFilters);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      routing={{
        router: history({
          getLocation: () => {
            return window.location;
          },
          parseURL: ({ location }) => parseURL({ location, indexName, queryConfig }),
          createURL: ({ routeState }) => createURL({ indexName, locale, queryConfig, routeState }),
          push: (url) => {
            navigate(`?${url}`);
          },
        }),
        stateMapping: mapping(),
      }}
    >
      <Container className="flex max-w-full">
        <div style={{ 'width': sidebarFilters ? 'calc(100% - 16rem)' : '100%'}}>
          <Row className="px-0 mx-0">
            <Col className="px-0 mx-0">
              <SearchBox />
            </Col>
          </Row>

          {modalControls 
            ? <OptionsModal /> 
            : <Controls {...{ toolbarFilters }} />
          }

          <Hits />

          <Pagination />
        </div>
        <aside className="w-[16rem] absolute pr-4 right-0 top-4 hidden 3xl:block">
          <Accordion>
            {REFINEMENT_LISTS.filter((list) => !list.hidden).map((list) => (
              <AccordionFilter key={list.attribute} attribute={list.attribute} {...list} />
            ))}
          </Accordion>
        </aside>
      </Container>
    </InstantSearch>
  );
}
