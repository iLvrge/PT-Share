import React, 
        { 
          useEffect, 
        } from 'react'
import { 
        AppBar, 
        Toolbar, 
      } from '@material-ui/core'

import useStyles from './styles'

const NewHeader = () => {
  const classes = useStyles() 
  const siteLogo = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/logo/patentrack_new_logo.png'
  


  return (

    <AppBar className={classes.root} color='transparent' position='relative'>
      <Toolbar className={classes.toolbar}>
        <img src={siteLogo} className={classes.siteLogo} alt={''} />
        <span  className={classes.companyLogoCon}>
          {/* {
            user.organisation 
            ?
              user.organisation.logo != ''
                ?
                  <img src={user.organisation.logo} className={classes.userLogoOfficial} alt={''} />
                :
                  <span className={classes.organizationName}>{user.organisation.name}</span>
            :
            ''
          } */}
        </span>
      </Toolbar>
      
    </AppBar>
  ) 
}

export default NewHeader
