import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
    drive: {
        display: 'flex', 
        height: '100vh',
        width: '110px',
        overflow: 'auto',
        marginRight: 3,
        background: '#424242',
        '& .MuiTableCell-root, .MuiTableSortLabel-root:focus, .MuiTableSortLabel-root:hover':{
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
    },
    loader: {
        position: 'absolute',
        zIndex: 100,
        top: '50%',
        left: '50%',
    },
}))