/*var arrOfImages =[];
var startIndex =-1;
var endIndex = -1;
var currentHover = -1;
$(document).ready(function(){
  getListOfTasks();

});

function getListOfTasks(){
  $(".main-layout").children().hide();
  $.ajax({
    url:"http://localhost:3000/api/v1/tasks",
    success: function(data){
      var sampleDiv = "";
      data.forEach(function(val){
        sampleDiv+= '<div class="task" id="taskId_'+val+'" onclick="clickHandlerTask(this)">'+val+'</div>';
      });
      $("#taskParent").html("");
      $("#taskParent").append(sampleDiv);
    },
    error: function(data){
    }

  });
}

function clickHandlerTask(elm){
  arrOfImages =[];
  startIndex =-1;
  endIndex = -1;
  $(".main-layout").children().remove();
  var id = $(elm).attr('id').split("taskId_")[1];
  $.ajax({
    url:"http://localhost:3000/api/v1/task?id="+id+"",
    success: function(data){

        $(".main-layout").append("<div id='childLayout_"+id+"'></div>");
        $(".main-layout").append("<div style='height:30px;width:60px;' id="+id+">Submit</div>");
        $("#"+id).click(function(){
          makePostCall(id);
        });

      var imageDivs ="";
      data.forEach(function(val,index){
        val = "."+val;
        imageDivs+= "<img class='imageContainer' id = 'image_"+index+"' src='"+val+"'/>";
      });
      $("#childLayout_"+id).append(imageDivs);
      setImageHeightWidthRatio(16,9);
      $(".imageContainer").click(function(elm){
        if(startIndex ==-1){
          startIndex = $(this);
          currentHover = startIndex;
          $(startIndex).addClass("hoverEffect");
          $("img").hover(function(e) {
            if($(e.target).is($(currentHover).prev()) || $(e.target).is($(currentHover).next())){
              currentHover = $(e.target);
              $(this).addClass("hoverEffect");
            }
          });
        } else {
          $("img").unbind('mouseenter mouseleave');
          $(".hoverEffect").removeClass("hoverEffect");
          endIndex =  $(this);
          var current = startIndex;
          var subArrOfImage = [];
          if(parseInt($(startIndex).attr("id").split("image_")[1], 10) < parseInt($(endIndex).attr("id").split("image_")[1], 10)){
            while(! current.is(endIndex)){
              subArrOfImage.push($(current).attr("src"));
              $(current).addClass("highlightedImage");
              current = $(current).next();
            }
            $(endIndex).addClass("highlightedImage");
            subArrOfImage.push($(endIndex).attr("src"));
          } else {
            while(! current.is(endIndex)){
              subArrOfImage.push($(current).attr("src"));
              $(current).addClass("highlightedImage");
              current = $(current).prev();
            }
            $(endIndex).addClass("highlightedImage");
            subArrOfImage.push($(endIndex).attr("src"));
          }
          startIndex = -1;
          endIndex =-1;
          arrOfImages.push(subArrOfImage);
        }
      })
    },
    error: function(data){
    }

  });
}

function makePostCall(id){
  $.ajax({
    url:"http://localhost:3000/api/v1/task",
    type:'post',
    data:{
      data:arrOfImages
    },
    success: function(data){
      alert("Submited Succesfully !!");
    },
    error: function(data){
    }

  });
}

$(document).click(function(event) {
  if(startIndex != -1 && ! $(event.target).is('img')) {
    $(".hoverEffect").removeClass("hoverEffect");
    $("img").unbind('mouseenter mouseleave');
    startIndex = -1;
  }
})

function setImageHeightWidthRatio(width,height){
  $(".imageContainer").css("width",width*7);
  $(".imageContainer").css("height",height*7);

}*/
/*class Task {
	constructor(){
		this.startIndex = null;
		this.endIndex = null;
		this.taskArr = [];
		this.getTasksList().then((value) => {
				let arr = JSON.parse(value.replace(/'/g, '"'));
				let taskList = ""; 
				arr.forEach((val) => {
					taskList = taskList + this.taskTemplate(val);
				});
				document.getElementById("taskParent").innerHTML = taskList;
				let taskArr = document.getElementsByClassName("task");
				for(let i = 0;i < taskArr.length ;++i){
					taskArr[i].addEventListener('click',(elm) => {
						this.clickHandlerTask(taskArr[i].innerText);
					})
				};
				document.getElementById("submitNow").addEventListener('click',(elm) => {
				this.makePostCall();
			});
		});
		
	}			
	taskTemplate(val) {	
		return `<div class="task" id="taskId_${val}" >${val}</div>`;
	}		
	getTasksList() {
		
		return new Promise((resolve,reject) => {
				const HTTP = new XMLHttpRequest();
				HTTP.open("GET","http://localhost:3000/api/v1/tasks");
				HTTP.send();
				HTTP.onreadystatechange = (e) => {
					if (HTTP.readyState == 4 && HTTP.status == 200) {
						resolve(HTTP.responseText);
					}	
				}
		}); 
	}	
	clickHandlerTask(taskId) {
		this.getImageListForTheTask(taskId).then((response) => {
			var imageDivs ="";
			response = JSON.parse(response.replace(/'/g, '"'));
			response.forEach(function(val,index){
				val = "."+val;
				imageDivs+= `<img class='imageContainer' id = 'image_${index}' src='${val}'/>`;
			});
			document.getElementById("childLayout").innerHTML = imageDivs;
			let imageElements = document.getElementsByClassName("imageContainer")
			for(let i = 0;i < imageElements.length ;++i){
				imageElements[i].addEventListener('click',(elm) => {
					this.imageHandler(imageElements[i]);
				})
			};
		});
	}
	imageHandler(elm){
		if(this.startIndex == null) {
			this.startIndex = elm;
		} else {
			this.endIndex = elm;
			let tempNode = this.startIndex;
			while(!tempNode.isSameNode(this.endIndex)){
				this.taskArr.push(tempNode.getAttribute("src"));
				tempNode = tempNode.nextSibling;
			}	
			this.startIndex = null;
			this.endIndex = null;
		}	
	}	
	getImageListForTheTask(taskId) {
		return new Promise((resolve,reject) => {
				const HTTP = new XMLHttpRequest();
				HTTP.open("GET",`http://localhost:3000/api/v1/task?id=${taskId}`);
				HTTP.send();
				HTTP.onreadystatechange = (e) => {
					if (HTTP.readyState == 4 && HTTP.status == 200) {
						resolve(HTTP.responseText);
					}	
				}
		});
	}	
	makePostCall(){
		const HTTP = new XMLHttpRequest();
		HTTP.open("POST","http://localhost:3000/api/v1/task");
		HTTP.send();
		HTTP.onreadystatechange = (e) => {
			if (HTTP.readyState == 4 && HTTP.status == 200) {
				console.log("Posted");
				this.taskArr = [];
			}	
		}
	}	
		
}	
var newTask = new Task();*/

class TaskApp {
	constructor(){
		this.taskList =[];
		this.getTasksList().then((value) => {
				let arr = JSON.parse(value.replace(/'/g, '"')); 
				var documentFragment = document.createDocumentFragment();

				arr.forEach((val) => {
					var taskComponent = document.createElement('task-component');
					taskComponent.id = `taskId_${val}`;
					taskComponent.setMessage(val);
					documentFragment.appendChild(taskComponent);
					this.taskList = taskComponent.taskArr;
				});
				document.getElementById("taskParent").appendChild(documentFragment);

		});	
	}	
	getTasksList() {
		return new Promise((resolve,reject) => {
				const HTTP = new XMLHttpRequest();
				HTTP.open("GET","http://localhost:3000/api/v1/tasks");
				HTTP.send();
				HTTP.onreadystatechange = (e) => {
					if (HTTP.readyState == 4 && HTTP.status == 200) {
						resolve(HTTP.responseText);
					}	
				}
		}); 
	}	
	
}	

class Task extends HTMLElement {
	createdCallback() {
		this.innerHTML = `<div class="task" ></div>`;
		this.taskComponent = this.querySelector('.task');
		this.taskComponent.addEventListener('click', () => this.clickHandlerTask(this.taskComponent.textContent));
		this.startIndex = null;
		this.endIndex = null;
		this.taskArr = [];
		document.getElementById("submitNow").addEventListener('click',{
			handleEvent:this.makePostCall,
			taskComponent:this
		});
	}
			
	setMessage(val){
		this.taskComponent.textContent = val;
	}	
	clickHandlerTask(taskId) {
		var taskScope = this;
		this.getImageListForTheTask(taskId).then((response) => {
			document.getElementById("childLayout").innerHTML = "";
			response = JSON.parse(response.replace(/'/g, '"'));
			var documentFragment = document.createDocumentFragment();

			response.forEach((val,index) => {
				var imageComp = document.createElement('image-component');
				imageComp.id = `image_${index}`;
				imageComp.setSource("."+val);
				documentFragment.appendChild(imageComp);
				imageComp.addEventListener("click", { 
					handleEvent:this.imageHandler,
					taskScope:this
				}, false);

			});
			document.getElementById("childLayout").appendChild(documentFragment);
		});
	}
	imageHandler(e){
		if(this.taskScope.startIndex == null) {
			this.taskScope.startIndex = e.currentTarget;
		} else {
			this.taskScope.endIndex = e.currentTarget;
			let tempNode = this.taskScope.startIndex;
			while(!tempNode.isSameNode(this.taskScope.endIndex)){
				this.taskScope.taskArr.push(tempNode.getElementsByTagName("img")[0].getAttribute("src"));
				tempNode = tempNode.nextElementSibling;
			}	
			console.log(this.taskScope.taskArr)
			this.taskScope.startIndex = null;
			this.taskScope.endIndex = null;
		}
	
	}	
	getImageListForTheTask(taskId) {
		return new Promise((resolve,reject) => {
				const HTTP = new XMLHttpRequest();
				HTTP.open("GET",`http://localhost:3000/api/v1/task?id=${taskId}`);
				HTTP.send();
				HTTP.onreadystatechange = (e) => {
					if (HTTP.readyState == 4 && HTTP.status == 200) {
						resolve(HTTP.responseText);
					}	
				}
		});
	}	
	makePostCall(){
		const HTTP = new XMLHttpRequest();
		HTTP.open("POST","http://localhost:3000/api/v1/task");
		HTTP.send();
		HTTP.onreadystatechange = (e) => {
			if (HTTP.readyState == 4 && HTTP.status == 200) {
				console.log("Posted");
				this.taskArr = [];
			}	
		}
	}	
			
}	
class Images extends HTMLElement {
	createdCallback() {
		this.innerHTML = `<img class='imageContainer' />`
		this.imageComp = this.querySelector('.imageContainer');
	}
	setSource(val){
		this.imageComp.setAttribute("src",val);
	}	
}	
document.registerElement('task-component', Task);
document.registerElement('image-component', Images);
var newTaskApp = new TaskApp();
