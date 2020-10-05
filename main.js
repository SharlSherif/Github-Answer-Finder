emojis = Array.from(document.querySelectorAll('.js-timeline-item .comment-reactions-options')).map(e => {
  if (e.children.length > 1) {
    return Array.from(e.children).map(ee => ee.innerText.split(' ').concat(e.parentElement.parentElement.parentElement.parentElement))
  } else {
    return e.children[0].innerText.split(' ').concat(e.parentElement.parentElement.parentElement.parentElement)
  }
})

highestVote = [];
symbolValue = {
  "👍": 1,
  "🎉": 2,
  "❤️": 2,
  "🚀": 1,
  "😄": 1,
  "👀": 0,
  "👎": 0,
  "😕": 0
}
/* 
  one type of emoji vote means "emoji" would have a length of 2 eg. ["👍", "1"]
  more than one type of emoji vote means "emoji" would have a length > 2 
  eg. (2) [Array(2), Array(2)]
        0: ["👍", "2"]
        1: ["🎉", "1"]
*/

function findAnswers() {
  removeAnswerAlert()    
  for (emoji of emojis) {
    const highestVoteValue = Math.max(highestVote.map(vote => vote.symbolValue))
    const highestVoteNValue = Math.max(highestVote.map(vote => vote.n))
    console.log('highest value :', highestVoteValue)

    const vote = Number(emoji[1]);
    const symbol = emoji[0]
    const commentElement = emoji[2]

    if ((vote >= Math.round(highestVoteNValue / 2) || vote >= highestVoteNValue) && symbolValue[symbol] >= highestVoteValue) {
      highestVote.push({ n: vote, symbolValue: symbolValue[symbol], symbol, commentElement })
    }
  }

  appendAnswers(highestVote)
}


function scrollToAnswer(element) {
  element.style.border = '1px solid red'
  element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
}

function appendAnswers(answers) {

  let container = document.querySelector('.container-lg')
  let mainDiv = document.createElement('div')
  let ul = document.createElement('ul')
  mainDiv.className = 'possibleAnswer'
  ul.style = 'list-style-type: none;'
  ul.appendChild(document.createElement('br'))

  if (answers.length < 1) {
    let li = document.createElement('li')
    li.appendChild(document.createTextNode(`No possible answer was found`))
    li.style = 'font-size:20px;cursor:pointer;color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6;margin-bottom:20px;padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px'
    ul.appendChild(li)
  } else {
    answers.map(answer => {
      let li = document.createElement('li')
      let commentText = answer.commentElement.childNodes[3].innerText;
      if (commentText.length > 120) {
        li.appendChild(document.createTextNode(`Comment is too long to display ${answer.symbol} ${answer.n}`))
      } else {
        li.appendChild(document.createTextNode(`${answer.commentElement.childNodes[3].innerText}`))
      }
      li.onclick = () => scrollToAnswer(answer.commentElement)
      li.style = 'font-size:20px;cursor:pointer;color:#3c763d;background-color:#dff0d8;border-color:#d6e9c6;margin-bottom:20px;padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px'
      ul.appendChild(li)
    })
  }


  mainDiv.appendChild(ul)

  container.insertBefore(mainDiv, document.querySelector('.repository-content '))
}

function removeAnswerAlert() {
  if (!!document.querySelectorAll('.possibleAnswer')) {
    Array.from(document.querySelectorAll('.possibleAnswer')).map(e => e.remove())
  }
}
// Wrapping in a function to not leak/modify variables if the script
// was already inserted before.
(function () {
  if (window.hasRun === true) {
    chrome.runtime.onMessage.addListener(function (isIssue, sender, sendResponse) {
      debugger;
      if (isIssue && !!document.querySelector('.js-discussion')) {
        findAnswers() // find possible answers
      }
    });
  }
  else {
    window.hasRun = true;
    findAnswers() // find possible answers
  }
})(); // <-- Invoke function. The return value is passed back to executeScript

