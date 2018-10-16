import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
      padding: '3px 10px',
      fontSize: 10,
      backgroundColor: "#F79A50",
      '&:hover': {
        background: '#F79A50',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
      }
    },
    input: {
      display: 'none',
    },
  });

const FmButton = (props)=>{
  const { classes, variant, color, text } = props;
  return(
    <div>
      <Button variant={ variant } color={ color } className={classes.button}>
        { text }
      </Button>
    </div>
  )
}

FmButton.defaultProps = {
  color: "primary"
}

FmButton.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.string,
    text: PropTypes.string.isRequired,
    variant: PropTypes.string
}

export default withStyles(styles)(FmButton);
