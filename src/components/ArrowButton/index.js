import React, { useState, useEffect } from 'react'
import { Fab } from '@material-ui/core'
import { KeyboardArrowRightOutlined as KeyboardArrowRightOutlinedIcon, KeyboardArrowLeftOutlined as KeyboardArrowLeftOutlinedIcon, KeyboardArrowDownOutlined as KeyboardArrowDownOutlinedIcon } from '@material-ui/icons'

import useStyles from './styles'

const ArrowButton = ({arrowId, handleClick, buttonType, buttonVisible, arrow, cls}) => {

    const classes = useStyles() 
    const [ type, setType] = useState( true )
    const [ visible, setVisible] = useState( false )
    

    useEffect(() => {
        setType( buttonType )
        setVisible( buttonVisible )
    }, [ buttonType, buttonVisible ])

    /* ${visible === false ? classes.disable : ''} */
    if(visible === false ) return null
    return(
        <div id={arrowId} className={`${classes.arrowButton} ${cls != undefined ? cls : ''}`}>
            <Fab
            aria-label='toggle'
            size='small' 
            className = {`${classes.btnColor}`}
            onClick={handleClick} 
            >
                { 
                    
                     
                    arrow == 2
                    ?
                    <KeyboardArrowDownOutlinedIcon /> 
                    :
                    arrow == 3
                    ?
                    <KeyboardArrowRightOutlinedIcon /> 
                    :
                    <KeyboardArrowLeftOutlinedIcon /> 
                }
            </Fab>
        </div>  
    )
}

export default ArrowButton