import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, intlShape } from 'react-intl';
import { withDisclosureManager, disclosureManagerShape } from 'terra-disclosure-manager';
import ApplicationHeaderLayout from 'terra-application-header-layout';
import { ApplicationHeaderUtility } from 'terra-application-utility';
import { ApplicationHeaderName } from 'terra-application-name';
import IconMenu from 'terra-icon/lib/icon/IconMenu';
import Popup from 'terra-popup';

import ApplicationTabs from './tabs/_ApplicationTabs';
import ApplicationLayoutPropTypes from '../utils/propTypes';
import { isSizeCompact } from '../utils/helpers';

import 'terra-base/lib/baseStyles';
import styles from './ApplicationLayoutHeader.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * A function to be executed upon selection of the ApplicationHeader's toggle button.
   */
  onMenuToggle: PropTypes.func,
  /**
   * Configuration values for the ApplicationName component.
   */
  nameConfig: ApplicationLayoutPropTypes.nameConfigPropType,
  /**
   * Array of navigation items to render within the ApplicationHeader.
   */
  navigationItems: PropTypes.array,
  /**
   * The string specifying the desired alignment for the navigation items.
   */
  navigationItemAlignment: ApplicationLayoutPropTypes.navigationAlignmentPropType,
  /**
   * The string identifying the currently active navigation item.
   */
  activeNavigationItemKey: PropTypes.string,
  /**
   * A function to be executed upon selection of a navigation item.
   */
  onSelectNavigationItem: PropTypes.func,
  /**
   * The element to be placed within the fit start area for extensions within the layout.
   */
  extensions: PropTypes.element,
  /**
   * Configuration to be provided to the ApplicationUtility component.
   */
  utilityConfig: ApplicationLayoutPropTypes.utilityConfigPropType,
  /**
   * The currently active breakpoint.
   */
  activeBreakpoint: PropTypes.string,
  /**
   * @private Internationalization object with translation APIs automatically provided by a Base ancestor.
   */
  intl: intlShape,
  /**
   * @private DisclosureManagerDelegate instance automatically provided by a DisclosureManager ancestor.
   */
  disclosureManager: disclosureManagerShape,
  userConfig: PropTypes.object,
  heroConfig: PropTypes.object,
  onSelectSettings: PropTypes.func,
  onSelectHelp: PropTypes.func,
  onSelectLogout: PropTypes.func,
  onSelectUser: PropTypes.func,
};

const defaultProps = {
  navigationItems: [],
  navigationItemAlignment: 'center',
};

class ApplicationHeader extends React.Component {
  constructor(props) {
    super(props);

    this.handleUtilityDiscloseRequest = this.handleUtilityDiscloseRequest.bind(this);
    this.handleUtilityPopupCloseRequest = this.handleUtilityPopupCloseRequest.bind(this);
    this.handleUtilityOnChange = this.handleUtilityOnChange.bind(this);
    this.getTargetRef = this.getTargetRef.bind(this);
    this.setContentNode = this.setContentNode.bind(this);
    this.renderToggle = this.renderToggle.bind(this);
    this.renderAppName = this.renderAppName.bind(this);
    this.renderNavigationTabs = this.renderNavigationTabs.bind(this);
    this.renderUtilities = this.renderUtilities.bind(this);
    this.renderUtilitiesPopup = this.renderUtilitiesPopup.bind(this);

    this.state = { utilityComponent: undefined };
  }

  setContentNode(node) {
    this.contentNode = node;
  }

  getTargetRef() {
    if (this.contentNode) {
      return this.contentNode.querySelector('[data-application-header-utility]');
    }
    return undefined;
  }

  handleUtilityDiscloseRequest(utility) {
    this.setState({
      utilityComponent: React.cloneElement(utility, { onRequestClose: this.handleUtilityPopupCloseRequest }),
    });
  }

  handleUtilityPopupCloseRequest() {
    if (this.state.utilityComponent) {
      this.setState({ utilityComponent: undefined });
    }
  }

  handleUtilityOnChange(event, itemData) {
    const { utilityConfig, disclosureManager } = this.props;

    utilityConfig.onChange(event, itemData, disclosureManager && disclosureManager.disclose);
  }

  renderToggle() {
    const { onMenuToggle, intl } = this.props;

    if (onMenuToggle) {
      return (
        <div className={cx('toggle-button-container')}>
          <button
            type="button"
            className={cx('toggle-button')}
            aria-label={intl.formatMessage({ id: 'Terra.applicationLayout.applicationHeader.menuToggleLabel' })}
            onClick={onMenuToggle}
            data-application-header-toggle
          >
            <IconMenu />
          </button>
        </div>
      );
    }

    return null;
  }

  renderAppName() {
    const { nameConfig } = this.props;

    if (nameConfig && (nameConfig.accessory || nameConfig.title)) {
      return (
        <ApplicationHeaderName accessory={nameConfig.accessory} title={nameConfig.title} />
      );
    }

    return null;
  }

  renderNavigationTabs() {
    const {
      navigationItems, navigationItemAlignment, activeNavigationItemKey, onSelectNavigationItem,
    } = this.props;

    if (navigationItems.length) {
      return (
        <ApplicationTabs
          alignment={navigationItemAlignment}
          tabs={navigationItems}
          activeTabKey={activeNavigationItemKey}
          onTabSelect={onSelectNavigationItem}
        />
      );
    }

    return null;
  }

  renderUtilities() {
    const { utilityConfig, activeBreakpoint } = this.props;

    const isCompact = isSizeCompact(activeBreakpoint);

    if (utilityConfig) {
      return (
        <ApplicationHeaderUtility
          onChange={this.handleUtilityOnChange}
          onDisclose={this.handleUtilityDiscloseRequest}
          title={!isCompact ? utilityConfig.title : undefined}
          accessory={utilityConfig.accessory}
          menuItems={utilityConfig.menuItems}
          initialSelectedKey={utilityConfig.initialSelectedKey}
          data-application-header-utility
        />
      );
    }

    return null;
  }

  renderUtilitiesPopup() {
    const { utilityComponent } = this.state;

    if (utilityComponent) {
      return (
        <Popup
          attachmentBehavior="push"
          contentHeight="auto"
          contentWidth="240"
          isArrowDisplayed
          isHeaderDisabled
          isOpen
          onRequestClose={this.handleUtilityPopupCloseRequest}
          targetRef={this.getTargetRef}
        >
          {utilityComponent}
        </Popup>
      );
    }

    return null;
  }

  render() {
    const {
      activeBreakpoint,
      extensions,
    } = this.props;

    const isCompact = Helpers.isSizeCompact(activeBreakpoint);

    let headerLayout;
    if (isCompact) {
      /**
       * When compact, the navigation region of the header renders the application name component instead. At compact
       * sizes, the logo region within the ApplicationHeaderLayout is too small to use, so we instead render within
       * the navigation region which renders with a larger width.
       */
      headerLayout = (
        <ApplicationHeaderLayout
          toggle={this.renderToggle()}
          navigation={this.renderAppName()}
          extensions={extensions}
          utilities={this.renderUtilities()}
          skipToContentSelector="[data-terra-application-layout-main]"
        />
      );
    } else {
      headerLayout = (
        <ApplicationHeaderLayout
          logo={this.renderAppName()}
          navigation={this.renderNavigationTabs()}
          extensions={extensions}
          utilities={this.renderUtilities()}
          skipToContentSelector="[data-terra-application-layout-main]"
        />
      );
    }

    return (
      <div className={cx('application-header')} ref={this.setContentNode}>
        {headerLayout}
        {this.renderUtilitiesPopup()}
      </div>
    );
  }
}

ApplicationHeader.propTypes = propTypes;
ApplicationHeader.defaultProps = defaultProps;

export default injectIntl(withDisclosureManager(ApplicationHeader));
