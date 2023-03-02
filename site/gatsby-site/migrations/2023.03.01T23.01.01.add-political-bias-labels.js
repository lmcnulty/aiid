const config = require('../config');

const axios = require('axios');

const jsdom = require('jsdom');

exports.up = async ({ context: { client } }) => {
  const { JSDOM } = jsdom;

  const publications = [];

  const addBiasLabel = (publicationTitle, publicationDomain, labeler, label) => {
    const existingPublication = publications.find((p) => p.domain == publicationDomain);

    if (existingPublication) {
      existingPublication.biasLabels.push({ label, labeler });
    } else {
      publications.push({
        title: publicationTitle,
        domain: publicationDomain,
        biasLabels: [{ label, labeler }],
      });
    }
  };

  for (const alignment of ['left', 'leftcenter', 'center', 'right-center', 'right']) {
    const mbfcResponse = await axios.get('https://mediabiasfactcheck.com/' + alignment);

    if (mbfcResponse.status == 200) {
      const mbfcPage = new JSDOM(mbfcResponse.data);

      for (const tr of [...mbfcPage.window.document.querySelectorAll('#mbfc-table tr')]) {
        const deepestChild = getDeepestChild(tr);

        let tokens = deepestChild.textContent.split(' ');

        let lastToken = tokens.pop();

        let domain;

        if (lastToken[0] == '(') {
          domain = lastToken.slice(1, lastToken.length - 1); // Remove parentheses
        } else {
          tokens.push(lastToken);
        }
        const title = tokens.join(' ');

        if (domain) {
          addBiasLabel(
            title,
            domain,
            'mediabiasfactcheck.com',
            {
              left: 'left',
              right: 'right',

              // These occur in most sources, and it's best to normalize them
              // to a specific spelling / wording across sources
              // so we can check if different sources agree.
              leftcenter: 'center-left',
              'right-center': 'center-right',

              // They use "center" in the url but "least biased" in the site text.
              // There's a difference between being unbiased
              // and being biased towards the center.
              // They seem to be trying to capture the former:
              //
              //  > These sources have minimal bias and use very few loaded words
              //  > (wording that attempts to influence an audience
              //  >  by using appeal to emotion or stereotypes).
              //  > The reporting is factual and usually sourced.
              //  > These are the most credible media sources.
              //
              center: 'least biased',
            }[alignment]
          );
        }
      }
    }
  }
  await client.connect();

  const publicationsCollection = await client
    .db(config.realm.production_db.db_name)
    .createCollection('publications');

  for (const publication of publications) {
    publicationsCollection.insertOne(publication);
  }
};

exports.down = async ({ context: { client } }) => {
  await client.connect();

  await client.db(config.realm.production_db.db_name).dropCollection('publications');
};

var getDeepestChild = (htmlNode) => {
  if (htmlNode.children.length == 0) {
    return htmlNode;
  } else {
    return getDeepestChild(htmlNode.children[0]);
  }
};
