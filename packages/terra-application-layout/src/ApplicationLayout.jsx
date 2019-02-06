import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Overlay from 'terra-overlay';
import { withActiveBreakpoint } from 'terra-breakpoints';
import FocusTrap from 'focus-trap-react';

import ApplicationLayoutHeader from './header/_ApplicationLayoutHeader';
import ApplicationLayoutPropTypes from './utils/propTypes';
import Helpers, { isSizeCompact } from './utils/helpers';
import UtilityHelpers from './utils/utilityHelpers';
import ExtensionDrawer from './extensions/ExtensionDrawer';
import ExtensionBar from './extensions/ExtensionBar';
import ApplicationMenu from './menu/_ApplicationMenu';

import 'terra-base/lib/baseStyles';

import styles from './ApplicationLayout.module.scss';

const cx = classNames.bind(styles);

const createExtensions = (extensionConfig, activeBreakpoint, extensionIsOpen, handleExtensionToggle) => (
  <ExtensionBar
    extensionConfig={extensionConfig}
    activeBreakpoint={activeBreakpoint}
    isOpen={extensionIsOpen}
    onRequestClose={handleExtensionToggle}
  />
);

const createExtensionDrawer = (extensionConfig, activeBreakpoint, extensionIsOpen, handleExtensionToggle) => {
  if (!extensionConfig || !extensionIsOpen) {
    return null;
  }

  return (
    <ExtensionDrawer
      extensionConfig={extensionConfig}
      activeBreakpoint={activeBreakpoint}
      isOpen={extensionIsOpen}
      onRequestClose={handleExtensionToggle}
    />
  );
};

const propTypes = {
  /**
   * The configuration values for the ApplicationName component.
   */
  nameConfig: ApplicationLayoutPropTypes.nameConfigPropType,
  /**
   * The content to be rendered in the ApplicationLayout's extensions region.
   */
  extensionConfig: ApplicationLayoutPropTypes.extensionConfigPropType,
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

    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.setMenuPanelNode = this.setMenuPanelNode.bind(this);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleExtensionToggle = this.handleExtensionToggle.bind(this);
    this.handleNavigationItemSelection = this.handleNavigationItemSelection.bind(this);
    this.renderNavigationMenu = this.renderNavigationMenu.bind(this);

    this.hideMenu = true;

    this.state = {
      menuIsOpen: false,
      extensionIsOpen: false,
    };
  }

  componentDidMount() {
    if (this.transformContainerRef) {
      this.transformContainerRef.addEventListener('transitionend', this.handleTransitionEnd);
    }
  }

  componentWillUnmount() {
    if (this.transformContainerRef) {
      this.transformContainerRef.removeEventListener('transitionend', this.handleTransitionEnd);
    }
  }

  setMenuPanelNode(node) {
    this.menuPanelNode = node;
  }

  handleNavigationItemSelection(selectedChildKey) {
    this.setState({
      menuIsOpen: false,
    }, () => {
      const { onSelectNavigationItem } = this.props;
      if (onSelectNavigationItem) {
        onSelectNavigationItem(selectedChildKey);
      }
    });
  }

  handleMenuToggle() {
    this.setState(state => ({
      menuIsOpen: !state.menuIsOpen,
    }));
  }

  handleExtensionToggle() {
    this.setState(state => ({
      extensionIsOpen: !state.extensionIsOpen,
    }));
  }

  handleTransitionEnd() {
    if (!this.state.menuIsOpen) {
      this.menuPanelNode.style.visibility = 'hidden';
      this.hideMenu = true;
    } else {
      this.hideMenu = false;
    }
  }

  renderNavigationMenu() {
    const {
      navigationItems, activeNavigationItemKey,
    } = this.props;

    return (
      <ApplicationMenu
        navigationItems={navigationItems}
        activeNavigationItemKey={activeNavigationItemKey}
        onSelectNavigationItem={this.handleNavigationItemSelection}
      />
    );
  }

  render() {
    const {
      nameConfig, utilityConfig, navigationAlignment, navigationItems, extensionConfig, activeBreakpoint, children, activeNavigationItemKey, onSelectNavigationItem,
    } = this.props;
    const { menuIsOpen, extensionIsOpen } = this.state;

    const isCompact = isSizeCompact(activeBreakpoint);
    const extensions = createExtensions(extensionConfig, activeBreakpoint, extensionIsOpen, this.handleExtensionToggle);
    const extensionDrawer = createExtensionDrawer(extensionConfig, activeBreakpoint, extensionIsOpen, this.handleExtensionToggle);

    /**
     * Reset visibility to ensure menu will be visible if the menu is being opened. If it's not being opened, the visibility will
     * be immediately set to hidden when the menuPanel is re
     */
    if (this.menuPanelNode) {
      this.menuPanelNode.style.visibility = '';
    }

    return (
      <div className={cx(['application-layout-container', { 'menu-is-open': menuIsOpen }])}>
        <div className={cx('transform-container')} ref={(ref) => { this.transformContainerRef = ref; }}>
          <div className={cx('body')} aria-hidden={menuIsOpen ? true : null}>
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
            {extensionDrawer}
            <main tabIndex="-1" className={cx('content')} data-terra-application-layout-main>
              <Overlay isRelativeToContainer onRequestClose={event => event.stopPropagation()} isOpen={extensionIsOpen} backgroundStyle="dark" style={{ zIndex: '7000' }} />
              {children}
            </main>
            <Overlay isRelativeToContainer isOpen={menuIsOpen} backgroundStyle="clear" />
          </div>
          <div className={cx('menu-panel')} aria-hidden={!menuIsOpen ? true : null} ref={this.setMenuPanelNode} style={this.hideMenu && !menuIsOpen ? { visibility: 'hidden' } : null}>
            {isCompact && navigationItems.length ? (
              <FocusTrap
                active={menuIsOpen}
                focusTrapOptions={{
                  escapeDeactivates: true,
                  returnFocusOnDeactivate: true,
                  clickOutsideDeactivates: true,
                  onDeactivate: () => {
                    if (this.state.menuIsOpen) {
                      this.setState({ menuIsOpen: false });
                    }
                  },
                }}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              >
                {this.renderNavigationMenu()}
              </FocusTrap>
            ) : undefined}
          </div>
        </div>
      </div>
    );
  }
}

ApplicationLayout.propTypes = propTypes;
ApplicationLayout.defaultProps = defaultProps;

export default withActiveBreakpoint(ApplicationLayout);

const Utils = {
  helpers: Helpers,
  utilityHelpers: UtilityHelpers,
  propTypes: ApplicationLayoutPropTypes,
};

export { Utils };
