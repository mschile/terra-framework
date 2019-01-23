/* eslint-disable import/no-extraneous-dependencies, import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions  */
import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Redirect, matchPath, Switch, Route,
} from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import Image from 'terra-image';
import Avatar from 'terra-avatar';
import ContentContainer from 'terra-content-container';
import Button from 'terra-button';
import ActionHeader from 'terra-action-header';
import { withDisclosureManager } from 'terra-disclosure-manager';
import { withActiveBreakpoint } from 'terra-breakpoints';
import DemographicsBanner from 'terra-demographics-banner';

import ApplicationLayout, { Utils } from '../../../../ApplicationLayout';
import Page1Content from './Page1Content';
import CommonContent from './CommonContent';

const DisclosureComponent = withDisclosureManager(({ disclosureManager, text }) => (
  <ContentContainer
    header={(
      <ActionHeader title="Disclosure Component" onBack={disclosureManager.goBack} onClose={disclosureManager.closeDisclosure} />
    )}
    fill
  >
    <div style={{ padding: '5px' }}>
      {text}
    </div>
  </ContentContainer>
));

const Extensions = withDisclosureManager(withActiveBreakpoint(({ disclosureManager, activeBreakpoint }) => (
  <span>
    <Button
      style={{ marginRight: '5px' }}
      text={activeBreakpoint === 'tiny' || activeBreakpoint === 'small' ? 'E1' : 'Extension 1'}
      onClick={() => {
        disclosureManager.disclose({
          preferredType: 'modal',
          content: {
            component: <DisclosureComponent text="Extensions Go Here" />,
          },
        });
      }}
    />
    <Button
      text={activeBreakpoint === 'tiny' || activeBreakpoint === 'small' ? 'E2' : 'Extension 2'}
      onClick={() => {
        disclosureManager.disclose({
          preferredType: 'modal',
          content: {
            component: <DisclosureComponent text="Extensions Go Here" />,
          },
        });
      }}
    />
  </span>
)));

/**
 * The navigationItems will be used to present the ApplicationLayout's navigation controls. The paths provided here must be present in
 * the routingConfig. If no navigation controls are desired, these items can be omitted.
 *
 * With standard rendering, the items will be presented as tabs within the ApplicationLayout's header.
 * With compact rendering, the items will be presented within the layout's menu region within a ApplicationLayout-managed menu.
 */
const navigationItems = [{
  key: '/page_1',
  text: 'Page 1',
}, {
  key: '/page_2',
  text: 'Page 2',
}, {
  key: '/page_3',
  text: 'Page 3',
}, {
  key: '/page_4',
  text: 'Page 4',
}, {
  key: '/page_5',
  text: 'Page 5',
}, {
  key: '/page_6',
  text: 'Page 6',
}, {
  key: '/page_7',
  text: 'Page 7',
}];

const userAvatar = (
  <Avatar
    variant="user"
    alt="User, Test"
    ariaLabel="User, Test"
    key="user_avatar"
  />
);

const userData = {
  name: 'User, Test',
  detail: 'User Detail',
  photo: userAvatar,
};

/**
 * The data provided for nameConfig will be visible in the ApplicationLayout's header, as well
 * as in any menus at the tiny and small breakpoints.
 */
const nameConfig = Object.freeze({
  title: 'Test Application',
  accessory: <Image variant="rounded" src="https://github.com/cerner/terra-core/raw/master/terra.png" height="26px" width="26px" />,
});

class TestApplication extends React.Component {
  static getActiveNavigationItem(location) {
    for (let i = 0, numberOfNavigationItems = navigationItems.length; i < numberOfNavigationItems; i += 1) {
      if (matchPath(location.pathname, navigationItems[i].key)) {
        return navigationItems[i];
      }
    }

    return undefined;
  }

  static getDerivedStateFromProps(newProps) {
    return {
      activeNavigationItem: TestApplication.getActiveNavigationItem(newProps.location, newProps.navigationItems),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      checkboxItemEnabled: false,
      activeNavigationItem: navigationItems[0],
    };
  }

  render() {
    const {
      intl, history, location, disclosureManager, activeBreakpoint,
    } = this.props;
    const { checkboxItemEnabled, activeNavigationItem } = this.state;

    const customUtilityItems = [{
      key: 'additional-1',
      title: 'Drill-in Item',
      childKeys: [
        'additional-sub-1',
        'additional-sub-2',
      ],
      parentKey: Utils.utilityHelpers.defaultKeys.MENU,
    }, {
      key: 'additional-sub-1',
      title: 'Additional Item 1 - Sub 1',
      parentKey: 'additional-1',
    }, {
      key: 'additional-sub-2',
      title: 'Additional Item 1 - Sub 2',
      parentKey: 'additional-1',
    }, {
      key: 'checkbox-item',
      title: 'Custom Checkbox Item',
      isSelectable: true,
      isSelected: checkboxItemEnabled,
      parentKey: Utils.utilityHelpers.defaultKeys.MENU,
    }, {
      key: 'additional-3',
      contentLocation: Utils.utilityHelpers.locations.FOOTER,
      title: 'Custom Footer',
      parentKey: Utils.utilityHelpers.defaultKeys.MENU,
    }];

    /**
     * The data provided for utilityConfig will be visible in the ApplicationLayout's header in the
     * standard rendering mode and within the menus in the compact rendering mode.
     *
     * The ApplicationLayout's Utils export provides a helper function named getDefaultUtilityConfig that will
     * generate the configuration for the standard set of utility options. If the standard configuration is not
     * desirable, an entirely custom configuration can be used instead.
     */
    const utilityConfig = Object.freeze({
      title: 'Test, User',
      accessory: userAvatar,
      menuItems: Utils.utilityHelpers.getDefaultUtilityItems(intl, userData, customUtilityItems),
      initialSelectedKey: Utils.utilityHelpers.defaultKeys.MENU,
      onChange: (event, itemData) => {
        disclosureManager.disclose({
          preferredType: 'modal',
          content: {
            component: <DisclosureComponent text={itemData.key} />,
          },
        });
      },
    });

    if (!activeNavigationItem) {
      return <Redirect to="/page_1" />;
    }

    return (
      <ContentContainer
        fill
        // header={<p>{location.pathname}</p>}
        id="application-layout-test"
      >
        <ApplicationLayout
          activeBreakpoint={activeBreakpoint}
          nameConfig={nameConfig}
          utilityConfig={utilityConfig}
          extensions={<Extensions />}
          navigationItems={navigationItems}
          activeNavigationItemKey={activeNavigationItem.key}
          onSelectNavigationItem={(navigationItemKey) => {
            if (this.state.activeNavigationItem !== navigationItemKey) {
              history.push(navigationItemKey);
            }
          }}
        >
          <ContentContainer
            fill
            header={(
              <DemographicsBanner
                age="25 Years"
                dateOfBirth="May 9, 1993"
                gender="Male"
                gestationalAge="April 5, 2016"
                identifiers={{ MRN: 12343, REA: '3JSDA' }}
                photo={<Image alt="My Cat" src="http://lorempixel.com/50/50/animals/7/" />}
                personName="Johnathon Doe"
                postMenstrualAge="April 7, 2016"
                preferredFirstName="John"
              />
            )}
          >
            <Switch>
              <Route path="/page_1" render={() => <Page1Content />} />
              <Route path="/page_2" render={() => <CommonContent contentName="Page 2" />} />
              <Route path="/page_3" render={() => <CommonContent contentName="Page 3" />} />
              <Route path="/page_4" render={() => <CommonContent contentName="Page 4" />} />
              <Route path="/page_5" render={() => <CommonContent contentName="Page 5" />} />
              <Route path="/page_6" render={() => <CommonContent contentName="Page 6" />} />
              <Route path="/page_7" render={() => <CommonContent contentName="Page 7" />} />
            </Switch>
          </ContentContainer>
        </ApplicationLayout>
      </ContentContainer>
    );
  }
}

TestApplication.propTypes = {
  intl: intlShape,
};

export default withActiveBreakpoint(withDisclosureManager(withRouter(injectIntl((TestApplication)))));
