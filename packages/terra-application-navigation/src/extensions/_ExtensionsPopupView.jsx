import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import ActionFooter from 'terra-action-footer';

import ExtensionHelper from './_ExtensionHelper';

import styles from './ExtensionsPopupView.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * An array of extensions representing the rolled up items.
   */
  extensions: PropTypes.array,
  /**
   * Function callback for closing the popup.
   */
  onRequestClose: PropTypes.func,
  /**
   * @private
   * Prop from terra-popup indicating that the popup containing this element is height contrained.
   */
  isHeightBounded: PropTypes.bool,
};

const defaultProps = {
  extensions: [],
};

const ExtensionsPopupView = ({
  extensions,
  onRequestClose,
  isHeightBounded,
}) => (
  <ContentContainer
    header={<ActionHeader title="Extensions" />}
    footer={<ActionFooter />}
    fill={isHeightBounded}
    className={cx('extensions-popup-view')}
  >
    {ExtensionHelper(extensions, onRequestClose, true)}
  </ContentContainer>
);

ExtensionsPopupView.propTypes = propTypes;
ExtensionsPopupView.defaultProps = defaultProps;

export default ExtensionsPopupView;
