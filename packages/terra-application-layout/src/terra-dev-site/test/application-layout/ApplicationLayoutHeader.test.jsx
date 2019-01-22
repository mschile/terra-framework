/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ApplicationLayoutHeader from '../../../header/_ApplicationLayoutHeader';
import ExtensionsExample from '../common/ExtensionsExample';

const ApplicationLayoutHeaderTest = () => (
  <MemoryRouter>
    <ApplicationLayoutHeader
      id="test-header"
      layoutConfig={{ size: 'large' }}
      nameConfig={{ title: 'app-test-title' }}
      utilityConfig={{
        title: 'test-util-title',
        initialSelectedKey: 'test-menu',
        onChange: () => {},
        menuItems: [
          {
            key: 'test-menu',
            contentLocation: 'body',
            title: 'test-menu-title',
          },
        ],
      }}
      extensions={<ExtensionsExample layoutConfig={{ size: 'large' }} />}
      applicationLinks={[
        {
          id: '123',
          path: '/something1',
          text: 'item 1',
        },
        {
          id: '234',
          path: '/something2',
          text: 'item 2',
        },
        {
          id: '345',
          path: '/something3',
          text: 'item 3',
        },
      ]}
    />
  </MemoryRouter>
);

export default ApplicationLayoutHeaderTest;
