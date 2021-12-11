import React, 
        { 
          useCallback, 
          useEffect, 
          useState,
        } from 'react'
import { 
        AppBar, 
        Toolbar,
        IconButton, 
        InputBase, 
        Drawer,
        Button
      } from '@material-ui/core'

import { Menu as MenuIcon, 
  Search as SearchIcon, 
  Person as PersonIcon, 
  People as PeopleIcon, 
  InsertDriveFile as InsertDriveFileIcon, 
  Business as BusinessIcon, 
  Gavel as GavelIcon, 
  LockOpen as LockOpenIcon, 
  Contacts as ContactsIcon, 
  Settings as SettingsIcon, 
  Dashboard as DashboardIcon, 
  NotificationsNone as NotificationsIcon,
  Home as HomeIcon,
  ExpandLess,
  ExpandMore,
  Close
} from '@material-ui/icons'      

import useStyles from './styles'

const NewHeader = ({logo}) => {
  const classes = useStyles() 
  const siteLogo = 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/logo/patentrack_new_logo.png'
  const [ openDrawer, setDrawerState] = useState({
    top: false,
    left: false, 
    bottom: false,
    right: false,
  })

  const search_string = '';

  /**
   * When the setting menu is open then disable the list of keyboard events
   * @param {} event 
   * @param {*} open 
   */

  
  const toggleDrawer = (event, open) => {
    /* if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift') || event.target.classList.contains('children')  || event.target.parentNode.classList.contains('children') || event.target.parentNode.parentNode.classList.contains('children')) {
      return;
    }

    setDrawerState({ ...openDrawer, right: open }); */
  };

  const handleKeyDown = () => {

  }

  const handleAlert = () => {
    
  }

  const handleScheduleViaHubspot = () => {
    const elementContainer = document.getElementById('bookMeeting')
    elementContainer.querySelector('.MuiBackdrop-root').addEventListener('click', function() {
      if(this.parentElement.style.visibility == 'visible') {
        this.parentElement.style.visibility = 'hidden'
      }
    })
    elementContainer.style.visibility = elementContainer.style.visibility === 'hidden' ? 'visible' : 'hidden'
    elementContainer.style.top = '42px'
  }

  return (

    <AppBar className={classes.root} color='transparent' position='relative'>
      <Toolbar className={classes.toolbar}>
        <img src={siteLogo} className={classes.siteLogo} alt={''} />
        <span  className={classes.companyLogoCon}>
           {
            logo != null 
            ?
              <img src={logo} className={classes.userLogoOfficial} alt={''} />
            :
            ''
          }
        </span>
        <div className={classes.grow} style={{position: 'relative'}}>  
          Copyright protected and covered by several pending patent applications.
        </div> 
        <div className={classes.rightPanel}>      
            <Button className={classes.calendly} onClick={handleScheduleViaHubspot}>
              Schedule a {process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'd' : 'D' }emo {process.env.REACT_APP_ENVIROMENT_MODE !== 'PRO' ? 'for Pro version' : '' }
            </Button>
          </div>
      </Toolbar>
    </AppBar>
  ) 
}

export default NewHeader
