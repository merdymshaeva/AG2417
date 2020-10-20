import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Progress, Alert, Tooltip, Button,FormGroup, Input, Form,  DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
    ButtonGroup, label, CustomInput, InputGroup, InputGroupAddon, InputGroupText, Container, Row, Col} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { dismissAlert } from '../../actions/alerts';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';
import SelectData from '../dashboard/select';

import { changeActiveSidebarItem } from '../../actions/navigation';
import { logoutUser } from '../../actions/user';
import { setFlowMax, setLocMax, setTopFlows, setOpacity, setHover } from '../../actions/mapAction';
import { SliderPresentation, InputSlider } from '../dashboard/slider'
import Example from './ExampleToolb';
import ExampleDrop from './ExampleDropdown';
import Applicationen from './Examplealot';


class Sidebar extends React.Component {
    static propTypes = {
        sidebarStatic: PropTypes.bool,
        sidebarOpened: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        activeItem: PropTypes.string,
        location: PropTypes.shape({
            pathname: PropTypes.string,
        }).isRequired,
    };

    static defaultProps = {
        sidebarStatic: false,
        activeItem: '',
    };

    constructor(props) {
        super(props);

        this.doLogout = this.doLogout.bind(this);
    }

    componentDidMount() {
        this.element.addEventListener('transitionend', () => {
            if (this.props.sidebarOpened) {
                this.element.classList.add(s.sidebarOpen);
            }
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
            if (nextProps.sidebarOpened) {
                this.element.style.height = `${this.element.scrollHeight}px`;
            } else {
                this.element.classList.remove(s.sidebarOpen);
                setTimeout(() => {
                    this.element.style.height = '';
                }, 0);
            }
        }
    }

    dismissAlert(id) {
        this.props.dispatch(dismissAlert(id));
    }

    doLogout() {
        this.props.dispatch(logoutUser());
    }

    render() {

      
        return (
            <nav
                className={cx(s.root)}
                ref={(nav) => {
                    this.element = nav;
                }}
            >

                <header className={s.logo}>
                <a href="#" data-toggle="tooltip" title="This is a project made by us">ShareFlow Stockholm</a>
                <Example />
                    {/* <a >ShareFlow Stockholm</a>  */}
                    
                    {/* <span className="fw-bold">Blue</span></a> */}
                </header>


                <ul className={s.nav}>
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Dashboard-HOME"
                        isHeader
                        iconName="flaticon-home"
                        link="/app/main"
                        index="main"
                    />

                    
                    {/* <ExampleDrop/>  */}
                    {/* This is an test for a drop down menu.  */}

                    {/* <InputGroup>
                    <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                    <Input addon type="checkbox" />
                    </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Check it out" />
                    </InputGroup> */}


                    <h5 className={[s.navTitle, s.groupTitle].join(' ')}><a title="Here you can decide how many of the possible flows you wnat to see">FILTERS</a></h5>
                    
                    {/* <a href="#" data-toggle="tooltip" title="Play around with this as much as you want">ShareFlow Stockholm</a> */}
                    <InputSlider
                        topFlows={this.props.topFlows}
                        setTopFlows={v => this.props.dispatch(setTopFlows(v))}
                    />

                    {/* Down here we have two types of radio buttons we will se which ones are easier to use */}
                    
                    {/* <h6 className="mt-2">TIME OF DEMAND</h6>
                        <FormGroup check>
                            <Input type="radio" name="radio1" />{' '}
                            Morning Peak
                        </FormGroup>
                            <FormGroup check>
                         <Input type="radio" name="radio1" />{' '}
                                Afternoon Peak
                        </FormGroup>

                        <FormGroup check>
                         <Input type="radio" name="radio1" />{' '}
                                Off Peak
                        <FormGroup check>
                            <Input type="radio" name="radio1" />{' '}
                             Overall
                        </FormGroup>

                        </FormGroup> */}

                        

                
                         
                        {/* <FormGroup>
                                <label for="exampleCheckbox">TIME OF DEMAND</label>
                        <div>
                            <CustomInput type="radio" id="exampleCustomRadio" name="customRadio1" label="Morning Peak" />
                            <CustomInput type="radio" id="exampleCustomRadio2" name="customRadio1" label="Afternoon Peak" />
                            <CustomInput type="radio" id="exampleCustomRadio3" name="customRadio1" label="Off Peak"/>
                            <CustomInput type="radio" id="exampleCustomRadio4" name="customRadio1" label="Overall"/>
                            {/* <CustomInput type="radio" id="exampleCustomRadio3" label="But not this disabled one" disabled /> */}
                            {/* <CustomInput type="radio" id="exampleCustomRadio4" label="Can't click this label to select!" htmlFor="exampleCustomRadio4_X" disabled /> */}
                        {/* </div>
                        </FormGroup> */}


                        <h10 >Mode Choices included{/* eslint-disable-next-line */} </h10>
                        <Applicationen/>


                    <h10 >Travel Time [min]{/* eslint-disable-next-line */} </h10>
                    <InputGroup>
                    {/* <InputGroupAddon addonType="prepend" btn btn-outline-primary mr-2 btn-sm>TT</InputGroupAddon> */}
                    <Input placeholder="Min" min={0} max={10} size="sm" type="number" step="1" />
                    <Input placeholder="Max" min={0} max={100} size="sm" type="number" step="1" />
                    {/* <InputGroupAddon addonType="append">minutes</InputGroupAddon> */}

                    </InputGroup>
                    <h10 >Trip length </h10>
                    <InputGroup>
                    {/* <InputGroupAddon addonType="prepend" size="sm">TL</InputGroupAddon> */}
                    <Input placeholder="Min" min={0} max={100} size="sm" color= '' type="number" step="1" />
                    <Input placeholder="Max" min={0} max={100} size="sm" type="number" step="1" />
                    {/* <InputGroupAddon addonType="append">m</InputGroupAddon>  */}
                   </InputGroup>
                    
            

                    {/* <Dropdown nav isOpen={this.state.notificationsOpen} toggle={this.toggleNotifications} id="basic-nav-dropdown" className={`${s.notificationsMenu}`} style={{marginRight: 'auto'}}>
                    <DropdownToggle nav caret style={{color: "#f4f4f5", padding: 0}}>
                        <Badge className={s.badge} color="primary">13</Badge>
                        </DropdownToggle>
                        <DropdownMenu right className={`${s.notificationsWrapper} py-0 animate__animated animate__faster animate__fadeInUp`}>
                            <Notifications />
                            </DropdownMenu> */}
                    
                
                

                    {/* <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Typography"
                        isHeader
                        iconName="flaticon-network"
                        link="/app/typography"
                        index="core"
                    />
                    <LinksGroup
                        onActiveSidebarItemChange={t => this.props.dispatch(changeActiveSidebarItem(t))}
                        activeItem={this.props.activeItem}
                        header="Tables Basic"
                        isHeader
                        iconName="flaticon-map-location"
                        link="/app/tables"
                        index="tables"
                    />
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Notifications"
                        isHeader
                        iconName="flaticon-layers"
                        link="/app/notifications"
                        index="ui"
                    />
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={this.props.activeItem}
                        header="Components"
                        isHeader
                        iconName="flaticon-list"
                        link="/app/forms"
                        index="forms"
                        childrenLinks={[
                            {
                                header: 'Charts', link: '/app/charts',
                            },
                            {
                                header: 'Icons', link: '/app/icons',
                            },
                            {
                                header: 'Maps', link: '/app/maps',
                            },
                        ]}
                    /> */}
                </ul>
                <h5 className={s.navTitle}>
                    STYLE
                    {/* eslint-disable-next-line */}
                    <a className={s.actionLink}>
                        <i className={`${s.glyphiconSm} glyphicon glyphicon-plus float-right`} />
                    </a>
                </h5>
                {/* eslint-disable */}
                <SliderPresentation
                    flowMax={this.props.flowMax}
                    setMaxFlowMagnitude={(v) => this.props.dispatch(setFlowMax(v))}
                    locMax={this.props.locMax}
                    setMaxLocationTotal={v => this.props.dispatch(setLocMax(v))}
                    // opacity={this.props.opacity}
                    setOpacity={v => this.props.dispatch(setOpacity(v))}
                    hover={this.props.hover}
                    setHover={v => this.props.dispatch(setHover(v))}
                />
                {/* eslint-enable */}
                <h5 className={s.navTitle}>
                <a href="#" data-toggle="tooltip" title="After changing the data you need to zoom to make the changes visible on the map, be careful don't try to go to none when you have picked something it will make everything crazy">DATA</a>
                <Example />
                    {/* <a >ShareFlow Stockholm</a>  */}
                    
                    {/* <span className="fw-bold">Blue</span></a> */}
                </h5>
                <SelectData />
                {/* <div className={s.sidebarAlerts}>
                    {this.props.alertsList.map(alert => // eslint-disable-line
                        <Alert
                            key={alert.id}
                            className={s.sidebarAlert} color="transparent"
                            isOpen={true} // eslint-disable-line
                            toggle={() => {
                                this.dismissAlert(alert.id);
                            }}
                        >
                            <span>{alert.title}</span><br />
                            <Progress className={`bg-custom-dark progress-xs mt-1`} color={alert.color}
                                value={alert.value} />
                            <small>{alert.footer}</small>
                        </Alert>,
                    )}
                </div> */}
            </nav>
        );
    }
}

function mapStateToProps(store) {
    return {
        sidebarOpened: store.navigation.sidebarOpened,
        sidebarStatic: store.navigation.sidebarStatic,
        alertsList: store.alerts.alertsList,
        activeItem: store.navigation.activeItem,
        flowMax: store.mapStyle.flowMax,
        locMax: store.mapStyle.locMax
    };
}


export default withRouter(connect(mapStateToProps)(Sidebar));
