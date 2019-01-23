import React from 'react';
import {
  withRouter, matchPath, Redirect, Switch, Route,
} from 'react-router-dom';
import CommonContent from './CommonContent';
import SecondaryNavigationLayout from '../../../../SecondaryNavigationLayout';

class Page1Content extends React.Component {
  static getInitialSelectedKey(pathname) {
    if (matchPath(pathname, '/page_1/about')) {
      return 'about';
    }

    if (matchPath(pathname, '/page_1/components/1')) {
      return 'component_1';
    }

    if (matchPath(pathname, '/page_1/components/2')) {
      return 'component_2';
    }

    if (matchPath(pathname, '/page_1/tests')) {
      return 'tests';
    }

    /**
     * If the path doesn't match any know values, the initial key is set to 'about'. This value is reinforced
     * by the Redirect to the /page_1/about page.
     */
    return 'about';
  }

  constructor(props) {
    super(props);

    this.state = {
      initialSelectedKey: Page1Content.getInitialSelectedKey(props.location.pathname),
      menuItems: [{
        childKeys: ['about', 'components', 'tests'],
        key: 'page_1_menu',
        text: 'Page 1 Menu',
      }, {
        childKeys: ['component_1', 'component_2'],
        key: 'components',
        text: 'Components',
      }, {
        key: 'component_1',
        text: 'Component 1',
        metaData: {
          path: '/page_1/components/1',
        },
      }, {
        key: 'component_2',
        text: 'Component 2',
        metaData: {
          path: '/page_1/components/2',
        },
      }, {
        key: 'about',
        text: 'About',
        metaData: {
          path: '/page_1/about',
        },
      }, {
        key: 'tests',
        text: 'Tests',
        metaData: {
          path: '/page_1/tests',
        },
      }],
    };
  }

  render() {
    const { history } = this.props;
    const { menuItems, initialSelectedKey } = this.state;

    return (
      <SecondaryNavigationLayout
        menuItems={menuItems}
        initialSelectedMenuItemKey={initialSelectedKey}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          history.push(metaData.path);
        }}
      >
        <Switch>
          <Route path="/page_1/about" render={() => <CommonContent contentName="About" />} />
          <Route path="/page_1/components/1" render={() => <CommonContent contentName="Component 1" />} />
          <Route path="/page_1/components/2" render={() => <CommonContent contentName="Component 2" />} />
          <Route path="/page_1/tests" render={() => <CommonContent contentName="Tests" />} />
          <Redirect to="/page_1/about" />
        </Switch>
      </SecondaryNavigationLayout>
    );
  }
}

export default withRouter(Page1Content);
