import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withActiveBreakpoint } from 'terra-breakpoints';
import NavigationSideMenu from 'terra-navigation-side-menu';

import 'terra-base/lib/baseStyles';

import styles from './ContentLayout.module.scss';

const cx = classNames.bind(styles);

const ContentLayoutContext = React.createContext();

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
  static buildAncestorMap(menuItems) {
    const ancestorMap = {};
    menuItems.forEach((item) => {
      ancestorMap[item.key] = ContentLayout.findAncestor(item.key, menuItems);
    });

    return ancestorMap;
  }

  static findAncestor(key, menuItems) {
    for (let i = 0, numberOfItems = menuItems.length; i < numberOfItems; i += 1) {
      const item = menuItems[i];
      if (item.childKeys && item.childKeys.indexOf(key) >= 0) {
        return item;
      }
    }
    return undefined;
  }

  static buildSelectionPath(key, ancestorMap) {
    if (ancestorMap[key]) {
      return [...ContentLayout.buildSelectionPath(ancestorMap[key].key, ancestorMap)].concat([key]);
    }

    return [key];
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if (state.previousActiveBreakpoint !== props.activeBreakpoint) {
      newState.previousActiveBreakpoint = props.activeBreakpoint;
    }

    if (!isCompactContentLayout(props.activeBreakpoint) && state.compactMenuIsOpen) {
      /**
       * The compact menu state is reset when a non-compact breakpoint is active.
       */
      newState.compactMenuIsOpen = false;
    }

    if ((!isCompactContentLayout(state.previousActiveBreakpoint) && isCompactContentLayout(props.activeBreakpoint))
    || (isCompactContentLayout(state.previousActiveBreakpoint) && !isCompactContentLayout(props.activeBreakpoint))) {
      if (state.selectionPath) {
        newState.selectedMenuKey = state.selectionPath[state.selectionPath.length - 2];
        newState.selectedChildKey = state.selectionPath[state.selectionPath.length - 1];
      }
    }

    return newState;
  }

  constructor(props) {
    super(props);

    this.openCompactMenu = this.openCompactMenu.bind(this);
    this.pinMenu = this.pinMenu.bind(this);
    this.unpinMenu = this.unpinMenu.bind(this);
    this.handleMenuItemSelection = this.handleMenuItemSelection.bind(this);

    this.ancestorMap = ContentLayout.buildAncestorMap(props.menuItems);

    const selectedItem = props.menuItems.find(item => item.key === props.initialSelectedMenuItemKey);
    const parentItem = this.ancestorMap[props.initialSelectedMenuItemKey];

    let selectedMenuKey;
    let selectedChildKey;
    let selectionPath;
    if (selectedItem.childKeys && selectedItem.childKeys.length) {
      selectedMenuKey = selectedItem.key;
      selectedChildKey = undefined;
      selectionPath = undefined;
    } else if (parentItem) {
      selectedMenuKey = parentItem.key;
      selectedChildKey = selectedItem.key;
      selectionPath = ContentLayout.buildSelectionPath(selectedItem.key, this.ancestorMap);
    }

    this.state = {
      previousActiveBreakpoint: props.activeBreakpoint, // eslint-disable-line react/no-unused-state
      selectedMenuKey,
      selectedChildKey,
      selectionPath,
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

  handleMenuItemSelection(event, selectionData) {
    const { onTerminalMenuItemSelection } = this.props;
    const { selectionPath } = this.state;

    const newChildKey = selectionData.selectedChildKey;
    const newMenuKey = selectionData.selectedMenuKey;

    // If an endpoint has been reached, reset selection path and update.
    if (newChildKey && selectionData.metaData && selectionData.metaData.path) {
      this.setState({
        compactMenuIsOpen: false,
        selectionPath: ContentLayout.buildSelectionPath(newChildKey, this.ancestorMap),
        selectedChildKey: newChildKey,
        selectedMenuKey: newMenuKey,
      }, () => {
        if (onTerminalMenuItemSelection) {
          onTerminalMenuItemSelection(newChildKey, selectionData.metaData);
        }
      });

      return;
    }

    if (selectionPath.indexOf(newChildKey) >= 0) {
      this.setState({
        selectedMenuKey: newMenuKey,
        selectedChildKey: newChildKey,
      });
    } else if (selectionPath.indexOf(newMenuKey) >= 0) {
      this.setState({
        selectedMenuKey: newMenuKey,
        selectedChildKey: selectionPath[selectionPath.indexOf(newMenuKey) + 1],
      });
    } else {
      this.setState({
        selectedMenuKey: newMenuKey,
        selectedChildKey: undefined,
      });
    }
  }

  render() {
    const {
      menuItems,
      children,
      activeBreakpoint,
    } = this.props;

    const {
      compactMenuIsOpen,
      menuIsPinnedOpen,
      compactContentProviderValue,
      defaultContentProviderValue,
      selectedMenuKey,
      selectedChildKey,
    } = this.state;

    const isCompact = isCompactContentLayout(activeBreakpoint);

    /**
     * At within compact viewports, the navigation menu should render each menu item as if it has
     * a submenu, as selecting a childless item will cause the menu close.
     */
    let managedMenuItems = menuItems;
    if (activeBreakpoint === 'tiny' || activeBreakpoint === 'small') {
      managedMenuItems = managedMenuItems.map(item => (
        Object.assign({}, item, { hasSubMenu: true })
      ));
    }

    return (
      <div className={cx(['container', { 'panel-is-open': isCompact ? compactMenuIsOpen : menuIsPinnedOpen }])}>
        <div className={cx('panel')}>
          <NavigationSideMenu
            menuItems={managedMenuItems}
            selectedMenuKey={selectedMenuKey}
            selectedChildKey={!isCompact ? selectedChildKey : null}
            onChange={this.handleMenuItemSelection}
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
