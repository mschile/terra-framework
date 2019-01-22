import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Overlay from 'terra-overlay';
import tabbable from 'tabbable';
import NavigationSideMenu from 'terra-navigation-side-menu';
import Scroll from 'terra-scroll';

import ApplicationLayoutHeader from './header/_ApplicationLayoutHeader';
import ApplicationLayoutPropTypes from './utils/propTypes';
import Helpers, { isSizeCompact } from './utils/helpers';
import UtilityHelpers from './utils/utilityHelpers';

import 'terra-base/lib/baseStyles';

import styles from './ApplicationLayout.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The configuration values for the ApplicationName component.
   */
  nameConfig: ApplicationLayoutPropTypes.nameConfigPropType,
  /**
   * The content to be rendered in the ApplicationLayout's extensions region.
   */
  extensions: PropTypes.element,
  /**
   * Alignment of the header's navigation primary tabs. ( e.g start, center, end )
   */
  navigationAlignment: ApplicationLayoutPropTypes.navigationAlignmentPropType,
  /**
   * An array of Objects describing the ApplicationLayout's primary navigation items.
   */
  navigationItems: ApplicationLayoutPropTypes.navigationItemsPropType,
  /**
   * The string key identifying the navigation item determined to be active.
   */
  activeNavigationItemKey: PropTypes.string,
  /**
   * A function executed upon selection of a navigation item.
   */
  onSelectNavigationItem: PropTypes.func,
  /**
   * The configuration values for the ApplicationUtility component.
   */
  utilityConfig: ApplicationLayoutPropTypes.utilityConfigPropType,
  /**
   * Content to render within the body of the ApplicationLayout.
   */
  children: PropTypes.node,
  /**
   * The currently active breakpoint.
   */
  activeBreakpoint: PropTypes.string,
};

const defaultProps = {
  navigationItems: [],
};

class ApplicationLayout extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (state.menuIsOpen && !isSizeCompact(props.activeBreakpoint)) {
      return {
        menuIsOpen: false,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.setMenuPanelNode = this.setMenuPanelNode.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleNavigationItemSelection = this.handleNavigationItemSelection.bind(this);
    this.renderNavigationMenu = this.renderNavigationMenu.bind(this);

    this.state = {
      menuIsOpen: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { menuIsOpen } = this.state;

    if (menuIsOpen && !prevState.menuIsOpen) {
      if (tabbable(this.menuPanelNode)[0]) {
        tabbable(this.menuPanelNode)[0].focus();
      }
    } else if (!menuIsOpen && prevState.menuIsOpen) {
      // Sends focus back to the application layout header toggle button if it exists
      if (document.querySelector('button[data-application-header-toggle]')) {
        document.querySelector('button[data-application-header-toggle]').focus();
        // Otherwise, we'll send focus back to first interactable element in the main panel
      } else if (tabbable(document.querySelector('[data-terra-application-layout-main]'))[0]) {
        tabbable(document.querySelector('[data-terra-application-layout-main]'))[0].focus();
      }
    }
  }

  setMenuPanelNode(node) {
    this.menuPanelNode = node;
  }

  handleNavigationItemSelection(event, data) {
    this.setState({
      menuIsOpen: false,
    }, () => {
      const { onSelectNavigationItem } = this.props;
      if (onSelectNavigationItem) {
        onSelectNavigationItem(data.selectedChildKey);
      }
    });
  }

  handleMenuToggle() {
    this.setState(state => ({
      menuIsOpen: !state.menuIsOpen,
    }));
  }

  renderNavigationMenu() {
    const {
      navigationItems, activeNavigationItemKey,
    } = this.props;

    return (
      <div className={cx('primary-navigation-menu')}>
        <Scroll>
          <NavigationSideMenu
            menuItems={[{
              childKeys: navigationItems.map(item => item.key),
              key: 'primary_navigation_menu',
              text: 'Application Layout Primary Navigation Menu', // Text is a required value here, but it's never actually rendered
              isRootMenu: true,
            }].concat(navigationItems)}
            selectedMenuKey="primary_navigation_menu"
            selectedChildKey={activeNavigationItemKey}
            onChange={this.handleNavigationItemSelection}
          />
        </Scroll>
      </div>
    );
  }

  render() {
    const {
      nameConfig, utilityConfig, navigationAlignment, navigationItems, extensions, activeBreakpoint, children, activeNavigationItemKey, onSelectNavigationItem,
    } = this.props;
    const { menuIsOpen } = this.state;

    const isCompact = isSizeCompact(activeBreakpoint);

    return (
      <div className={cx('application-layout-container')}>
        <ApplicationLayoutHeader
          activeBreakpoint={activeBreakpoint}
          nameConfig={nameConfig}
          utilityConfig={utilityConfig}
          extensions={extensions}
          navigationItems={navigationItems}
          navigationItemAlignment={navigationAlignment}
          activeNavigationItemKey={activeNavigationItemKey}
          onSelectNavigationItem={onSelectNavigationItem}
          onMenuToggle={navigationItems.length ? this.handleMenuToggle : undefined}
        />
        <div className={cx(['application-layout-body', { 'menu-is-open': menuIsOpen }])}>
          <div className={cx('menu-panel')} aria-hidden={!menuIsOpen ? 'true' : null} ref={this.setMenuPanelNode}>
            {isCompact && navigationItems.length ? this.renderNavigationMenu() : undefined}
          </div>
          <main tabIndex="-1" className={cx('content')} data-terra-application-layout-main>
            <Overlay isRelativeToContainer onRequestClose={this.handleMenuToggle} isOpen={menuIsOpen} backgroundStyle="dark" />
            {children}
          </main>
        </div>
      </div>
    );
  }
}

ApplicationLayout.propTypes = propTypes;
ApplicationLayout.defaultProps = defaultProps;

export default ApplicationLayout;

const Utils = {
  helpers: Helpers,
  utilityHelpers: UtilityHelpers,
  propTypes: ApplicationLayoutPropTypes,
};

export { Utils };
