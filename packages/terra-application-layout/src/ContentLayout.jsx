import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withActiveBreakpoint } from 'terra-breakpoints';

import SecondaryNavigationMenu from './_SecondaryNavigationMenu';

import 'terra-base/lib/baseStyles';

import styles from './ContentLayout.module.scss';

const cx = classNames.bind(styles);

const ContentLayoutContext = React.createContext({});

const withContentLayout = (WrappedComponent) => {
  const WithContentLayoutComp = props => (
    <ContentLayoutContext.Consumer>
      {contentLayout => <WrappedComponent {...props} contentLayout={contentLayout} />}
    </ContentLayoutContext.Consumer>
  );

  WithContentLayoutComp.WrappedComponent = WrappedComponent;
  WithContentLayoutComp.displayName = `withContentLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithContentLayoutComp;
};

const isCompactContentLayout = activeBreakpoint => activeBreakpoint === 'tiny' || activeBreakpoint === 'small';

const propTypes = {
  menuItems: PropTypes.array,
  initialSelectedMenuItemKey: PropTypes.string,
  onTerminalMenuItemSelection: PropTypes.func,
  /**
   * The element to display in the main content area.
   */
  children: PropTypes.element,
  /**
   * @private
   */
  activeBreakpoint: PropTypes.string,
};

class ContentLayout extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!isCompactContentLayout(props.activeBreakpoint) && state.compactMenuIsOpen) {
      /**
       * The compact menu state is reset when a non-compact breakpoint is active.
       */
      return {
        compactMenuIsOpen: false,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.closeCompactMenu = this.closeCompactMenu.bind(this);
    this.openCompactMenu = this.openCompactMenu.bind(this);
    this.pinMenu = this.pinMenu.bind(this);
    this.unpinMenu = this.unpinMenu.bind(this);
    this.handleMenuItemSelection = this.handleMenuItemSelection.bind(this);

    this.state = {
      compactMenuIsOpen: false,
      menuIsPinnedOpen: true,
      compactContentProviderValue: {
        openMenu: this.openCompactMenu,
      },
      defaultContentProviderValue: {
        pinMenu: this.pinMenu,
        unpinMenu: this.unpinMenu,
        menuIsPinned: true,
      },
    };
  }

  closeCompactMenu(callback) {
    this.setState({
      compactMenuIsOpen: false,
    }, callback);
  }

  openCompactMenu() {
    this.setState({
      compactMenuIsOpen: true,
    });
  }

  pinMenu() {
    this.setState({
      menuIsPinnedOpen: true,
      defaultContentProviderValue: {
        pinMenu: this.pinMenu,
        unpinMenu: this.unpinMenu,
        menuIsPinned: true,
      },
    });
  }

  unpinMenu() {
    this.setState({
      menuIsPinnedOpen: false,
      defaultContentProviderValue: {
        pinMenu: this.pinMenu,
        unpinMenu: this.unpinMenu,
        menuIsPinned: false,
      },
    });
  }

  handleMenuItemSelection(key, metaData) {
    const {
      onTerminalMenuItemSelection, activeBreakpoint,
    } = this.props;

    if (isCompactContentLayout(activeBreakpoint)) {
      this.closeCompactMenu(() => {
        if (onTerminalMenuItemSelection) {
          onTerminalMenuItemSelection(key, metaData);
        }
      });
    } else if (onTerminalMenuItemSelection) {
      onTerminalMenuItemSelection(key, metaData);
    }
  }

  render() {
    const {
      menuItems,
      initialSelectedMenuItemKey,
      children,
      activeBreakpoint,
    } = this.props;

    const {
      compactMenuIsOpen,
      menuIsPinnedOpen,
      compactContentProviderValue,
      defaultContentProviderValue,
    } = this.state;

    const isCompact = isCompactContentLayout(activeBreakpoint);

    return (
      <div className={cx(['container', { 'panel-is-open': isCompact ? compactMenuIsOpen : menuIsPinnedOpen }])}>
        <div className={cx('panel')}>
          <SecondaryNavigationMenu
            menuItems={menuItems}
            initialSelectedKey={initialSelectedMenuItemKey}
            onChildItemSelection={this.handleMenuItemSelection}
            key={isCompact ? 'compact' : 'default'}
          />
        </div>
        <div className={cx('content')}>
          <ContentLayoutContext.Provider
            value={isCompact ? compactContentProviderValue : defaultContentProviderValue}
          >
            {children}
          </ContentLayoutContext.Provider>
        </div>
      </div>
    );
  }
}

ContentLayout.propTypes = propTypes;

export default withActiveBreakpoint(ContentLayout);
export {
  ContentLayoutContext,
  withContentLayout,
  isCompactContentLayout,
};
