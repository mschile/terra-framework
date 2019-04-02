import React from 'react';
import Menu from 'terra-application-menu-layout';
import Image from 'terra-image';
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import Placeholder from 'terra-application-name/lib/terra-dev-site/doc/common/Placeholder';
import ApplicationMenuName from 'terra-application-name/lib/ApplicationMenuName';
/* eslint-enable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

const demosize = { height: '450px', width: '300px' };
const demobgcolor = { backgroundColor: 'rgb(140, 161, 177)' };
const ApplicationMenuNameStandard = () => (
  <Menu
    style={demosize}
    header={(
      <ApplicationMenuName
        title="App-Name"
        accessory={<Image alt="Terra Logo" variant="rounded" src="https://github.com/cerner/terra-framework/raw/master/terra.png" height="26px" width="26px" isFluid />}
        style={demobgcolor}
      />
    )}
    extensions={<Placeholder text="Extensions" height="50px" />}
    content={<Placeholder text="Content" />}
    footer={<Placeholder text="Footer" height="50px" />}
  />
);


export default ApplicationMenuNameStandard;
