
//Constants
export const HTTP_OK_REQUEST = 200

export const ALLOWED_IMAGE_EXTENSIONS = ".png, .jpg, .gif, .jpeg"
export const ALLOWED_PDF_EXTENSIONS = ".pdf"
export const MAX_ALLOWED_COURSE_NAME = 70
export const MAX_ALLOWED_COURSE_CODE = 30

//Function to handle api request response
export const handleResponse = (r, api, successMessage, delay, postSuccess, postError) => {
    if(!r){
      return
    }
    const {error} = r

    api.destroy()

    if(error){
      api.error(error)

      if(postError) postError();

    }
    else{
      api.success(successMessage, delay || 3)
      .then(() => {
        if(postSuccess) postSuccess();
      })

      
    }

}

//Function to open a new window with a certain path
export const goToPageRelativePath = (relativePath) => {
  const WEBSITE_URL = document.location.origin

  const url = WEBSITE_URL + '/' + relativePath
  
  window.open(url)
}

//Function to open a new window with for a certin question
export const goToQuestionViewEdit = (q) => {
  const {Id, Type} = q

  goToPageRelativePath('question_view_edit/'+Id+'/'+Type)
}

export const goToQuestionViewEditSamePage = (navigate, q) => {
  const {Id, Type} = q

  navigate('/question_view_edit/'+Id+'/'+Type)
}


//Function to open a new window with for a certin series
export const goToSeriesViewEdit = (s) => {
  const {Code} = s

  goToPageRelativePath('series_edit_view/'+Code)
}

//Function to open a new window with for a certin map play
export const goToMapPlay = (m) => {
  const {Id} = m

  goToPageRelativePath('playcoursemap/'+Id)
}

export const goToMapPlaySamePage = (navigate, m) => {
  const {Id} = m

  navigate('playcoursemap/'+Id)
}


//Function to convert user name to short letters
export const getShortenedName = (name) => {
  if(!name) return ''
  
  const nameSplit = name.split(' ')

  if(nameSplit.length === 1) return nameSplit[0][0]
  if(nameSplit.length > 1) return nameSplit[0][0] + nameSplit[1][0]

}

//Function to convert datetime to proper format 
export const beautifyDatetime = (dt) => {
  return (dt.substring(0, 10) + ' ' + dt.substring(11, 19))
}

//Function to convert date to proper format 
export const beautifyDate = (dt) => {
  return (dt.substring(0, 10))
}

//Function to convert time to proper format 
export const beautifyTime = (dt) => {
  return (dt.substring(11, 19))
}


//Function to convert number to k , m ... etc format 
export const beautifyNumber = (value) => {
    let suffixes = ["", "k", "m", "b","t"];
    let suffixNum = Math.floor((""+value).length/3);
    let shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
    }

    return shortValue+suffixes[suffixNum];
}

//Function to convert image 
export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

//Dummy request 
export const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
};

//Function to convert seconds to HH:MM:SS
export const convertSecondsToHHMMSS = (seconds) => {
  // Hours, minutes and seconds
  const hrs = ~~(seconds / 3600);
  const mins = ~~((seconds % 3600) / 60);
  const secs = ~~seconds % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
}

//Function to download a file 
export function downloadFile(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}

//Function to get pages array in search tools 
const GetNumberOfPages = (numberOfQuestions, QuestionsPerPage) => {
  let N = Math.floor(numberOfQuestions/QuestionsPerPage) + Math.ceil((numberOfQuestions%QuestionsPerPage)/QuestionsPerPage)

  return N
}

export const GetPagesArray = (numberOfQuestions, QuestionsPerPage, QCodes) => {
  let N = GetNumberOfPages(numberOfQuestions, QuestionsPerPage)
  let A = []

  for(let i =0; i<N; i++){
      let Length1 = (i) * QuestionsPerPage
      let Length2 = (i+1) * QuestionsPerPage

      let Char1 = ""
      let Char2 = ""

      let total = 0
      for(let qc of QCodes){
          total += qc.Number

          if(Length1 <= total){
              Char1 = qc.Code 
              break
          }
      }

      total = 0

      for(let qc of QCodes){
          total += qc.Number

          if(i === N-1){
              Char2 = QCodes[QCodes.length - 1].Code

              break
          }

          if((total - qc.Number)<=Length2 && Length2 <= total){
              Char2 = qc.Code 
              break
          }
      }


      A.push({
          Index:i+1,
          Character: " (" + Char1 + "-" + Char2 + ")"
      })// +  )
  }

return A
}

//Function to fix URL 
export function FixURL(url){
  return url.replaceAll("\\", '/').replaceAll(' ', '%20')
}

//Functions to get unique values in an array 
export function getUniqueValues(array){
  return array.filter( onlyUnique );
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

//Function to convert datetime to (time) ago 
export function timeSince(_date) {
    let date = Date.parse(_date);
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

//Function to move elements in array (left / right)
export const moveElementInArray = (ei, e, array, leftDirection) => {
  let _newArray = [...array]

  //Remove element
  _newArray = _newArray.filter((p, pi) => ei !== pi)

  //Re-insert at specific index
  const newIndex = leftDirection ? (ei - 1) : (ei + 1)

  _newArray = [
      ..._newArray.slice(0, newIndex),
      ({...e}),
      ..._newArray.slice(newIndex)
  ]

  return _newArray
}