var app = {
      METHOD: "POST",
init: function(ev){
    //called after DOMContentLoaded/device ready

    

    
    document.querySelector(".fab").addEventListener("click", app.navigate);

    document.querySelector(".xbtn").addEventListener("click", app.navigate );
        document.querySelector(".xbtn").addEventListener("click", app.fetchList);
    
    document.querySelector(".check").addEventListener("click", app.upload);
        
    document.querySelector(".camera").addEventListener("click", app.takePic ); 
    
    document.querySelector(".back").addEventListener("click", app.navigate ); 

    //get list of things for the homepage 
         // add page
    app.fetchList();

  },
    
    
	
	
	 upload: function(ev){

        ev.preventDefault();
        //get the list of the review for a specific UUID from edumedia
        var xhr = new XMLHttpRequest();
         
         		      

         
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/review/set/");
		
		 
        xhr.addEventListener("load", app.gotResponse)
                                  
        
             
        var params = new FormData(); 
        params.append("img" , encodedData);
        params.append("uuid", "shannon");
        params.append("title",document.getElementById("title").value);
        params.append("review_txt", document.getElementById("review").value);
        params.append("rating", document.querySelector('input[type="radio"]:checked').value);
        params.append('action', 'insert');
        xhr.send(params);

         
        xhr.addEventListener("error", app.badStuffHappened);
        
    },
	
	
	
	
	
    fetchList: function () {
        
        
        //prepare the XML HTTP Request
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/reviews/get/");
        xhr.addEventListener("load", app.gotList);
        xhr.addEventListener("error", app.badStuffHappened);
        
        //collect data to send to the php page
        var params = new FormData();
        
        params.append("uuid", "shannon");
        
        
        
    
        //send the request
        xhr.send(params);
            
      
        
    },
    
    

     gotList: function(ev){

    //when the list comes back from the server 
        var data = JSON.parse(ev.target.responseText);
//                console.log(data);

    if(data.code == 0) {
        var msg = document.getElementById("msg");
        var ul = document.createElement("ul");
        var numReviews = data.reviews.length;
        if(numReviews>0 ){
            msg.appendChild(ul);
            for (var i=0; i<numReviews; i++) {
               var li = document.createElement("li");
                li.innerHTML = '<h4 data-href=details>' + data.reviews[i].title + '</h4>';
                li.innerHTML += '<span id=' + data.reviews[i].id + '</span>';
                for(b=0; b<data.reviews[i].rating; b++){
                   
                li.innerHTML += '<span class="Stars">\u2605</span>'; 
                    

                }

                li.id = data.reviews[i].id;

                
                li.addEventListener("click" , app.navigate);
                li.addEventListener("click", app.fetchSingleList);
                
                ul.appendChild(li);
            }


        } else {
            msg.innerHTML = "no reviews for you";
            
        }
    
} else {
    //bad things happend
    // use the same function over and overafor any warning 
    app.gotAWarning(data.code, data.message);
}
    
},
        gotResponse: function(ev){
        var data = JSON.parse(ev.target.responseText);
        if(data.code == 0){
            //good to go
            document.querySelector("#msg").textContent = "Response From Server:"

        }else{
            app.gotAWarning(data.code, data.message);
        }
    },
    
    
        gotAWarning: function(code, msg){ 
        //this gets called if there was a response but the code was not zero.
        document.querySelector("#msg").textContent = "WARNING " + code + ":: " + msg;
        console.log("WARNING " + code + ":: " + msg);
//        document.querySelector("#user-id").textContent = "";
//        document.querySelector("#user-name").textContent = "";
    },
    
    
    
    
       badStuffHappened: function(ev){
        //this gets called for actual errors
        document.querySelector("#msg").textContent = "ERROR " + ev.message;
        document.querySelector("#user-id").textContent = "";
        document.querySelector("#user-name").textContent = "";
    }, 
    
    
  fetchSingleList: function (ev) {
    
     var id = (ev.currentTarget.id);
      
      
            var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/review/get/");
        xhr.addEventListener("load", app.printList);
        xhr.addEventListener("error", app.badStuffHappened);
        
        //collect data to send to the php page
        var params = new FormData();
        
        params.append("uuid", "shannon");
        params.append("review_id", id );
        
        
        //feedback to user
       // document.querySelector("#msg").textContent = "Request Sent.";
                
        //send the request
        xhr.send(params);
      
      
  },  
   

    printList: function(ev) {
        
        var singleReview = JSON.parse(ev.target.responseText);
        
        console.log(singleReview);
      
        var oneReview = document.getElementById("oneReview");
        
         var listedTitle = document.createElement("li");
         listedTitle.textContent= singleReview.review_details.title;
             oneReview.appendChild(listedTitle); 
        
        var listedReview = document.createElement("li");
              listedReview.textContent = singleReview.review_details.review_txt;
            oneReview.appendChild(listedReview); 

             var listedStars = document.createElement("li");
        
                var numberOfStars = singleReview.review_details.rating;
        
            app.addStars(numberOfStars, oneReview, listedStars);
             
             var listedImage = document.createElement("li");
              listedImage.innerHTML = '<img src=' + decodeURIComponent(singleReview.review_details.img) + '>';
             oneReview.appendChild(listedImage);
             
                     
        
    },
    
    
    addStars: function (numberOfStars, ul, li) {
                
            for(i=0; i<numberOfStars; i++){
                   
               li.innerHTML += '<span class="reviewStars">\u2605</span>'; 

                    // data.reviews[i].rating;
                }  
        
            ul.appendChild(li);
        
    },
    
    
    
takePic: function(ev){
    ev.preventDefault();
    var cameraOptions = {
  quality : 75,
  destinationType: Camera.DestinationType.DATA_URI,
  sourceType: Camera.PictureSourceType.CAMERA,
  allowEdit : true,
  encodingType : Camera.EncodingType.JPEG,
  mediaType: Camera.MediaType.PICTURE,
  targetWidth : 100,
  targetHeight : 100,
  cameraDirection : Camera.Direction.FRONT,
  saveToPhotoAlbum : true
    };
    navigator.camera.getPicture(app.cameraSuccess, app.cameraError, cameraOptions);
},
    cameraSuccess: function (imageData){
        var image = document.getElementById("myImage");
        var realData = "data:image/jpeg;base64," + imageData; 
        image.src = realData;
        encodedData = encodeURIComponent(realData);
    
        
    },
    cameraError: function(message){
        alert("error");
    },

  navigate: function(ev){
    ev.preventDefault();
    var url = ev.target.getAttribute("data-href"); //home or add or details
    history.pushState({"page":url}, null, "#" + url);
    [].forEach.call(document.querySelectorAll("[data-role=page]"), function(item, index){
      //this function runs once for each[data-role]
      
      item.classList.remove("active-page");
      if (item.id == url ){
        item.classList.add("active-page");
        
      }
    });
    
  }
};
 
function init() {
    
    document.addEventListener("deviceready", app.init);
    
}


document.addEventListener("DOMContentLoaded", init);
///deviceready
//References
//http://codepen.io/Wils0751/pen/vGZvRY
