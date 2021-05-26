import React, { useState, useEffect, useRef } from 'react'
import useStyles from './styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import { Close } from '@material-ui/icons'
import FullscreenIcon from '@material-ui/icons/Fullscreen'


/*let pdfFile = "";*/

function PdfViewer(props) {
  const viewerRef = useRef();
  const { pdfTab, setPdfTabIndex, usptoMode } = props
  const classes = useStyles()
  const [ mainPdf, setMainPdf ] = useState('about:blank')
  const [ formPdf, setFormPdf ] = useState('about:blank')
  const [ agreementPdf, setAgreementPdf ] = useState('about:blank')
  const [ fullView, setFullView ] = useState('')

  const checkHeight = (pdfTab) => {
    //const containerName = pdfTab == 2 || pdfTab == 3 ? 'iframe_main' : pdfTab == 0 ? 'iframe_agreement' : 'iframe_form'
    const parentElement = viewerRef.current
    const iframeElement = parentElement.querySelector(`iframe`)
    if(iframeElement != null) {
        /* const height = props.fullScreen === false ? parentElement.parentNode.clientHeight : ( props.pdfFile.agreement == '' || props.pdfFile.agreement == null) ?  window.innerHeight : parentElement.clientHeight */
       const height =  window.innerHeight
      iframeElement.style.height = height - 43 + 'px' 
      parentElement.style.height = '100%' 
    }    
  } 

  useEffect(()=> {
    if(props.pdfView == 'true') {
      setFullView(classes.fullView) 
    }
    if(props.pdfFile) {
      setMainPdf(props.pdfFile.document != '' ? props.pdfFile.document+'#zoom=FitH' : 'about:blank')
      setFormPdf(props.pdfFile.document != '' ? props.pdfFile.form+'#zoom=FitH' : 'about:blank')
      setAgreementPdf(props.pdfFile.document != '' ? props.pdfFile.agreement+'#zoom=FitH' : 'about:blank')      
    }
  },[ classes.fullView, props.pdfFile, props.pdfView ]) 

  useEffect(() => {
    console.log("props", props)
    if(props.resize === true) {
      checkHeight(pdfTab)
    }
  }, [props, pdfTab]) 
  

  const closeViewer = () => {
    if(props.display === "false") {
      props.setPDFFile({ document: '', form: '', agreement: '' })
      props.setPDFView(false)
      props.setPdfTabIndex(0)  
    } else {
      props.setPDFViewModal(false)
    }
  }

  const handleClickOpenFullscreen = () => {
    props.setPDFViewModal(true)

  }

  
  return (
    <div style={{height: usptoMode === false ? 'calc(100% - 60px)' : '100%', width: '100%'}}>
      <div 
          className={classes.pdfContainer}
          >
            <div className={`${classes.pdfWrapper} ${fullView}`} id={'pdfViewer'} ref={viewerRef}>
                            
              <div className={classes.container}>
                {
                  (pdfTab === 2 || pdfTab === 3) && mainPdf != 'about:blank'
                  ?
                  <iframe id={'iframe_main'} title='main iframe' onLoad={() => checkHeight(2)} className={classes.outsource} src={mainPdf}/>
                  :
                  pdfTab === 1 && formPdf != 'about:blank'
                  ?
                  <iframe id={'iframe_form'} title='form iframe' className={classes.outsource} onLoad={() => checkHeight(1)} src={formPdf}/>
                  :
                  agreementPdf != 'about:blank' 
                  ? 
                  <iframe id={'iframe_agreement'} title='agreement iframe' onLoad={() => checkHeight(0)} className={classes.outsource} src={agreementPdf}/>
                  :
                  ''
                }   
              </div>
              {
                pdfTab < 3 && (mainPdf != 'about:blank' || formPdf != 'about:blank' ||  agreementPdf != 'about:blank' )
                ?
                  <Tabs
                    value={pdfTab}
                    onChange={(e, id) => setPdfTabIndex(id)}
                    className={classes.tabs}
                    variant={'scrollable'}
                  >
                    {
                      [ 'Agreement', 'Form', 'Main' ].map((tab) => (
                        <Tab
                          key={tab}
                          label={tab}
                          className={classes.tab}
                        />
                      )) 
                    }
                  </Tabs>
                :
                ''
              }        
            </div>
          </div>
    </div>
    
  )
}

export default PdfViewer