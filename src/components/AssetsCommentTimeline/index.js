import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import Moment from 'moment'

import { Paper,
    Button,
    CircularProgress,
    Avatar,
    Modal,
    Grid,
    Typography,
    TextField
  } from '@material-ui/core'
  import { 
    Folder as FolderIcon,
    Close as CloseIcon,
    InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
    InsertDriveFile as InsertDriveFileIcon
  } from '@material-ui/icons'

import { Timeline, TimelineEvent } from 'react-event-timeline'
import QuillEditor from '../QuillEditor'
import Googlelogin from '../Googlelogin' 
import useStyles from './styles'

import { html } from '../../utils/html_encode_decode'
import { setTokenStorage, getTokenStorage, removeTokenStorage } from '../../utils/tokenStorage'
import { capitalizeEachWord } from '../../utils/numbers'



const AssetsCommentsTimeline = ({ toggleMinimize, size, setChannel, channel_id, illustrationBar }) => {
    const classes = useStyles()
    const googleLoginRef = useRef(null)
    const inputFile = useRef(null)
    const timelineRef = useRef(null)
    const frameRef = useRef( null )
    const editorContainerRef = useRef(null)
    const template_document_url = ''
    const [ isLoadingcomments, setIsLoadingcomments ] = useState(false)
    const [ commentsData, setCommentsData ] = useState({messages: [], users: []})
    const [ editData, setEditData ] = useState(null)
    const [ selectUser, setSelectUser] = useState(null)
    const [ replyId, setReplyId ] = useState(null)
    const [ file, setFile ] = useState(null)
    const [ displayButton, setDisplayButton] = useState( true )
    const [ commentHtml, setCommentHtml ] = useState('')
    const [ slackAuthLogin, setSlackAuthLogin ] = useState( true )
    const [ googleAuthLogin, setGoogleAuthLogin ] = useState( true )
    const [ driveModal, setDriveModal ] = useState(false)
    const [ correctAddressModal, setCorrectAddressModal ] = useState(false)
    const [ changeAddressModal, setChangeAddressModal ] = useState(false)
    const [ correctNameModal, setCorrectNameModal ] = useState(false)
    const [ changeNameModal, setChangeNameModal ] = useState(false)
    const [ driveFilesAndFolder, setDriveFilesAndFolder ] = useState( {} )
    const [ selectedDriveFile, setSelectedDriveFile] = useState(null)
    const [ activeBtn, setActiveBtn] = useState({display: false})  
    const userProfile = null
    const selectedCommentsEntity = ''
    const type = useMemo(() => selectedCommentsEntity && selectedCommentsEntity.type, [ selectedCommentsEntity ])

    const openGoogleWindow = useCallback(() => {
        if(googleLoginRef.current != null) {
          googleLoginRef.current.querySelector('button').click()
        } 
        setGoogleAuthLogin( true )
        setDisplayButton( true )
    }, [googleLoginRef])

    const getDriveDocumentList = (flag) => {

    }


    const handleSubmitComment = useCallback(async () => {

    }, [])

    const handleCancelComment = useCallback(async () => {
        setCommentHtml('')
        setEditData(null)
    }, [])

    const onEdit = useCallback(async (event, comment) => {
        event.preventDefault()
        setEditData( true )
        setReplyId(comment.ts)
        const commentText = comment.text
        setCommentHtml(commentText.replace(/<p><br><\/p>/g, ''))
    }, [])

    const onDelete = useCallback(async (event, comment) => {
        event.preventDefault()
    }, [])

    const onHandleSlackLogin = (w,h) => {    
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY
    
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height
    
        const systemZoom = width / window.screen.availWidth
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
    
        const windowOpen = window.open(`https://slack.com/oauth/v2/authorize?user_scope=${process.env.REACT_APP_SLACK_USER_SCOPE}&client_id=${process.env.REACT_APP_SLACK_CLIENTID}&redirect_uri=${process.env.REACT_APP_SLACK_REDIRECT_URL}`, 'Slack Login', `width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`)
    
        if(windowOpen != null) {
          checkWindowClosedStatus(windowOpen)
        } 
    }

    const checkWindowClosedStatus = (windowRef) => {
        setTimeout(() => {
          if(windowRef.closed === true) {
            //checkButtons()
            //checkSlackAuth()
          } else {
            checkWindowClosedStatus(windowRef)
          }
        }, 500)
    }

    const checkSlackAuth = useCallback(() => {

    }, [])

    const onHandleFileInputChange = useCallback( event => {
        if(event.target.files.length > 0) {
          const file = event.target.files[0]
          const element = document.createElement('div')
          element.setAttribute('class', 'editor-attachment') 
          const editor = editorContainerRef.current.querySelector('.ql-editor')
          const itemElement = document.createElement('div')
          itemElement.setAttribute('class', 'item') 
          if(file.type.indexOf('image') !== -1) {
            itemElement.innerHTML = `<img src="${URL.createObjectURL(file)}" class="attachment_image"/>`
          } else {
            itemElement.innerHTML = `<svg width="24" height="24" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="file" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zm-22.6 22.7c2.1 2.1 3.5 4.6 4.2 7.4H256V32.5c2.8.7 5.3 2.1 7.4 4.2l83.9 83.9zM336 480H48c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16h176v104c0 13.3 10.7 24 24 24h104v304c0 8.8-7.2 16-16 16z" class=""></path></svg> ${file.name}`
          }
          const anchor = document.createElement('a')
          anchor.innerHTML = `<svg aria-hidden="true" width="15" focusable="false" data-prefix="far" data-icon="times-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z" class=""></path></svg>`
          anchor.setAttribute('href','javascript://')
          anchor.setAttribute('class','remove-attachment')
          anchor.onclick = function() {
            editor.parentNode.removeChild(editor.parentNode.querySelector('.editor-attachment'))
          }
          itemElement.insertBefore(anchor, itemElement.firstElementChild)
          element.appendChild(itemElement)
          if(editor.parentNode.querySelector('.editor-attachment') != null) {
            editor.parentNode.removeChild(editor.parentNode.querySelector('.editor-attachment'))
          }      
          editor.parentNode.insertBefore(element, editor.nextSibling)
        }
    }, [ editorContainerRef ])

    const onHandleFileExplorer = useCallback(() => {    
        if( inputFile.current != null ) {
          inputFile.current.click()
          inputFile.current.addEventListener('change', onHandleFileInputChange)
        }
    }, [ inputFile ])

    const onAttachmentOpenedFile = useCallback(() => {    
        if( template_document_url != 'about:blank' && template_document_url != null ) {
          setCommentHtml( previousContent => previousContent + ' ' + template_document_url)
        }
    }, [ template_document_url, editorContainerRef ] )

    const openFile = useCallback((event, file) => {
        event.preventDefault()
        if((typeof file == 'string' && file.indexOf('docs.google.com') !== -1) || (file.hasOwnProperty('external_url') && file.hasOwnProperty('external_type') && file.external_type == 'gdrive') || (file.hasOwnProperty('external_url') && file.external_url.indexOf('docs.google.com') !== -1)) {
          
        } else {
          window.open(file.permalink, '_blank')
        }
    }, [  ])

    const onHandleDriveExplorer = async( event, fileID = undefined ) => {
        event.preventDefault()  
    }

    const openDriveFolder = (event, itemID, itemName) => {
        event.preventDefault()
        console.log("openDriveFolder", itemID)
        onHandleDriveExplorer(event, itemID)
    }

    const onHandleSelectFile = (event, itemID) => {
        event.preventDefault()
        console.log("onHandleSelectFile", itemID)
        //setSelectedDriveFile(`https://docs.google.com/document/d/${itemID}/edit`)
        setCommentHtml( previousContent => previousContent + `https://docs.google.com/document/d/${itemID}/edit`)
        setDriveModal( false )
    }

    const onHandleFile = (event) => {
        event.preventDefault()
        setFile(event.target.value)
    }

    const handleDriveModalClose = (event) => {
        event.preventDefault()
        setDriveModal(false)
    }

    const handleFocus = useCallback((range, source, editor) => {
        const getSlackUser = getTokenStorage( 'slack_auth_token_info' );
        if(getSlackUser &&  getSlackUser != '') {
          editorContainerRef.current.classList.add('focus')
        }    
    }, [ editorContainerRef ])
    
    const handleBlur = useCallback((previousRange, source, editor) => {
        editorContainerRef.current.classList.remove('focus');
    }, [ editorContainerRef ])

    const FolderList = ({items}) => {
        return items.map( item => {
          if(item.mimeType == 'application/vnd.google-apps.folder'){
            return (
                <div key={item.id} className={classes.item} onClick={(event) => openDriveFolder(event, item.id, item.name)}>
                  <Typography variant="body1" component="h2">
                    <FolderIcon /><span>{item.name}</span>
                  </Typography>
                </div>
            )
          } else {
            return null
          }
        })
    }
    
    const FilesList = ({items}) => {
        return items.map( item => {
          if(item.mimeType != 'application/vnd.google-apps.folder'){
            return (
              <div key={item.id} className={classes.item} onClick={(event) => onHandleSelectFile(event, item.id)}>
                <Typography variant="body1" component="h2">
                  <InsertDriveFileIcon /><span>{item.name}</span>
                </Typography>
              </div>
            )
          } else {
            return null
          }
        })
    }

    const templateBody = useMemo(() => {   
        return (
          <Grid container className={classes.driveModal}>
            {
              driveFilesAndFolder.hasOwnProperty('files') && driveFilesAndFolder.files.length > 0
              ?
              <>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="body1" component="h2" className={classes.heading}>
                    Folders
                  </Typography>
                  <Grid item lg={12} md={12} sm={12} xs={12} className={classes.items}>
                    <FolderList items={driveFilesAndFolder.files} />
                  </Grid>              
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Typography variant="body1" component="h2" className={classes.heading}>
                    Files
                  </Typography>
                  <Grid item lg={12} md={12} sm={12} xs={12} className={classes.items}>
                    <FilesList items={driveFilesAndFolder.files} />
                  </Grid>
                </Grid>
              </> 
              :
              ''
            } 
          </Grid>
        )    
    }, [ driveFilesAndFolder ])

    const CommentEditor = () => {
        //if (!selectedCommentsEntity) return null
        return (
          <div className={`${classes.commentEditor} editor`} ref={editorContainerRef}> 
            <QuillEditor
              value={commentHtml}
              onChange={setCommentHtml}
              onSubmit={handleSubmitComment}
              onCancel={handleCancelComment}
              openGoogleWindow={openGoogleWindow}
              onDrive={getDriveDocumentList}
              onAttachmentFile={onHandleFileExplorer}
              onAttachmentOpenedFile={onAttachmentOpenedFile}
              onAttachmentDriveFile={onHandleDriveExplorer}
              onSelectUser={setSelectUser}
              onFocus={handleFocus}
              onBlur={handleBlur} 
              driveFile={selectedDriveFile} 
            />
            <input type='file' id='attach_file' ref={inputFile} style={{display: 'none'}} onChange={onHandleFile}/>
          </div> 
        )
    }

    const FileImage = ({file}) => {
        const fileURL = file !== 'string' && file.hasOwnProperty('external_url') ? file.external_url : ''
        let imageURL = ''
        if(fileURL.toString().indexOf('docs.google.com') !== -1 && fileURL.toString().indexOf('document') !== -1){
          imageURL = 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document'
        } else if(file.hasOwnProperty('external_type') && file.hasOwnProperty('thumb_64')){
          imageURL = fileURL.thumb_64
        }
        return(
          <>
          {
            imageURL != '' && (
              <img src={imageURL} />
            )
          }
          </>
        )
    }
    
    const ShowFiles = ({indexing, files}) => {
        if(!files.hasOwnProperty('files') || files.files.length == 0) return null
    
        return (
          <>
            {
              files.files.map( (file, index) => (
                <div key={`${indexing}-${index}`}>
                  <a onClick={(event) => { openFile(event, file)}} className={classes.fileLink}><FileImage file={file}/>{file.title}</a>
                </div>
              ))
            }
          </>
        )
    }


    
    const ShowUser = ({users, item}) => {    
        if(users.length === 0) return item.user
        const checkUser = users.findIndex( user => user.id == item.user)
        return (
          <span>
            {
              checkUser !== -1
              ?
                users[checkUser].profile.first_name 
                ? `${users[checkUser].profile.first_name} ${users[checkUser].profile.last_name}`
                : users[checkUser].name
              :
              item.user
            }
            {
              checkUser !== -1 
              ? users[checkUser].profile.title 
                ? 
                ', '+ capitalizeEachWord(users[checkUser].profile.title) 
                : ''
              : ''
            }
            <span className={classes.message_time}>{Moment(new Date(item.ts * 1000)).format('l HH:mm')}</span>
          </span>
        )
    }
    
    
    const ShowUserAvtar = ({users, item}) => {
        if(users.length === 0) return <Avatar>{`${item}`}</Avatar>
        const checkUser = users.findIndex( user => user.id === item)
        if(checkUser >= 0) {
          return <Avatar alt={`${users[checkUser].profile.display_name}`} src={users[checkUser].profile.image_48} className={classes.small}/>
        } else {
          return <Avatar>{`${item}`}</Avatar>
        }
    }

    const TimelineItem = ({users, comment}) => {    
        if(comment.hasOwnProperty('subtype')) return null
        let message = comment.text
        if(message.indexOf('docs.google.com') !== -1) {
          const match = message.match(/<([^\s>]+)(\s|>)+/)
          if(match != null) {
            const link = match[1]
            if( typeof comment.files != 'undefined' &&  comment.files.length == 1 ) {
              if(comment.files[0].external_type == 'gdrive' &&  link == comment.files[0].external_url ) {
                message = ''
              }
            } else {
              message += `<div><a href='#' class='message_link' data-link="${link}">${link}</a></div>`
            }
          }
        } 
        return (
            <TimelineEvent
                key={`comment-${comment.ts}`}
                contentStyle={{ background: '#303030' }}
                bubbleStyle={{ 
                background: 'rgb(48 48 48)', 
                border: '2px solid #303030',
                width: '40px', 
                height: '40px', 
                }}
                cardHeaderStyle={{ color: 'white' }}
                title={<ShowUser users={users} item={comment} />}
                icon={<ShowUserAvtar users={users} item={comment.user} />}
                iconStyle={{width: '36px', height: '36px'}}
            >
            <div 
              dangerouslySetInnerHTML={{ __html: message }} />
            <ShowFiles 
              files={comment} 
              indexing={`file-comment-${comment.ts}`} />            
          </TimelineEvent>
        )
    }

    const CommentsTimeline = () => {
        return (
          <div className={classes.commentTimelineSection} ref={timelineRef}>   
            {
              type && isLoadingcomments ? (
                <CircularProgress className={classes.loader} />)
              :
                commentsData.messages != undefined && commentsData.messages.length > 0 ? (
                <Timeline 
                  className={classes.timeline} 
                  lineColor={'rgb(191 191 191)'}>
                  {
                    commentsData.messages.map( (comment, index) => (
                      <TimelineItem key={index} users={commentsData.users} comment={comment}/>                  
                    ))
                  }            
                </Timeline>
                )
                : 
                <div />
            }
          </div>
        )
    }

    return (
        <Paper className={classes.root} square>
            <div className={classes.content}>
                {
                    displayButton === true
                    ?
                        <div className={classes.button}>
                            {
                            slackAuthLogin && (<Button 
                                onClick={() => {
                                onHandleSlackLogin(900, 830)
                                }
                                }
                            >
                                <img 
                                alt='Sign in with Slack' 
                                height='40' 
                                width='172' 
                                src='https://platform.slack-edge.com/img/sign_in_with_slack.png' 
                                srcSet='https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x' />
                            </Button>)              
                            }

                            {
                            googleAuthLogin && (
                                <span ref={googleLoginRef}>
                                <Googlelogin/>
                                </span>)
                            }
                        </div> 
                    :
                    ''
                }
                <CommentsTimeline />                
                <CommentEditor />
            </div>
            <Modal
                open={driveModal}
                onClose={(e) => handleDriveModalClose(e)}
                aria-labelledby="Drive-Files-Modal"
                aria-describedby=""
            >
                {templateBody}
            </Modal>
        </Paper>
    ) 
}


export default AssetsCommentsTimeline