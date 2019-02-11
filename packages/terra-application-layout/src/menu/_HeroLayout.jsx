import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Avatar from 'terra-avatar';

import styles from './HeroLayout.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  title: PropTypes.string,
  detail: PropTypes.string,
  imageSrc: PropTypes.string,
};

const HeroLayout = ({ header, title, detail }) => {
  return (
    <div className={cx('hero-layout')}>
      <span className={cx('header')}>{header}</span>
      <div className={cx('title')}>{title}</div>
      <div className={cx('detail')}>{detail}</div>
    </div>
  )
};

HeroLayout.propTypes = propTypes;

export default HeroLayout;
