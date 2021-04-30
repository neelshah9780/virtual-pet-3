var database;
var dog,dogImage,dogImage1,food,foodImage,foodStock,foodRef;
var feed;
var fedTime,lastFed,foodRem;
var foodObj;
var namebox;
var value;
var milkimg,milkbottle;
var bedroom, garden,washroom, sadDog;
var readState;
var currentTime;
function preload()
{
  dogimage = loadImage("dogImg.png");
  dogimage2 = loadImage("happy dog.png");
  milkimg = loadImage("Milk.png");
  bedroom = loadImage("Bed Room.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
  sadDog=loadImage("Lazy.png")

}

function setup() {
  createCanvas(600, 600);
  foodObj=new Food();
  database = firebase.database();
  readState=database.ref('gameState')
  readState.on('value',function(data){
    gameState=data.val();
  })
  dog = createSprite(520,300);
  dog.addImage(dogimage);
  dog.scale = 0.2;



  feed = createButton("Feed your dog");
  feed.position(700,100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(830,100);
  addFood.mousePressed(addFoods);
  
  namebox = createInput('Name')//.attribute('placeholder','Your pet name');
  namebox.position(450,100)

  milkbottle = createSprite(460,320)
  milkbottle.addImage(milkimg)
  milkbottle.visible = 0;
  milkbottle.scale = 0.1
}


function draw() {  
  background(46, 139, 87);
  drawSprites();
  value = namebox.value();
  console.log(value)
  foodObj.display();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill("white");
  textSize(15);
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    updateState("Playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    updateState("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    updateState("Batthing");
    foodObj.washroom();
  }else{
    // dog.addImage(sadDog);

    updateState("hungry");
    foodObj.display()
    fill(4,23,117)
    textSize(20)
    text(value,480,dog.y-80)
  }
  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    namebox.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
  }
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",350,30);
   }else{
     text("Last Fed : "+ lastFed + " AM", 350,30);
   }
  
}
function feedDog()
{
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    dog.addImage(dogimage);
  }
  else{
    dog.addImage(dogimage2);
    if(foodObj.foodStock===1 )
    {
        milkbottle.visible=0;
        dog.addImage(dogimage);
    }
    else
    milkbottle.visible = 1;

    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}
function addFoods()
{
  
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}
function updateState(state){
  database.ref('/').update({
    gameState:state
  })
}