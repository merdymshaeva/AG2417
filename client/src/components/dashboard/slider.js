import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import { useSelector } from 'react-redux';

const TOP_FLOW_MAX = 1000;

const useStyles = makeStyles((theme) => ({
    root: {
        width: 100 + theme.spacing(3) * 2,
    },
    margin: {
        height: theme.spacing(3),
    },
    input: {
        width: 42,
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



export const SliderPresentation = ({ flowMax, locMax, setMaxFlowMagnitude, setMaxLocationTotal, setOpacity, hover, setHover }) => {
    const classes = useStyles();
    return (
        <div className={`sliderWrap ${classes.root}`} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>Arch size</div>
            <Slider
                ValueLabelComponent={ValueLabelComponent}
                aria-label="custom thumb label"
                value={flowMax || 5}
                min={1}
                max={10}
                onChange={(evt, value) => setMaxFlowMagnitude(value)}
            />
            <div>Node size</div>
            <Slider
                ValueLabelComponent={ValueLabelComponent}
                aria-label="custom thumb label"
                value={locMax || 5}
                min={1}
                max={10}
                onChange={(evt, value) => setMaxLocationTotal(value)}
            />
            <div>Opacity</div>
            <Slider
                ValueLabelComponent={ValueLabelComponent}
                // aria-label="custom thumb label"
                defaultValue={0.5}
                aria-labelledby="discrete-slider-small-steps"
                // value={opacity || 0.5}
                min={0}
                max={1}
                step={0.1}
                onChange={(evt, value) => setOpacity(value)}
            />
            <span>
                <span>Hover info</span>
                <Switch
                    checked={hover}
                    onChange={evt => setHover(evt.target.checked)}
                    name="checkedA"
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </span>
        </div>
    )
}

export const SingleSlider = ({ flowMax, locMax, setMaxFlowMagnitude, setMaxLocationTotal }) => {
    const classes = useStyles();
    return (
        <div className={`sliderWrap ${classes.root}`} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>Arc size</div>
            <Slider
                ValueLabelComponent={ValueLabelComponent}
                aria-label="custom thumb label"
                value={flowMax || 5}
                min={1}
                max={10}
                onChange={(evt, value) => setMaxFlowMagnitude(value)}
            />
            <div>Node size</div>
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


export function InputSlider({ setTopFlows }) {
    const topFlows = useSelector(state => state.mapStyle.topFlows)
    const classes = useStyles();

    const handleSliderChange = (event, newValue) => {
        setTopFlows(newValue);
    };

    const handleInputChange = (event) => {
        setTopFlows(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (topFlows < 1) {
            setTopFlows(1);
        } else if (topFlows > TOP_FLOW_MAX) {
            setTopFlows(TOP_FLOW_MAX);
        }
    };

    return (
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom>
                Show top {topFlows} flows
      </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={typeof topFlows === 'number' ? topFlows : 1}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={1}
                        max={TOP_FLOW_MAX}
                    />
                </Grid>
                <Grid item>
                    <Input
                        className={classes.input}
                        // defaultValue={10}
                        value={topFlows}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 1,
                            // max: TOP_FLOW_MAX,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}