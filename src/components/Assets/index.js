import React, {useEffect, useState, useCallback} from 'react'
import { useLocation } from "react-router-dom"
import CircularProgress from '@material-ui/core/CircularProgress'

import VirtualizedTable from "../VirtualizedTable"
import useStyles from './styles'

const numberWithCommas = (x) => {
    return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
}

const Assets = ({handleIllustration, setCompanyLogo,  apiURL}) => {

    const COLUMNS = [
        {
            width: 100, 
            minWidth: 100,
            flexGrow: 1,     
            staticIcon: "US",
            format: numberWithCommas,
            label: "Assets",
            dataKey: "asset",
            align: "center",
            paddingLeft: 20,
            badge: true
        },
    ]
    const classes = useStyles()
    const location = useLocation()
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ width, setWidth ] = useState( 200 )
    const [ shareCode, setShareCode] = useState('')
    const [assetsList, setAssetsList] = useState([])
    const [ loadingAssets, setLoadingAssets] = useState(false)
    const [ selectedAll, setSelectedAll ] = useState(false)
    const [ selectedItems, setSelectedItems ] = useState( [] )
    const [ selectRow, setSelectedRow ] = useState( [] )
    
    useEffect(() => {
        const {pathname} = location

        if( pathname != null  && pathname != '' && pathname != '/' ) {
            const getAssetList = () => {
                setLoadingAssets(true)
                setShareCode(pathname)
                const request = new Request(`${apiURL}share${pathname}`);
                fetch(request)
                .then(response => {
                    if (response.status === 200) {
                        (async () => {
                        const { list, logo } = await response.json();
                            setLoadingAssets(false)
                            setAssetsList(list)
                            setCompanyLogo(logo)
                        })();
                    } else {
                        throw new Error('Something went wrong on api server!');
                    }
                })
            }
            getAssetList()
        }
    }, [location, apiURL])

    const handleClick = useCallback(async (event, row) => {
        event.preventDefault();
        setSelectedItems([row.asset])
        setSelectedRow([row.asset])
        handleIllustration( row.asset, shareCode )
    }, [ shareCode ])

    return (
        <div className={classes.drive}>
            {
                !loadingAssets
                ?
                    <VirtualizedTable 
                        classes={classes}
                        selected={selectedItems}
                        selectedKey={'asset'}
                        rowSelected={selectRow}
                        rows={assetsList}
                        rowHeight={rowHeight}
                        headerHeight={57}
                        columns={COLUMNS}
                        onSelect={handleClick}
                        defaultSelectAll={selectedAll}
                        responsive={true}
                        grandTotal={assetsList.length}
                        totalRows={assetsList.length}
                        width={width} 
                        containerStyle={{ 
                        width: '100%',
                        maxWidth: '100%'
                        }}
                        style={{
                        width: '100%'
                        }}
                    /> 
                :
                <CircularProgress className={classes.loader} /> 
            }
        </div>         
    )
}
export default Assets