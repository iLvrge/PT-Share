import React, {useEffect, useState, useCallback, useRef} from 'react'
import { useLocation } from "react-router-dom"
import SplitPane from 'react-split-pane'


import { Grid } from '@material-ui/core'

import Assets from './components/Assets'

import PatentrackDiagram from './components/PatentrackDiagram'
import PdfViewer from './components/PdfViewer'
import USPTOContainer from './components/USPTOContainer'
import NewHeader from './components/NewHeader'
import ConnectionBox from './components/ConnectionBox'
import NavigationIcon from './components/NavigationIcon'
import AssetsCommentsTimeline from './components/AssetsCommentTimeline'
import ArrowButton from './components/ArrowButton'

import './App.css'
import { AirlineSeatReclineExtraOutlined } from '@material-ui/icons'

function useDimensions() {
  return {width: window.innerWidth, height: window.innerHeight}
}

const App = () => {
  const targetRef = useRef()
  const mainContainerRef = useRef()
  const illustrationRef = useRef()
  const [ data, setData] = useState(null)	
  const [ pdfView, setPDFView] = useState(false)
  const [ pdfFile, setPDFFile] = useState({document: '', form: '', agreement: ''})
  const [ pdfTab, setPdfTabIndex] = useState(2)
  const [ arrow, setArrow] = useState(3)
  const [ topPosition, setTopPosition ] = useState(0) 
  const [ parent_width, setParentWidth ] = useState(0)
  const [ bottomToolbarPosition, setBottomToolbarPosition ] = useState(0)
  const [ illustrationSize, setIllustrationSize] = useState('100%')
  const [ leftBarSize, setLeftBarSize] = useState('100%')
  const [ gap, setGap ] = useState( { x: '14.1rem', y: '7.5rem'} )
  const [ showThirdParties, setShowThirdParties ] = useState(true)
  const [ usptoMode, setUsptoMode ] = useState(false)
  const [ connectionMode, setConnectionMode ] = useState(false)
  const [ companyLogo, setCompanyLogo ] = useState(null)
  const [ connectionData, setConnectionData ] = useState(null)
  const [ code, setCode ] = useState(null)
  const [ linkId, setLinkId ] = useState(null)
  const [ click, setClick ] = useState(0)
  const [ lineId, setLineId ] = useState(0)
  const [ asset, setAsset ] = useState(null)	
  const [ isDrag, setIsDrag] = useState(false)
  const [ isDragRight, setIsDragRight] = useState(false)
  const [ toggleButtonType, setToggleButtonType ] = useState(false)
  const [ companyButtonVisible, setCompanyButtonVisible ] = useState(false)

  const apiURL = 'https://betapp.patentrack.com/' 
  /* const apiURL = 'http://localhost:3600/' */

  
  useEffect(() => {
    if (targetRef.current) {    
      const screenHeight = window.screen.availHeight  
      const patentelement = targetRef.current.parentElement
      setBottomToolbarPosition(screenHeight - patentelement.offsetHeight - 170)
      const clientRect = patentelement.getBoundingClientRect()
      setTopPosition(clientRect.top)
      setParentWidth(parseInt(targetRef.current.offsetWidth))  
    }
  }, [ targetRef])

  useEffect(() => {
    if( connectionMode === true && pdfView === true ) {
      document.getElementsByClassName('pan3')[0].querySelector('.Resizer').style.display = 'block'
    } else {
      document.getElementsByClassName('pan3')[0].querySelector('.Resizer').style.display = 'none'
    }
  }, [ connectionMode, pdfView ])

  useEffect(() => {
    let href = document.location.href;
		href = href.toString().split('/').pop();
		if( href != "" ) {
			const request = new Request(`${apiURL}share/illustrate/show/${href}`);
			fetch(request)
			.then(response => {
				if (response.status === 200) {
					(async () => {
            const dashData = await response.json();
            if(typeof dashData.general !== 'undefined' ) {
              if(typeof dashData.general.logo_1 !== 'undefined') {
                setCompanyLogo(dashData.general.logo_1)
              }            
            }
						setData(dashData);
					})();
				} else {
					throw new Error('Something went wrong on api server!');
				}
			})
		}
	},[]);
    
  useEffect(() => {
    window.addEventListener('resize', checkContainer)
    checkContainer()
    return () => window.removeEventListener('resize', checkContainer)
  }, [])

  const checkContainer = (t) => {
    /* setTimeout(() => {
        if( mainContainerRef.current != null  && mainContainerRef.current != undefined) {                
            const mainWidth = mainContainerRef.current.pane2.clientWidth, illustrationContainer = mainContainerRef.current.pane1.querySelector('#patentrackDiagramDiv')
            if( illustrationContainer != null && illustrationContainer != undefined ) {
                const illustrationWidth = illustrationContainer.clientWidth - 3
                onHandleIllustrationSize(mainWidth - illustrationWidth)
            } else {
                checkContainer()
            }
        } else {
            checkContainer()
        }            
    }, typeof t !== 'undefined' ? t : 1000) */
  }

  const onHandleIllustrationSize = (size) => {
    if(mainContainerRef.current != null ) {
        const containerSize = mainContainerRef.current.pane2.clientWidth
        const windowWidth = size != undefined ? containerSize - size - 3 : mainContainerRef.current.pane1.querySelector('#patentrackDiagramDiv').clientWidth
        const width = 620, 
              constantX = 14.1, 
              constantValue = parseFloat(constantX / width).toFixed(4),
              xGap = (windowWidth * constantValue) - 3 
        setGap({
            ...gap, 
            x: `${parseFloat(xGap).toFixed(1)}rem`
        })
    }
  }

  const resizePane = (name, size) => {
		localStorage.setItem(name, size)
  } 
  
  const handleIllustration = useCallback(async (asset, shareCode) => {
    setCode(shareCode)
    setPDFView(false)
    setClick(0)
    setLineId(0)
    setLinkId(null)
    setPDFFile({ document: '', form: '', agreement: '' }) 
    setUsptoMode( prev => {
      if(prev === false) {
        setIllustrationSize('99%')
      } else {
        setLeftBarSize('0%') 
        setAsset(asset)
      }
      return prev
    })     
    const request = new Request(`${apiURL}share/${asset}${shareCode}`);
			fetch(request)
			.then(response => {
				if (response.status === 200) {
					(async () => {
						const dashData = await response.json();
						setData(dashData);
					})();
				} else {
					throw new Error('Something went wrong on api server!');
				}
			})
  }, [ apiURL ])

  const handleConnectionBox = useCallback((obj) => {
    if (typeof obj.popup != 'undefined') {
      setLineId(obj.id)
      if(linkId != obj.popuptop) {
        setLinkId(obj.popuptop)
        setUsptoMode(false)
        setIllustrationSize('65.8%')
        setCompanyButtonVisible(true)
        checkContainer(0)
        setPDFView(true)
        setPdfTabIndex(0)
        setPDFFile(
          { 
            document: obj.document1, 
            form: obj.document1_form, 
            agreement: obj.document1_agreement 
          }
        )
        setLeftBarSize('50%')
        setConnectionMode(true)  
        setConnectionData(obj)
        setClick(1)
      } else {
        if(click == 1) {
          setClick(2)
          setLeftBarSize('100%')
          setConnectionMode(false)
          setPDFView(true)
        } else if(click == 2) {
          setClick(3)
          setLeftBarSize('0%')
          setConnectionMode(true)
          setPDFView(false)
        } else {
          setClick(1)
          setLeftBarSize('50%')
          setConnectionMode(true)
          setPDFView(true)
        }
      }
    }
  },[ linkId, click ])

  const handleComment = () => {
    
  }

  const handleShare = (obj) => {
    if (obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
      const request = new Request(`${apiURL}share/illustration/${obj.original_number}${code}`);
			fetch(request)
			.then(response => {
				if (response.status === 200) {
					(async () => {
						const shareURL = await response.text();
						if (shareURL.indexOf('share') >= 0) {
              /**
               * just for temporary replacing
               */
              window.open(shareURL,'_BLANK')
            }
					})();
				} else {
					//throw new Error('Something went wrong on api server!');
				}
			})
    }
  }

  const handlePdfView = (obj) => {		    

    if(Object.keys(obj).length > 0 && typeof obj.document_file != 'undefined') {
      setIllustrationSize('50%')
      setPDFFile({ document: obj.document_file, form: obj.document_form, agreement: obj.document_agreement }) 
      setPDFView(true)
      setPdfTabIndex(2) 
      if( usptoMode === true ) {
        setIllustrationSize('65.8%')
      } else {
        setLeftBarSize('100%')
      }
    }  else {
      setPDFFile({ document: '', form: '', agreement: '' }) 
      setPDFView( false )
      if(usptoMode === false) {
        setIllustrationSize('100%')
      } else {
        setLeftBarSize('0%')
      } 
    }    
	}

  const handleUSPTO = (mode, patentObj) => { 
    setClick(0)   
    setLinkId(null)
    setUsptoMode(mode)
    setLineId(0)
    setIllustrationSize('65.8%')
    setPDFView(false)
    setConnectionMode(false)
    if( mode == true ) { 
      checkContainer(0)
      setLeftBarSize('0%') 
      setCompanyButtonVisible(true)
    }
    if(mode === false) {    
      setCompanyButtonVisible(false)  
      setAsset(null)
      if(pdfView === false) {
        setIllustrationSize('100%')
      }
      checkContainer(0)
    } else {
      setAsset(patentObj.original_number)
    }  
  }

  const toggleShow3rdParities = () => {
    setShowThirdParties(!showThirdParties)
  }

  const onHandleReset = useCallback(() => {
    if( lineId > 0 ) {
      setClick(0)   
      setLinkId(0)
      setLineId(0)
      setUsptoMode(false)
      setConnectionMode(false)
      setPDFView(false)
      setIllustrationSize('100%')
    }    
  }, [lineId])

  
  const handleCompanyBarOpen = (event) => {
    setToggleButtonType( !toggleButtonType )
    setIllustrationSize('100%')
    setCompanyButtonVisible(false)
    setUsptoMode(false)
    setConnectionMode(false) 
    setPDFView(false)
    checkContainer(0)
  }

  const fullScreen = () => {

  }
  return (
    <div className={'root'}>
      <NewHeader logo={companyLogo}/>
      <Grid container>
      <SplitPane
        className={`splitPane`}
        split="vertical"
        size={illustrationSize} 
        onChange={checkContainer}
        onDragStarted={() => {
          setIsDrag(true);
        }}
        onDragFinished={size => {
          setIsDrag(false);
        }}
        pane1Style={{
          pointerEvents: isDrag ? 'none' : 'auto',
        }}
        pane2Style={{
          pointerEvents: isDrag ? 'none' : 'auto',
        }}
        ref={mainContainerRef}
      >
        <div className={`illustration_comment_container`}>    
          <ArrowButton arrowId={`arrow_company`} handleClick={handleCompanyBarOpen} buttonType={toggleButtonType} buttonVisible={companyButtonVisible} arrow={arrow}/>
          <div className={'forceStrech'} ref={targetRef}>
            {
              data != null && (
                <PatentrackDiagram  
                  data={data} 
                  connectionBox={handleConnectionBox} 
                  comment={handleComment} 
                  share={handleShare} 
                  pdfView={handlePdfView} 
                  uspto={handleUSPTO}
                  titleTop={topPosition} 
                  toolbarBottom={bottomToolbarPosition} 
                  parentWidth={parseInt(parent_width)} 
                  key={"PatentDiagram_" + "_" + Math.random() }
                  gap={gap}
                  showThirdParties={showThirdParties}
                  pdfFile={pdfFile}
                  toggleShow3rdParities={toggleShow3rdParities}
                  usptoMode={usptoMode}
                  lineId={lineId}
                  fullScreen={fullScreen}
                  isFullscreenOpen={true}
                  copyrights={true}
                /> 
              )
            }
          </div>
        </div>                        
        <SplitPane
          className={`splitPane pan3`}
          split={`horizontal`}
          size={leftBarSize}
          onDragStarted={() => {
            setIsDragRight(true);
          }}
          onDragFinished={size => {
            setIsDragRight(false);
          }}
          pane1Style={{
            pointerEvents: isDragRight || isDrag ? 'none' : 'auto',
          }}
          pane2Style={{
            pointerEvents: isDragRight || isDrag ? 'none' : 'auto',
          }}
        >
          {
            pdfView === true 
            ?
              <PdfViewer  c={leftBarSize} pdfTab={pdfTab} pdfFile={pdfFile} display={true} setPdfTabIndex={setPdfTabIndex} usptoMode={usptoMode} connectionMode={connectionMode}/>
            :
            <div></div> 
          } 
          {
            connectionMode === true
            ?
              <ConnectionBox display={"false"} assets={connectionData} url={apiURL}/>
            :                  
            usptoMode === true  
            ?
              <USPTOContainer asset={asset}  apiURL={apiURL}/>
            :
            <div></div>
          }   

        </SplitPane>
      </SplitPane>
      </Grid>
    </div>
  );
}

export default App;