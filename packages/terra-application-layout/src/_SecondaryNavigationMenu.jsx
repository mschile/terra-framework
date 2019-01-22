import React from 'react';
import PropTypes from 'prop-types';
import NavigationSideMenu from 'terra-navigation-side-menu';
import { withActiveBreakpoint } from 'terra-breakpoints';

const propTypes = {
  menuItems: PropTypes.array,
  initialSelectedKey: PropTypes.string,
  onChildItemSelection: PropTypes.func,
  activeBreakpoint: PropTypes.string,
};

class SecondaryNavigationMenu extends React.Component {
  static buildAncestorMap(menuItems) {
    const ancestorMap = {};
    menuItems.forEach((item) => {
      ancestorMap[item.key] = SecondaryNavigationMenu.findAncestor(item.key, menuItems);
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
      return [...SecondaryNavigationMenu.buildSelectionPath(ancestorMap[key].key, ancestorMap)].concat([key]);
    }

    return [key];
  }

  constructor(props) {
    super(props);

    this.onMenuChange = this.onMenuChange.bind(this);

    this.ancestorMap = SecondaryNavigationMenu.buildAncestorMap(props.menuItems);

    const initialState = {};
    const selectedItem = props.menuItems.find(item => item.key === props.initialSelectedKey);
    const parentItem = this.ancestorMap[props.initialSelectedKey];

    if (selectedItem.childKeys && selectedItem.childKeys.length) {
      initialState.selectedMenuKey = selectedItem.key;
      initialState.selectedChildKey = undefined;
    } else if (parentItem) {
      initialState.selectedMenuKey = parentItem.key;
      initialState.selectedChildKey = selectedItem.key;
      initialState.selectionPath = SecondaryNavigationMenu.buildSelectionPath(selectedItem.key, this.ancestorMap);
    }

    this.state = initialState;
  }

  onMenuChange(event, selectionData) {
    const { onChildItemSelection } = this.props;
    const { selectionPath } = this.state;

    const newChildKey = selectionData.selectedChildKey;
    const newMenuKey = selectionData.selectedMenuKey;

    // If an endpoint has been reached, reset selection path and update.
    if (newChildKey && selectionData.metaData && selectionData.metaData.path) {
      this.setState({
        selectionPath: SecondaryNavigationMenu.buildSelectionPath(newChildKey, this.ancestorMap),
        selectedChildKey: newChildKey,
        selectedMenuKey: newMenuKey,
      }, () => {
        if (onChildItemSelection) {
          onChildItemSelection(newChildKey, selectionData.metaData);
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
    const { menuItems, activeBreakpoint } = this.props;
    const {
      selectedMenuKey, selectedChildKey,
    } = this.state;

    const isCompact = activeBreakpoint === 'tiny' || activeBreakpoint === 'small';

    /**
     * At within compact viewports, the SecondaryNavigationMenu should render each menu item as if it has
     * a submenu, as selecting a childless item will cause the menu close.
     */
    let managedMenuItems = menuItems;
    if (activeBreakpoint === 'tiny' || activeBreakpoint === 'small') {
      managedMenuItems = managedMenuItems.map(item => (
        Object.assign({}, item, { hasSubMenu: true })
      ));
    }

    return (
      <NavigationSideMenu
        menuItems={managedMenuItems}
        selectedMenuKey={selectedMenuKey}
        selectedChildKey={!isCompact ? selectedChildKey : null}
        onChange={this.onMenuChange}
      />
    );
  }
}

SecondaryNavigationMenu.propTypes = propTypes;

export default withActiveBreakpoint(SecondaryNavigationMenu);
