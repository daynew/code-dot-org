import $ from 'jquery';
import assetUrl from '@cdo/apps/code-studio/assetUrl';
import React from 'react';
import ReactDom from 'react-dom';
import SafeMarkdown from '@cdo/apps/templates/SafeMarkdown';
import {convertXmlToBlockly} from '@cdo/apps/templates/instructions/utils';
import commonBlocks from '@cdo/apps/blocksCommon';

$(document).ready(() => {
  // Load app specific Blockly blocks. This will enable level creators to write
  // Blockly XML and render the blocks directly in the level text.
  Blockly.assetUrl = assetUrl;
  Blockly.Css.inject(document);
  // Install the common Blockly blocks
  commonBlocks.install(window.Blockly, {});
  try {
    // TODO [FND-972] Only the associated level type's blocks.
    // Install the custom CDO blocks for the associated level type.
    const appBlocks = require('@cdo/apps/turtle/blocks');
    appBlocks.install(window.Blockly, {skin: {}, app: 'turtle'});
  } catch (error) {
    console.warn(`Unable to load blockly blocks for turtle: ${error}`);
  }

  // Render Markdown
  $('.content-level > .markdown-container').each(function() {
    const container = this;
    if (!container.dataset.markdown) {
      return;
    }

    ReactDom.render(
      React.createElement(SafeMarkdown, container.dataset, null),
      container,
      function() {
        // After the Markdown is rendered, render any Blockly blocks defined in
        // <xml> blocks.
        convertXmlToBlockly(container);
      }
    );
  });
});
