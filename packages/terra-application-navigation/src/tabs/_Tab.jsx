import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { KEY_SPACE, KEY_RETURN } from 'keycode-js';
import Count from './_TabCount';
import styles from './Tab.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The identifier for the tab.
   */
  tabKey: PropTypes.string.isRequired,
  /**
   * The display text for the tab.
   */
  text: PropTypes.string.isRequired,
  /**
   * The click callback of the tab.
   */
  onTabClick: PropTypes.func,
  /**
   * The number of notifications to be displayed for the tab.
   */
  notificationCount: PropTypes.number,
  /**
   * Boolean indicating whether or not the Tab should render as active.
   */
  isActive: PropTypes.bool,
  /**
   * Callback function for the tab node.
   */
  refCallback: PropTypes.func,
  /**
   * Boolean indicating whether or not the Tab should account for count spacing.
   */
  hasCount: PropTypes.bool,
  /**
   * An option icon for tab.
   */
  icon: PropTypes.element,
  /**
   * Render prop for dynamic tab contents.
   */
  render: PropTypes.func,
};

const getCountClass = (hasCount, notificationCount) => {
  let countClass = hasCount ? 'has-count' : null;
  if (notificationCount > 0) {
    if (notificationCount < 10) {
      countClass = 'has-one-digit';
    } else if (notificationCount < 100) {
      countClass = 'has-two-digit';
    } else {
      countClass = 'has-plus-digit';
    }
  }
  return countClass;
};

const getRenderTabClasses = isActive => cx([
  'tab',
  'is-custom',
  { 'is-disabled': isActive },
]);

const getDefaultTabClasses = (isActive, countClass) => cx([
  'tab',
  { 'is-disabled': isActive },
  countClass,
]);

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    // Add focus styles for keyboard navigation
    if (event.nativeEvent.keyCode === KEY_SPACE || event.nativeEvent.keyCode === KEY_RETURN) {
      event.preventDefault();
      this.handleOnClick(event);
    }
  }

  handleOnClick() {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabKey);
    }
  }

  render() {
    const {
      text,
      hasCount,
      icon,
      isActive,
      refCallback,
      render,
      notificationCount,
    } = this.props;

    const tabAttr = { 'aria-current': isActive };
    let tabClassNames;
    let tabContent;

    if (render) {
      tabClassNames = getRenderTabClasses(isActive);

      tabContent = (
        render({
          text,
          hasCount,
          icon,
          isActive,
          notificationCount,
        })
      );
    } else {
      const countClass = getCountClass(hasCount, notificationCount);
      tabClassNames = getDefaultTabClasses(isActive, countClass);

      tabContent = (
        <span className={cx(['tab-inner'])}>
          <span className={cx(['tab-label'])}>{text}</span>
          {notificationCount > 0 && <span className={cx('tab-count')}><Count value={notificationCount} /></span>}
        </span>
      );
    }

    return (
      <div
        {...tabAttr}
        type="button"
        role="link"
        tabIndex="0"
        className={tabClassNames}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        data-item-show-focus
        onBlur={(event) => {
          event.currentTarget.setAttribute('data-item-show-focus', 'true');
        }}
        onMouseDown={(event) => {
          event.currentTarget.setAttribute('data-item-show-focus', 'false');
        }}
        ref={refCallback}
      >
        {tabContent}
      </div>
    );
  }
}

Tab.propTypes = propTypes;

export default Tab;