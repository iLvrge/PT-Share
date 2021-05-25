import React, { useEffect, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'


import useStyles from './styles'

const USPTOContainer = ({ asset, apiURL }) => {
  const classes = useStyles()

  const [isLoadingAssetUSPTO , setIsLoadingAssetUSPTO] = useState(false)
  const [uspto, setUspto] = useState({url: 'about:blank'})

  useEffect(() => {
    if( asset != null ) {
      const request = new Request(`${apiURL}assets/${asset}/1/outsource`);
      setIsLoadingAssetUSPTO(true)
			fetch(request)
			.then(response => {
				if (response.status === 200) {
					(async () => {
            const data = await response.json();
            setIsLoadingAssetUSPTO(false)
						setUspto(data);
					})();
				} else {
					//throw new Error('Something went wrong on api server!');
				}
			})
    }    
  }, [ asset ])

  return (
    <div className={classes.root}>     
      <div className={classes.forceStrech}>
        {
          isLoadingAssetUSPTO ?
            <CircularProgress className={classes.loader} /> :
            (uspto && (
                <iframe className={classes.forceStrech} src={uspto.url} title={uspto.url} />
              )
            )
        }
      </div>
    </div>
  )
}

export default USPTOContainer
