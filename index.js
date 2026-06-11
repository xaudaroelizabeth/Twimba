import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let copyTweetsData = tweetsData

function save(){
    const strData = JSON.stringify(copyTweetsData)
    localStorage.setItem('tweets' , strData)
}

function load(){
    const strData= localStorage.getItem('tweets')
    
     if (strData) {
       let tweetsDataLocal = JSON.parse(strData)
        copyTweetsData= tweetsDataLocal
    } else {
        console.log("No tweets data in localStorage.")
    }  
}
load()

document.addEventListener('click', function(e){
    
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.delete){
        handleTweetDelete(e.target.dataset.delete)
    }
     else if (e.target.dataset.addcomment){
        handleTweetComment(e.target.dataset.addcomment)
        
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = copyTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render() 
}

function handleRetweetClick(tweetId){
    const targetTweetObj = copyTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        copyTweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

function handleTweetDelete(deleteId){
    
    const indexDelete = copyTweetsData.findIndex(function(deleteObj){
        return deleteObj.uuid === deleteId
    })
    
    const tweetObj = copyTweetsData[indexDelete]
    
    if (tweetObj.handle === `@Scrimba`){
        copyTweetsData.splice(indexDelete,1)
        render()
        
    }else{
        alert("You do not have access to alter this tweet.")
    }
}

function handleTweetComment(tweetId){
    const comment =document.getElementById(`addcomment-${tweetId}`).value
    const newComment= {
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: comment,
    }
    
    const targetTweetObj = copyTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    targetTweetObj.replies.push(newComment)
    render()
    handleReplyClick(tweetId)
}

function getFeedHtml(){
    let feedHtml = ``
    
    copyTweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner" >
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class= "tweetHeader">
                <p class="handle">${tweet.handle}</p>
                <span class="tweet-detail">
                        <i class="fa-solid fa-trash"
                        data-delete="${tweet.uuid}"
                        ></i>
                    </span>
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
       <div class="tweet-reply send-icon"> 
        <input id="addcomment-${tweet.uuid}" placeholder="Write a comment..."></input>
        <i class="fa-solid fa-paper-plane" data-addcomment="${tweet.uuid}"></i>
       </div>
    </div>  
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    save()
}
render()

