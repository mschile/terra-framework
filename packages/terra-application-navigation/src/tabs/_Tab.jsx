import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { KEY_SPACE, KEY_RETURN, KEY_TAB } from 'keycode-js';
import Count from './_TabCount';
import styles from './Tab.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Whether or not the tab is collapsed styled and present in the menu.
   */
  isCollapsed: PropTypes.bool,
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
  notificationCount: PropTypes.number,
  /**
   * Boolean indicating whether or not the Tab should render as active.
   */
  isActive: PropTypes.bool,
  refCallback: PropTypes.func,
  hasCount: PropTypes.bool,
  icon: PropTypes.element,
};

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false, focused: false };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.setNode = this.setNode.bind(this);
    this.listener = this.listener.bind(this);
  }

  componentDidMount() {
    if (this.node) {
      this.node.addEventListener('animationend', this.listener);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.notificationCount > prevProps.notificationCount) {
      this.node.setAttribute('data-count-pulse', 'true');
    }
  }

  setNode(node) {
    this.node = node;
  }

  listener() {
    this.node.setAttribute('data-count-pulse', 'false');
  }

  handleOnBlur() {
    this.setState({ focused: false });
  }

  handleKeyDown(event) {
    // Add active state to FF browsers
    if (event.nativeEvent.keyCode === KEY_SPACE) {
      this.setState({ active: true });
    }

    // Add focus styles for keyboard navigation
    if (event.nativeEvent.keyCode === KEY_SPACE || event.nativeEvent.keyCode === KEY_RETURN) {
      this.setState({ focused: true });

      event.preventDefault();
      this.handleOnClick(event);
    }
  }

  handleKeyUp(event) {
    // Remove active state from FF broswers
    if (event.nativeEvent.keyCode === KEY_SPACE) {
      this.setState({ active: false });
    }

    // Apply focus styles for keyboard navigation
    if (event.nativeEvent.keyCode === KEY_TAB) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ focused: true });
    }
  }

  handleOnClick() {
    if (this.props.onTabClick) {
      this.props.onTabClick(this.props.tabKey);
    }
  }

  render() {
    const {
      isCollapsed,
      text,
      hasCount,
      icon,
      isActive,
      refCallback,
      notificationCount,
    } = this.props;

    let countClass = hasCount ? 'has-count' : null;
    let numberOfDigits = null;
    if (notificationCount > 0) {
      if (notificationCount < 10) {
        countClass = 'has-one-digit';
        numberOfDigits = 'one';
      } else if (notificationCount < 100) {
        countClass = 'has-two-digit';
        numberOfDigits = 'two';
      } else {
        countClass = 'has-plus-digit';
        numberOfDigits = 'plus';
      }
    }

    const tabClassNames = cx([
      'tab',
      { 'is-disabled': isActive && !isCollapsed },
      { 'is-active': this.state.active },
      { 'is-focused': this.state.focused },
      { 'has-icon': !!icon },
      countClass,
    ]);
    const tabAttr = { 'aria-current': isActive };

    return (
      <button
        {...tabAttr}
        type="button"
        role="link"
        tabIndex="0"
        className={tabClassNames}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onBlur={this.handleOnBlur}
        ref={refCallback}
      >
        <span className={cx(['tab-inner'])}>
          {!!icon && <span className={cx('tab-icon')}>{icon}</span>}
          <span className={cx(['tab-label'])}>{text}</span>
          {!isCollapsed && <span className={cx(['tab-label-bold'])}>{text}</span>}
          {notificationCount > 0 && <span className={cx('tab-count')}><Count refCallback={this.setNode} value={notificationCount} tabDigits={numberOfDigits} /></span>}
        </span>
      </button>
    );
  }
}

Tab.propTypes = propTypes;

export default Tab;