import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 100 + theme.spacing(3) * 2,
    },
    margin: {
        height: theme.spacing(3),
    },
}));


function ValueLabelComponent(props) {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
};



export const SliderPresentation = ({ flowMax, locMax, setMaxFlowMagnitude, setMaxLocationTotal }) => {
    const classes = useStyles();
    return (
        <div className={`sliderWrap ${classes.root}`} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>FlowMagnitudeExtent[1]:</div>
            <Slider
                ValueLabelComponent={ValueLabelComponent}
                aria-label="custom thumb label"
                value={flowMax || 5}
                min={1}
                max={10}
                onChange={(evt, value) => setMaxFlowMagnitude(value)}
            />
            {/* <input
                type="range"
                value={flowMax}
                min={2000}
                max={20000}
                onChange={evt => setMaxFlowMagnitude(+evt.currentTarget.value)}
            /> */}
            <div>LocationTotalExtent[1]:</div>
            <Slider
                ValueLabelComponent={ValueLabelComponent}
                aria-label="custom thumb label"
                value={locMax || 5}
                min={1}
                max={10}
                onChange={(evt, value) => setMaxLocationTotal(value)}
            />
        </div>
    )
}