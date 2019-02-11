import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Button from 'terra-button';
import IconSettings from 'terra-icon/lib/icon/IconSettings';
import IconUnknown from 'terra-icon/lib/icon/IconUnknown';
import Avatar from 'terra-avatar';

import HeroLayout from './_HeroLayout';

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
  userConfig, heroConfig, navigationItems, activeNavigationItemKey, onSelectNavigationItem, onSelectSettings, onSelectHelp, onSelectLogout,
}) => {
  let hero;
  if (heroConfig) {
    if (heroConfig.component) {
      hero = heroConfig.component;
    } else {
      hero = (
        <div>
          <div>{heroConfig.title}</div>
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
        <HeroLayout
          title={userConfig.name}
          detail={userConfig.detail}
          header={<Avatar alt={userConfig.name} image={userConfig.image} initials={userConfig.initials} size={'3rem'} />}
        />
      );
    }
  }

  let logout;
  if (onSelectLogout) {
    logout = <Button isBlock text="Logout" onClick={onSelectLogout} />;
  }

  return (
    <div className={cx('application-menu')}>
      <div className={cx('vertical-overflow-container')}>
        <div className={cx('header')}>
          {hero}
          {user}
        </div>
        <ul className={cx('navigation-list')} role="listbox">
          {navigationItems.map(item => (
            <li
              key={item.key} 
              className={cx(['navigation-list-item', { 'active': item.key === activeNavigationItemKey }])} 
              aria-selected={item.key === activeNavigationItemKey ? true : null}
              onClick={() => {
                if (onSelectNavigationItem) {
                  onSelectNavigationItem(item.key);
                }
              }}
              role="option"
              tabIndex="0"
            >
              {item.key === activeNavigationItemKey ? <div className={cx('active-indicator')} /> : null}
              {item.text}
            </li>
          ))}
        </ul>
        <ul className={cx('utility-list')} role="listbox">
          {onSelectSettings ? (
            <li 
              key={'application-menu.settings'} 
              className={cx('utility-list-item')} 
              onClick={() => { onSelectSettings(); }}
              role="option"
              tabIndex="0"
            >
              <IconSettings className={cx('utility-menu-icon')} />
              Settings
            </li>
          ) : null}
          {onSelectHelp ? (
            <li 
              key={'application-menu.help'} 
              className={cx('utility-list-item')} 
              onClick={() => { onSelectHelp(); }}
              role="option"
              tabIndex="0"
            >
              <IconUnknown className={cx('utility-menu-icon')} />
              Help
            </li>
          ) : null}
        </ul>
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
