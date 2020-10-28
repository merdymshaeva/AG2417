import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  UncontrolledAlert,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  ButtonGroup,
  Button,
  Form,
  FormGroup
} from 'reactstrap';
import Notifications from '../Notifications';
import { logoutUser } from '../../actions/user';
import { openSidebar, closeSidebar, changeSidebarPosition, changeSidebarVisibility } from '../../actions/navigation';

import s from './Header.module.scss';
import 'animate.css'

class Header extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebarPosition: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleMessagesDropdown = this.toggleMessagesDropdown.bind(this);
    this.toggleSupportDropdown = this.toggleSupportDropdown.bind(this);
    this.toggleSettingsDropdown = this.toggleSettingsDropdown.bind(this);
    this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSearchOpen = this.toggleSearchOpen.bind(this);

    this.state = {
      visible: true,
      messagesOpen: false,
      supportOpen: false,
      settingsOpen: false,
      searchFocused: false,
      searchOpen: false,
      notificationsOpen: false
    };
  }

  toggleNotifications = () => {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  doLogout() {
    this.props
      .dispatch(logoutUser());
  }

  toggleMessagesDropdown() {
    this.setState({
      messagesOpen: !this.state.messagesOpen,
    });
  }

  toggleSupportDropdown() {
    this.setState({
      supportOpen: !this.state.supportOpen,
    });
  }

  toggleSettingsDropdown() {
    this.setState({
      settingsOpen: !this.state.settingsOpen,
    });
  }

  toggleAccountDropdown() {
    this.setState({
      accountOpen: !this.state.accountOpen,
    });
  }

  toggleSearchOpen() {
    this.setState({
      searchOpen: !this.state.searchOpen,
    });
  }

  toggleSidebar() {
    this.props.isSidebarOpened
      ? this.props.dispatch(closeSidebar())
      : this.props.dispatch(openSidebar())
  }

  moveSidebar(position) {
    this.props.dispatch(changeSidebarPosition(position));
  }

  toggleVisibilitySidebar(visibility) {
    this.props.dispatch(changeSidebarVisibility(visibility));
  }

  render() {
    return (
      <Navbar className={`d-print-none ${s.root}`}>
        <Nav className="ml-md-0 d-flex nav-responsive">
          <NavItem className="d-lg-none d-md-block d-sm-none">
            <NavLink onClick={this.toggleSearchOpen} className={s.navItem} href="#">
              <i className="glyphicon glyphicon-search text-white" />
            </NavLink>
          </NavItem>
           <UncontrolledAlert className={`${s.alert} mr-3 d-lg-down-none animate__animated animate__bounceIn animate__delay-1s`}>
          <i className="fa fa-info-circle mr-1" /> Check out some of our sources! <button className="btn-link" onClick={() => window.open('https://www.trafikverket.se/contentassets/ff9381c63cfe46849b98c33027ce53e6/sampers-2018/program_trafikverkets_presentationer.pdf','_blank')}>Trafikverket</button>
          
          <button className="btn-link" onClick={() => window.open('https://www.segmentationportal.com/se','_blank')}>Mosaic Sweden(sv)</button>
        </UncontrolledAlert> 
          <h1 className="page-title">Flow Map &nbsp;</h1>
          <Dropdown nav isOpen={this.state.settingsOpen} toggle={this.toggleSettingsDropdown}>
            <DropdownToggle nav className={`${s.navItem} text-white`}>
              <i className="glyphicon glyphicon-cog" />
            </DropdownToggle>
            <DropdownMenu className={`${s.dropdownMenu} ${s.settings}`}>
              <h6>Sidebar on the</h6>
              <ButtonGroup size="sm">
                <Button color="primary" onClick={() => this.moveSidebar('left')} className={this.props.sidebarPosition === 'left' ? 'active' : ''}>Left</Button>
                <Button color="primary" onClick={() => this.moveSidebar('right')} className={this.props.sidebarPosition === 'right' ? 'active' : ''}>Right</Button>
              </ButtonGroup>
              <h6 className="mt-2">Sidebar</h6>
              <ButtonGroup size="sm">
                <Button color="primary" onClick={() => this.toggleVisibilitySidebar('show')} className={this.props.sidebarVisibility === 'show' ? 'active' : ''}>Show</Button>
                <Button color="primary" onClick={() => this.toggleVisibilitySidebar('hide')} className={this.props.sidebarVisibility === 'hide' ? 'active' : ''}>Hide</Button>
              </ButtonGroup>
{/*}
              <h6 className="mt-2">DO YOU WANT HAPPY BUTTON OR SAD ONES?</h6>
              <FormGroup check>
                <Input type="radio" name="radio1" />{' '}
                     HAPPY BUTTON
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio1" />{' '}
                     HAPPY BUTTON NR TWO
              </FormGroup>
    */}
            </DropdownMenu>
          </Dropdown>
          <NavItem className="d-md-none">
            <NavLink onClick={this.toggleSidebar} className={`${s.navItem} text-white`} href="#">
              <i className="fa fa-bars" />
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    isSidebarOpened: store.navigation.sidebarOpened,
    sidebarVisibility: store.navigation.sidebarVisibility,
    sidebarPosition: store.navigation.sidebarPosition,
  };
}

export default withRouter(connect(mapStateToProps)(Header));

