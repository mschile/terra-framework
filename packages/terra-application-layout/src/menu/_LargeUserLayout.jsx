import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Avatar from 'terra-avatar';

import styles from './LargeUserLayout.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  userConfig: PropTypes.object,
};

const LargeUserLayout = ({ userConfig }) => (
  <div className={cx('large-user-layout')}>
    <div className={cx('avatar')}>
      <Avatar alt={userConfig.name} image={userConfig.image} initials={userConfig.initials} size={'3rem'} />
    </div>
    <div className={cx('name')}>{userConfig.name}</div>
    <div className={cx('detail')}>{userConfig.detail}</div>
  </div>
);

LargeUserLayout.propTypes = propTypes;

export default LargeUserLayout;
