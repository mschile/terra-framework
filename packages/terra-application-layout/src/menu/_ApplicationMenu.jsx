import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Scroll from 'terra-scroll';
import NavigationSideMenu from 'terra-navigation-side-menu';

import styles from './ApplicationMenu.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  navigationItems: PropTypes.array,
  activeNavigationItemKey: PropTypes.string,
  onSelectNavigationItem: PropTypes.func,
  onSelectSettings: PropTypes.func,
};

const defaultProps = {
  navigationItems: [],
};

const ApplicationMenu = ({
  navigationItems, activeNavigationItemKey, onSelectNavigationItem, onSelectSettings,
}) => {
  console.log('');

  return (
    <div className={cx('application-menu')}>
      <div className={cx('header')}>
        <div>Header</div>
      </div>
      <div className={cx('body')}>
        <div className={cx('content')}>
          <div className={cx('normalizer')}>
            <NavigationSideMenu
              menuItems={[{
                childKeys: navigationItems.map(item => item.key).concat(['settings']),
                key: 'application_menu',
                text: '', // Text is a required value here, but it's never actually rendered
                isRootMenu: true,
              }].concat(navigationItems).concat({
                key: 'settings',
                text: 'Settings',
              })}
              selectedMenuKey="application_menu"
              selectedChildKey={activeNavigationItemKey}
              onChange={(event, data) => {
                if (data.selectedChildKey === 'settings') {
                  if (onSelectSettings) {
                    onSelectSettings();
                  }
                  return;
                }

                if (onSelectNavigationItem) {
                  onSelectNavigationItem(data.selectedChildKey);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className={cx('footer')}>
        <div>Footer</div>
      </div>
      <div className={cx('application-menu-shadow-element')} />
    </div>
  );
};

ApplicationMenu.propTypes = propTypes;
ApplicationMenu.defaultProps = defaultProps;

export default ApplicationMenu;
