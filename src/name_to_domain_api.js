const request = require('request'),
    connection = require("./config/index"),
    CitedPatents = require("./models/CitedPatents"),
    AssigneeOrganizations = require("./models/AssigneeOrganizations");

const clearbit = require('clearbit')('sk_d89c1b8d6af056c47526bc5efa4ae544');
const RITEKIT_CLIENTID = `9e44da1127bae5aee46bb12723f7dada36d3ae76916d`
const UPLEAD_CLIENTID = `977c4d4eaa39794b7ee53b4d8da026b1`


const Pusher = require("pusher")

const APPID='938985'
const KEY='3252bb191d77e92ddb3c'
const SECRET='2a3dd823cd1abcd45c71'
const CLUSTER='us3'
const USETLS=true
const CHANNEL='patentrack-channel'
const EVENT='patentrack-event'

const pusher = new Pusher({
    appId: APPID,
    key: KEY,
    secret: SECRET,
    cluster: CLUSTER, 
    useTLS: USETLS,
    keepAlive: true,
})

const argumentSlice = process.argv.slice(2)
const organisationID = argumentSlice[0], apiName = argumentSlice[1]



let getAssigneeList = [], errorCodes = []


const sendNotification = (message) => {
    pusher.trigger(CHANNEL, EVENT, message)
}

const NameToDomain  = clearbit.NameToDomain;

const retrieveCitedPatentAssignee = async(startIndex) => {
    let name = getAssigneeList[startIndex].assignee_query
    
    console.log('getAssigneeList[startIndex].assignee_organization', name, apiName)
    switch (apiName) {
        case 'clearbit':
            clearbitAPI(name, startIndex)
            break;
        case 'uplead':
            upleadAPI(name, startIndex)
        break;
        case 'ritekit':
            ritekitAPI(name, startIndex)
        break;
    }
    
}

const updateAssigneeData = (domain, api_logo, assignee_id) => {
    AssigneeOrganizations.update({
        domain,
        api_logo
    }, {
        where: {
            assignee_id
        }
    })
}

const clearbitAPI = (name, startIndex) => {
    NameToDomain.find({name})
    .then(function (result) {
        console.log('result', result)
        const { domain, logo } = result
        updateAssigneeData(domain, logo, getAssigneeList[startIndex].assignee_id)
        sendNotification(`Logo retreieved for ${getAssigneeList[startIndex].assignee_organization}`)
        checkNextRow(startIndex)
    })
    .catch(NameToDomain.NotFoundError, function (err) {
        console.log('ERROR FROM API', err); // Domain could not be found
        sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
        checkNextRow(startIndex)
    })
    .catch(function (err) {
        console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request', err);
    })
}

const upleadAPI = (name, startIndex) => {
    console.log("IN upleadAPI")
    sendRequest(`https://api.uplead.com/v2/company-name-to-domain?company_name=${encodeURIComponent(name)}`,{Authorization: UPLEAD_CLIENTID})
    .then( response => {
       
        const result = JSON.parse(response.body)
        if(result !== null && typeof result.data !== 'undefined' && result.data !== null) {
            const { domain, logo } = result.data
            updateAssigneeData(domain, logo, getAssigneeList[startIndex].assignee_id)
            sendNotification(`Logo retrieved for ${getAssigneeList[startIndex].assignee_organization}`)
            checkNextRow(startIndex)
        } else {
            sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
            checkNextRow(startIndex)
        }        
    })
    .catch( error => {
        console.log('ERROR IN UNLEAD', error)
        sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
        checkNextRow(startIndex)
    }) 
}


const sendRequest = (url, headers) => {
    console.log(`REQUESTED URL: ${url}`)
    const promise = new Promise((resolve, reject) => {
        const  request = require('request');
        let options = {
            method: 'GET',
            url,
            headers
        };
        request(options, function (error, response) {
            if (!error){
                resolve(response)
            } else {
                reject(error)
            }
        })
    })
    return promise
}

const runRitekitLogo = ( domains, startIndex) =>{
    console.log('runRitekitLogo', domains['0'])
    try {
        let logoURL = `https://api.ritekit.com/v2/company-insights/logo?client_id=${RITEKIT_CLIENTID}&domain=${domains['0']}&generateFallbackLogo=0&squareLogoSize=256&squareLogoBackground=original`
        sendRequest(logoURL, {})
        .then( response => {
            console.log('FIRST LOGO', response.body)
            let {result, url} = JSON.parse(response.body);
            if(result === true && typeof url !== 'undefined' && url !== null) {
                updateAssigneeData(domains['0'], url, getAssigneeList[startIndex].assignee_id)
                sendNotification(`Logo retrieved for ${getAssigneeList[startIndex].assignee_organization}`)
                checkNextRow(startIndex)
            } else if( result === false) {
                console.log(`TESTING FIRST: ${domains['1']}`)
                if(typeof domains['1'] !== 'undefined') {
                    console.log('INSIDE ANOTHER DATATATATATATATATATATATATATAT')
                    logoURL = `https://api.ritekit.com/v2/company-insights/logo?client_id=${RITEKIT_CLIENTID}&domain=${domains['1']}&generateFallbackLogo=0&squareLogoSize=256&squareLogoBackground=original`
                    sendRequest(logoURL, {})
                    .then( response => {
                        console.log('SECOND LOGO', response.body)
                        let {result, url } = JSON.parse(response.body);
                        if(result === true && typeof url !== 'undefined' && url !== null) {
                            updateAssigneeData(domains['1'], url, getAssigneeList[startIndex].assignee_id)
                        }
                        sendNotification(`Logo retrieved for ${getAssigneeList[startIndex].assignee_organization}`)
                        checkNextRow(startIndex)
                    })
                    .catch( error => {
                        sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
                        checkNextRow(startIndex)
                    })
                } else {
                    sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
                    checkNextRow(startIndex)
                }
            }
        }).catch( error => {
            console.log('ERROR', error)
            if(typeof domains['1'] !== 'undefined') {
                console.log('INSIDE ANOTHER DATATATATATATATATATATATATATAT')
                logoURL = `https://api.ritekit.com/v2/company-insights/logo?client_id=${RITEKIT_CLIENTID}&domain=${domains['1']}&generateFallbackLogo=0&squareLogoSize=256&squareLogoBackground=original`
                sendRequest(logoURL, {})
                .then( response => {
                    console.log('SECOND LOGO', response.body)
                    let {result, url } = JSON.parse(response.body);
                    if(result === true && typeof url !== 'undefined' && url !== null) {
                        updateAssigneeData(domains['1'], url, getAssigneeList[startIndex].assignee_id)
                    }
                    sendNotification(`Logo retrieved for ${getAssigneeList[startIndex].assignee_organization}`)
                    checkNextRow(startIndex)
                })
                .catch( error => {
                    sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
                    checkNextRow(startIndex)
                })
            } else {
                sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
                checkNextRow(startIndex)
            }
        })
    } catch( error ) {
        console.log(error)
        sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
        checkNextRow(startIndex)
    }
}

const ritekitAPI = (name, startIndex) => {    
    sendRequest(`https://api.ritekit.com/v2/company-insights/name-to-domain?name=${encodeURIComponent(name)}&client_id=${RITEKIT_CLIENTID}`, {})
    .then( response => {
        console.log('FIRST DOMAIN', response.body)
        let {result, data} = JSON.parse(response.body);
        if(result === true) {
            if(data !== null) {
                console.log('INSIDE DATATATATATATATATATATATATATAT')
                if(Object.keys(data).length > 0) {
                    console.log('KEYS FOUND')
                    runRitekitLogo(data, startIndex)
                } else {
                    sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
                    checkNextRow(startIndex)
                }               
            } else {
                sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
                checkNextRow(startIndex)
            }
        } else {
            checkNextRow(startIndex)
            sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
        }
    })
    .catch( error => {
        sendNotification(`No data find for ${getAssigneeList[startIndex].assignee_organization}`)
        checkNextRow(startIndex)
    }) 
}

const checkNextRow = (startIndex) => {
    startIndex += 1
    if(startIndex < getAssigneeList.length) {
        retrieveCitedPatentAssignee(startIndex)
    } else {
        if(errorCodes.length > 0) {
            sendNotification(`Find error from API in these patents: ${errorCodes.join(', ')}`)
        }
        sendNotification(`Cited Patents finished.`)
    }
}

const optimizeAssigneeName = (name) => {
    const regex = /\b(?:inc|llc|corporation|corp|systems|system|llp|industries|gmbh|lp|agent|sas|na|bank|co|states|ltd|kk|a\/s|aktiebolag|kigyo|kaisha|university|kabushiki|company|plc|gesellschaft|gesmbh|société|societe|mbh|aktiengesellschaft|haftung|vennootschap|bv|bvba|aktien|limitata|srl|sarl|kommanditgesellschaft|kg|gesellschaft|gbr|ohg|handelsgesellschaft|compagnie|privatstiftung|foundation|sa)\b/ig

    name = name.replace(regex, '')
    name = name.replace(/\s+/, ' ')
    name = name.replace(/[,]/g, ' ')
    name = name.replace(/[.]/g, ' ')
    name = name.replace(/[!]/g, ' ')
    return name.trim();
}


( async () => {    
    const queryCitingAssignees = `SELECT ao.assignee_id, ao.assignee_organization, ao.assignee_query, ao.domain, ao.api_logo FROM assignee_organizations AS ao
                            INNER JOIN cited_patents AS cp ON cp.assignee_id = ao.assignee_id
                            WHERE cp.patent_number IN (SELECT grant_doc_num FROM assets WHERE organisation_id = :organisationID AND grant_doc_num <> '' GROUP BY grant_doc_num) AND ao.domain = "" AND ao.api_logo = "" AND organisation_id = 0  GROUP BY ao.assignee_organization`
    //console.log('connection', connection)
    getAssigneeList = await connection.application.query(queryCitingAssignees,{
            type: connection.Sequelize.QueryTypes.SELECT,
            raw: true,
            logging: console.log,
            replacements: {organisationID},
        }
    );
    console.log('getAssignees.length', getAssigneeList.length)
   if( getAssigneeList.length > 0 ) {
        sendNotification(`Total patents: ${getAssigneeList.length}`)
        retrieveCitedPatentAssignee(0) 
        /* getAssigneeList.forEach( assignee => {
            const query = optimizeAssigneeName(assignee.assignee_organization)
            AssigneeOrganizations.update({
                assignee_query: query
            },{
                where: {
                    assignee_id: assignee.assignee_id
                }
            })
        })
         */

    }       
})();