import React from 'react';
import Button from 'terra-button';
import ContentContainer from 'terra-content-container';
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import Popup from 'terra-popup/lib/Popup';
import Placeholder from 'terra-doc-template/lib/Placeholder';
/* eslint-enable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

/* eslint-disable */
const PopupContent = ({ closeButtonRequired, handleRequestClose}) => {
  const placeHolder = <Placeholder title="Popup Content" />;
  if (closeButtonRequired) {
    return (
      <ContentContainer header={<Button text="My Custom Close Button" isBlock onClick={handleRequestClose} />} fill>
        {placeHolder}
      </ContentContainer>
    );
  }
  return placeHolder;
};
/* eslint-enable */

class PopupNoHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.setParentNode = this.setParentNode.bind(this);
    this.getParentNode = this.getParentNode.bind(this);
    this.state = { open: false };
  }

  setParentNode(node) {
    this.parentNode = node;
  }

  getParentNode() {
    return this.parentNode;
  }

  handleButtonClick() {
    this.setState({ open: true });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div
        style={{
          height: '200px', width: '200px', background: 'aliceblue', overflow: 'hidden',
        }}
        ref={this.setParentNode}
      >
        <Popup
          boundingRef={this.getParentNode}
          contentHeight="240"
          contentWidth="320"
          isHeaderDisabled
          isOpen={this.state.open}
          onRequestClose={this.handleRequestClose}
          targetRef={() => document.getElementById('popup-no-header')}
          isContentFocusDisabled
        >
          <PopupContent title="Popup Content" handleRequestClose={this.handleRequestClose} />
        </Popup>
        <Button id="popup-no-header" text="No Header Popup" onClick={this.handleButtonClick} />
      </div>
    );
  }
}

export default PopupNoHeader;
