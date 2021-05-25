import React, {useEffect, useState, useCallback} from 'react'
import { useLocation } from "react-router-dom"
import VirtualizedTable from "../VirtualizedTable"
import useStyles from './styles'

const Assets = ({handleIllustration, apiURL}) => {

    const COLUMNS = [
        {
        width: 100, 
        minWidth: 100,
        flexGrow: 1,     
        label: "Assets",
        dataKey: "asset",
        align: "left",
        paddingLeft: 10
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
        console.log('location', location)
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
                        const list = await response.json();
                        setLoadingAssets(false)
                        setAssetsList(list);
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
                        headerHeight={rowHeight}
                        columns={COLUMNS}
                        onSelect={handleClick}
                        defaultSelectAll={selectedAll}
                        disableHeader={true}
                        responsive={true}
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
                'Loading...'
            }
        </div>         
    )
}
export default Assets