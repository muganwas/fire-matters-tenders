import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const FmButton = (props)=>{
  const { styles, variant, text, onClick } = props;
  return(
    <div>
      <Button onClick={ onClick } variant={ variant } style={styles.button}>
        { text }
      </Button>
    </div>
  )
}

FmButton.defaultProps = {
  color: "primary"
}

FmButton.propTypes = {
    text: PropTypes.string.isRequired,
    variant: PropTypes.string,
    styles: PropTypes.object.isRequired,
    onClick: PropTypes.func
}

export default FmButton;
