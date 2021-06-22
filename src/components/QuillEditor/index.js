import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react'

import ReactQuill from 'react-quill'
import {
  Menu,
  MenuItem,
  Modal,
  Backdrop,
  DialogContent
} from '@material-ui/core'

import useStyles from './styles'
import CustomToolbar from './CustomToolbar'

import { setTokenStorage, getTokenStorage } from '../../utils/tokenStorage'
import {downloadFile} from '../../utils/html_encode_decode'
import 'react-quill/dist/quill.snow.css'
import './styles.css'

const QuillEditor = ({
  placeholder = 'Message #',
  value = '',
  onSelectUser = (value) => {},
  onChange = (value) => {},
  onSubmit = (value) => {},
  onCancel = () => {},
  onDrive = () => {},
  openGoogleWindow = () => {},
  onSalesAssets = () => {}, 
  onCorrectAddress = () => {},
  onChangeAddress = () => {},
  onCorrectName = () => {},
  onChangeName = () => {},
  onAttachmentDriveFile = () => {},
  onAttachmentFile = () => {},
  onFocus = () => {},
  onBlur = () => {},
  driveFile = '',
  slack_users = []
}) => {

  const classes = useStyles()
  const quillRef = useRef(null)
  

  const [ userListMenu, setUserListMenu ] = useState( null )
  const [ loadingUSPTO, setLoadingUSPTO ] = useState(false)
  const [ modalOpen, setModalOpen] = useState(false)
  const [ redo, setRedo ] = useState([])

  const quill = useMemo(() => {
    if (!quillRef.current) return null
       
    return quillRef.current.getEditor()
  }, [ quillRef.current ]) 

  useEffect(() => {
    if (!quillRef.current) return null
    
    if( driveFile != null ) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex , driveFile)
      editorRef.getEditor().setSelection(selectionIndex +  driveFile.length)
    }
  }, [ driveFile, quillRef ])
  
  
  const openUSPTOWindow = (w, h) => {
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop

    window.open('https://fees.uspto.gov/MaintenanceFees/', 'Maintainence Fee', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)
  }
  

  const onHandleSubmitToUSPTO =  useCallback( async () => {      
    
  }, [  ])

  const onHandleModalClose = () => {
    setModalOpen(false)
  }
  
  const onCloseUserMenu = () => {
    setUserListMenu(null);
  }

  const GetMenuComponent = useMemo(() => {
    return (
      <Menu
        id="users_list"
        anchorEl={userListMenu}
        keepMounted
        open={Boolean(userListMenu)}
        onClose={onCloseUserMenu}
      >
        {
          slack_users.length > 0 && slack_users.map( user => {
            return user.id != 'USLACKBOT' && user.deleted === false  ? <MenuItem key={user.id} onClick={(event) => {onUserClick(event, user)}}>{ user.real_name == undefined || user.real_name == null ? user.profile.real_name : user.real_name }</MenuItem> : ''}
          )
        }
      </Menu>
    )
  }, [ slack_users, userListMenu ])

  const onUserClick = useCallback((event, user) => {   
    const name = user.real_name == undefined || user.real_name == null ? user.profile.real_name : user.real_name
    if(quillRef.current  != null) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex, name) 
      editorRef.getEditor().setSelection(selectionIndex +  name.length)
    }
    onSelectUser(user.id) 
    setUserListMenu(null);
  },[ quillRef ])

  const onUsersList = useCallback(( event ) => {
    if(quillRef.current  != null) {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex, '@') 
      editorRef.getEditor().setSelection(selectionIndex +  2)
    }
    
    //dispatch(getSlackUsersList())
    setUserListMenu( event.currentTarget )
  }, [  quillRef ])

  const onAttachmentOpenedFile = useCallback(() => {    
    /* if( template_document_url != '') {
      const editorRef = quillRef.current
      const selectionIndex = editorRef.getEditor().getSelection().index
      editorRef.getEditor().insertText(selectionIndex , template_document_url)
      editorRef.getEditor().setSelection(selectionIndex +  template_document_url.length + 1)
    } */
  }, [ /* template_document_url, */ quillRef ] )

  const onAttachmentOpenedFileAndEmail = useCallback(() => {    
    /* if( template_document_url != '') {
      navigator.clipboard.writeText(template_document_url)
      window.open('https://mail.google.com/mail/u/0/?view=btop&ver=ops2cvpehp6#cmid%253D1&s','GMAIL')
    } */
  }, [ /* template_document_url, */ quillRef ] )  

  const onShare = useCallback(async () => {
    
  }, [  ])

  


  return (
    <div className={classes.root}>
      <div className={classes.textEditor}>
        <ReactQuill
          ref={quillRef}
          theme='snow'
          modules={CustomToolbar.modules}
          formats={CustomToolbar.formats}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        /> 
        
        <CustomToolbar 
          quillEditor={quillRef}
          quill={quill} 
          onClick={onSubmit} 
          onUserClick={onUsersList} 
          onDocument={onDrive} 
          onAttachmentOpenedFile={onAttachmentOpenedFile}
          onAttachmentOpenedFileAndEmail={onAttachmentOpenedFileAndEmail}
          onAttachmentFile={onAttachmentFile} 
          onAttachmentDriveFile={onAttachmentDriveFile}          
          onSubmitUSPTO={onHandleSubmitToUSPTO}          
          onShare={onShare} 
          loadingUSPTO={loadingUSPTO}
        /> 
        {/* {GetMenuComponent} */}
      </div>       
    </div>
  )
}

export default QuillEditor