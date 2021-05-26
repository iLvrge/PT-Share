import React, {useEffect, useState, useCallback, useRef} from 'react'
import { useLocation } from "react-router-dom"
import SplitPane from 'react-split-pane'


import { Grid } from '@material-ui/core'

import Assets from './components/Assets'

import PatentrackDiagram from './components/PatentrackDiagram'
import PdfViewer from './components/PdfViewer'
import USPTOContainer from './components/USPTOContainer'
import NewHeader from './components/NewHeader'

import './App.css'

function useDimensions() {
  return {width: window.innerWidth, height: window.innerHeight}
}

const App = () => {
  const targetRef = useRef()
  const [data, setData] = useState(null)	
  const [pdfView, setPDFView] = useState(false)
  const [pdfFile, setPDFFile] = useState({document: '', form: '', agreement: ''})
  const [pdfTab, setPdfTabIndex] = useState(2)
  const [ topPosition, setTopPosition ] = useState(0) 
  const [ parent_width, setParentWidth ] = useState(0)
  const [ bottomToolbarPosition, setBottomToolbarPosition ] = useState(0)
  const [size, setSize] = useState(useDimensions)
  const [assetsSize, setAssetsSize] = useState('10%')
  const [illustrationSize, setIllustrationSize] = useState('100%')
  const [leftBarSize, setLeftBarSize] = useState('100%')
  const [ gap, setGap ] = useState( { x: '14.1rem', y: '7.5rem'} )
  const [ showThirdParties, setShowThirdParties ] = useState(true)
  const [ usptoMode, setUsptoMode ] = useState(false)
  const [ asset, setAsset ] = useState(null)	
  const [isDrag, setIsDrag] = useState(false);
  const [isDragRight, setIsDragRight] = useState(false);
  const apiURL = 'https://betapp.patentrack.com/'


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
    if( usptoMode === true && pdfView === true ) {
      document.getElementsByClassName('pan3')[0].querySelector('.Resizer').style.display = ''
    } else {
      document.getElementsByClassName('pan3')[0].querySelector('.Resizer').style.display = 'none'
    }
  }, [ usptoMode, pdfView ])
    

  const resizePane = (name, size) => {
		localStorage.setItem(name, size)
  }
  
  const handleIllustration = useCallback(async (asset, shareCode) => {
    setPDFView(false)
    setPDFFile({ document: '', form: '', agreement: '' }) 
    setUsptoMode( prev => {
      if(prev === false) {
        setIllustrationSize('100%')
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

  const handleConnectionBox = () => {

  }

  const handleComment = () => {
    
  }

  const handleShare = () => {
    
  }

  const handlePdfView = (obj) => {		    
    if(Object.keys(obj).length > 0 && typeof obj.document_file != 'undefined') {
      setIllustrationSize('50%')
      setPDFFile({ document: obj.document_file, form: obj.document_form, agreement: obj.document_agreement }) 
      setPDFView(true)
      setPdfTabIndex(2) 
      if( usptoMode === true ) {
        setLeftBarSize('50%')
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
    setUsptoMode(mode)
    setIllustrationSize('50%')
    if(pdfView === true && mode == true) {
      setLeftBarSize('50%')
    } else if(pdfView === true && mode == false){
      setLeftBarSize('100%') 
    } else if(pdfView === false && mode == true ) { 
      setLeftBarSize('0%') 
    }
    if(mode === false) {
      setAsset(null)
      if(pdfView === false) {
        setIllustrationSize('100%')
      }
    } else {
      setAsset(patentObj.original_number)
    }  
    
    
  }

  const toggleShow3rdParities = () => {
    setShowThirdParties(!showThirdParties)
  }

  return (
    <div className={'root'}>
      <NewHeader/>
      <Grid container >
        <Grid container >
            <Assets 
              handleIllustration={handleIllustration}
              apiURL={apiURL}
            />
            <SplitPane
              className={`splitPane`}
              split="vertical"
              size={illustrationSize} 
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
              
            >
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
                    /> 
                  )
                }
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
                    <PdfViewer c={leftBarSize} pdfTab={pdfTab} pdfFile={pdfFile} display={true} setPdfTabIndex={setPdfTabIndex} usptoMode={usptoMode}/>
                  :
                  <div></div>
                } 
                {
                  usptoMode === true  
                  ?
                    <USPTOContainer asset={asset}  apiURL={apiURL}/>
                  :
                  <div></div>
                }              
              </SplitPane>
          </SplitPane>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
