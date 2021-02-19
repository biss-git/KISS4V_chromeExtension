


/**
 * 再生する
 */
function voiceroidPlay(text, lastVoiceroid){
  chrome.storage.local.get('voiceroidType', (items) => {
    const text2 = text.replace(/\n[\s\n]*\n/g, '\n\n');
    body = {
      command: 'play',
      TalkText: text2,
      voiceroidName: lastVoiceroid ? lastVoiceroid : items.voiceroidType,
    };
    axios.post('http://localhost:51008/api/voiceroid/process', body)
      .then(response => {
        const p = response.data;
        chrome.storage.local.set({'lastVoiceroid': p.voiceroidName}, () => {});
      })
      .catch(error => {
        console.log(error);
        chrome.storage.local.set({'autoActive': false}, () => {});
      })
      // .finally(() => {
      //   console.log('play finally')
      // })
  });
}

/**
 * 停止してから再生する
 */
function voiceroidPlayWithStop(text, lastVoiceroid){
  body = {
    command: 'stop',
  };
  axios.post('http://localhost:51008/api/voiceroid/process', body)
    .then(response => {
      voiceroidPlay(text, lastVoiceroid);
    })
    .catch(error => {
      console.log(error);
      if(error.response.status == 503){
        voiceroidRun();
      }
      chrome.storage.local.set({'autoActive': false}, () => {});
    });
}

function voiceroidPlayWithStop_translate(text, lastVoiceroid){
  axios.get('https://script.google.com/macros/s/AKfycbzjEm0Pbx1bI815tMxkzv5BztRzLyMGj8QqvaBKgc2R4V3rFmBP7xgd/exec',
  {params: {text: text, source: 'en', target: 'ja'} })
  .then(response => {
    voiceroidPlayWithStop(response.data.text, lastVoiceroid);
  })
}

/**
 * 停止する
 */
function voiceroidStop(){
  body = {
    command: 'stop',
  };
  axios.post('http://localhost:51008/api/voiceroid/process', body)
    .then(response => {
      console.log(JSON.stringify(response.data));
    })
    .catch(error => {
      console.log(error);
      chrome.storage.local.set({'autoActive': false}, () => {});
    })
    // .finally(() => {
    //   console.log('stop finally')
    // });
}


function voiceroidRun(){
  body = {
    command: 'run',
  };
  axios.post('http://localhost:51008/api/voiceroid/process', body)
    .then(response => {
      chrome.storage.local.set({'autoActive': false}, () => {});
    });
}