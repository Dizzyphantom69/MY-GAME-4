const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var balloon,balloonImage1,balloonImage2;
var bird1 , bird1Image ;
var stoneSprite , stoneImg;
var bbImg ;
var c1 , c2 , c3 , c4 , c5 ;
var resetImage;
var score = 0 , bonus = 0;
var live = 3 ;
var gameState = "prestart";
var endImg;


function preload(){
  bgImg =loadImage("skyee.png");
  balloonImage1=loadImage("Balloon.png");

  platformImage = loadImage("base.png");
  sling1 = loadImage("sling1.png");
  sling2 = loadImage("sling2.png");
  sling3 = loadImage("sling3.png");
  bird1Image = loadAnimation("bird1.png","bird2.png","bird3.png","bird4.png");
  stoneImg = loadImage("stone.png")   
  
  endImg = loadImage("gameOver.jpg");
  bbImg = loadAnimation("bb1.png","bb2.png","bb3.png","bb4.png");
  c1 = loadImage("C1.png");
  c2 = loadImage("C2.png");
  c3 = loadImage("C3.png");
  c4 = loadImage("C4.png");
  c5 = loadImage("C5.png");
  resetImage = loadImage("reset.png");
}
  

//Function to set initial environment
function setup() {
 
  createCanvas(600,500);
  engine = Engine.create();
  world = engine.world;


  bg = createSprite(850,150);  
  bg.addImage(bgImg);
  bg.scale = 4;
  bg.velocityX = -2;

  balloon=createSprite(150,250,150,150);
  balloon.addAnimation("hotAirBalloon",balloonImage1);
  balloon.scale=0.4;

  stone = new Stone(balloon.x+60,balloon.y+50,10);

  stoneSprite = createSprite(stone.body.position.x,stone.body.position.y,10,10);
  stoneSprite.addImage(stoneImg);
  stoneSprite.scale = 0.03;

  //balloon.debug = true ;
  balloon.setCollider("rectangle",50,-20,350,550);

  resetb = createSprite(300,250);
  resetb.addImage(resetImage);
  resetb.scale = 0.05 ;
  resetb.visible = false ;

  sling= new Sling(stone.body,{x:balloon.x+65,y:balloon.y+40})
  bgroup = new Group();
  cg = new Group();
  Engine.run(engine);
}

// function to display UI
function draw() {
  background("#C3E6F5");

  if(gameState=== "prestart"){
    textSize(12);
    text("THE CONTROLS ARE : ",100,100);
    text("W TO MOVE UPWARDS ",100,150);
    text("S TO MOVE DOWNWARDS ",100,200);
    text("USE THE MOUSE TO SHOOT THE BIRDS BY DRAGGING STONE AND GAIN BONUS ",100,250);
    text("PRESS SPACE TO REATTACH THE STONE TO THE SLING ",100 ,300);
    text("OBJECTIVE: TRY AND SURVIVE AS LONG AS YOU CAN ",100,350);
    text("PRESS S TO START THE GAME ",100,400);
    if(keyDown("s")){
      gameState= "start";
    } 
  }
  
  else if(gameState==="start"){
  if(bg.x<-1250){
    bg.x = -420
  }
  //spawnClouds();
  stoneSprite.x = stone.body.position.x;
  stoneSprite.y = stone.body.position.y;

  sling.pointB.x=balloon.x+65;
  sling.pointB.y=balloon.y+40
   
  score += Math.round(frameCount/180);

  if(stoneSprite.isTouching(bgroup)){
    bgroup.destroyEach();
    bonus += 1 ;
  }
  if(bonus%10===0 && bonus>0){
    live +=1 ;

  }
  if(bgroup.isTouching(balloon)){
    live -= 1;
    bgroup.destroyEach();
  }
  if(live<=0){
    gameState = "end";

  }
  if(keyDown("w")){
    balloon.y -= 10 ;
  }
  if(keyDown("s")){
    balloon.y += 10;
  }
  spawnObstacles();

  drawSprites();
  image(platformImage,balloon.x+22,balloon.y+90,80,8);
  image(sling1,balloon.x+60,balloon.y+40,20,50); 
  //stone.display()
  image(sling2,balloon.x+50,balloon.y+40,20,30);
  sling.display();
  }
  else if(gameState==="end"){
    background(endImg);
   
    fill("red");
    textSize(20);
    text("PRESS R TO RESTART",200,480);
   
    if(keyDown("r")){
      reset();
    }
    
  }
  textSize(20);
  text("LIFE: "+live,100,50);
  text(" Bonus: "+bonus,450,50);
  text(" Score "+score,250,50);
}

  function spawnObstacles(){
    if(frameCount%150===0){
      bird1 = createSprite(850,Math.round(random(100,400)),50,50);
      var bb = Math.round(random(1,2));
      switch(bb){
        case 1: bird1.addAnimation("bird",bird1Image);
                break;
        case 2 : bird1.addAnimation("bird2",bbImg); 
                 bird1.scale = 0.4; 
                break;        
      }
      
      bird1.velocityX = -5 ;
      bird1.lifetime =  190;
      bird1.depth=balloon.depth-1;
      bgroup.add(bird1);
    }


  }
function mouseDragged(){
    //if (gameState!=="launched"){
        Matter.Body.setPosition(stone.body, {x: mouseX , y: mouseY});
    //}
}
  
function mouseReleased(){
    sling.fly();
    //gameState = "launched";
}

function keyPressed(){
    if(keyCode === 32){
       //bird.trajectory = [];
       Matter.Body.setPosition(stone.body, {x: balloon.x+65, y: balloon.y+50}); 
       sling.attach(stone.body);
    }
}
function spawnClouds(){
  if(frameCount%250 === 0){
    cloud = createSprite(700,Math.round(random(75,400)),50,50);
    var cc = Math.round(random(1,5));
    switch(cc){
      case 1 : cloud.addImage(c1);
               break;
      case 2 : cloud.addImage(c2);
               break;
      case 3 : cloud.addImage(c3);
               break;  
      case 4 : cloud.addImage(c4);
               break; 
      case 5 : cloud.addImage(c5);
               break;      
    }
    cloud.velocityX = -2 ;
    cloud.lifetime = 400 ;
    cloud.depth = bird1.depth - 1 ;
    cg.add(cloud);
  }


}
function reset(){
  
  gameState= "start";
  score = 0 ;
  live = 3 ;
  bonus = 0;
  resetb.visible = false;
}
  