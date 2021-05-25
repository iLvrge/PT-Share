import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    drive: {
        display: 'flex', 
        height: '100vh',
        overflow: 'auto',
        background: '#292929',
        '& .MuiTableCell-root':{
            whiteSpace: 'nowrap',
            color: '#fff'
        },
        '& .MuiAvatar-root':{
            width: theme.spacing(2),
            height: theme.spacing(2),
        }, 
        '& .MuiList-root':{
            width: '100%',
        },
        '& .MuiTreeItem-label':{
            height: 40,
            display: 'flex',
            alignItems: 'center'
        },
        '& .Droppable': {
            width: '100%',
            '& .MuiTypography-root':{
                paddingLeft: 5
            }
        },
        '& .MuiTreeView-root':{
            width: '100%',
            '& .MuiTreeItem-root':{
                borderBottom: '1px solid #5c5c5c'
            }
        },
        '& li.MuiListItem-root':{
            borderBottom: '1px solid #5c5c5c',
            paddingTop: 0,
            paddingBottom: 0,
            height: 40
        }
    }
}))