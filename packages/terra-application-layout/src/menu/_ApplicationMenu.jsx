import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Button from 'terra-button';
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
  userConfig, heroConfig, navigationItems, activeNavigationItemKey, onSelectNavigationItem, onSelectSettings, onSelectHelp, onSelectLogout, onSelectUser, onSelectHero,
}) => {
  console.log('');

  let hero;
  if (heroConfig) {
    if (heroConfig.component) {
      hero = heroConfig.component;
    } else {
      hero = (
        <div>
          <p>{heroConfig.title}</p>
          <div>{heroConfig.accessory}</div>
        </div>
      );
    }
  }

  let user;
  if (userConfig) {
    if (userConfig.component) {
      user = userConfig.component;
    } else {
      user = (
        <div>
          <p>{userConfig.name}</p>
          <div>{userConfig.detail}</div>
          <div>{userConfig.photo}</div>
        </div>
      );
    }
  }

  let settings;
  if (onSelectSettings) {
    settings = <Button isBlock text="Settings" onClick={onSelectSettings} />;
  }

  let help;
  if (onSelectHelp) {
    help = <Button isBlock text="Help" onClick={onSelectHelp} />;
  }

  let logout;
  if (onSelectLogout) {
    logout = <Button isBlock text="Logout" onClick={onSelectLogout} />;
  }

  return (
    <div className={cx('application-menu')}>
      <div className={cx('body')}>
        <div className={cx('content')}>
          <div className={cx('normalizer')}>
            {hero}
            {user}
            {settings}
            {help}
            <NavigationSideMenu
              menuItems={[{
                childKeys: navigationItems.map(item => item.key),
                key: 'application_menu',
                text: '', // Text is a required value here, but it's never actually rendered
                isRootMenu: true,
              }].concat(navigationItems)}
              selectedMenuKey="application_menu"
              selectedChildKey={activeNavigationItemKey}
              onChange={(event, data) => {
                if (onSelectNavigationItem) {
                  onSelectNavigationItem(data.selectedChildKey);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className={cx('footer')}>
        {logout}
      </div>
      <div className={cx('application-menu-shadow-element')} />
    </div>
  );
};

ApplicationMenu.propTypes = propTypes;
ApplicationMenu.defaultProps = defaultProps;

export default ApplicationMenu;
