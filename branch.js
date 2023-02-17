let global ={
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    sprites: [],
    pool: [],
    score:0,
    updateClock:0,
    layers:{},
}


let Constants={
    maxSlice:45,
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}

/*
class logicBlock{
    constructor(){

    }
}
*/
class Circle{
   
    constructor(x,y, diamater, color){
        this.x=x;
        this.y=y;
        this.diamater=diamater;
        this.width=diamater;
        this.color = color;
        this.drawSprite=true;
        
    }
    draw(){
        if(this.drawSprite){
            Game.context.beginPath();
            Game.context.arc(this.x,this.y,this.diamater/2,0,2*Math.PI);
            Game.context.fillStyle = this.color;
            Game.context.fill();
            Game.context.stroke();
        }
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
    }

    selfDestruct(){
        try {
            global.sprites.splice(global.sprites.indexOf(this),1);
        } catch (error) {
            return (false,"spritelist error");
        }
  
    }

    drawToggle(toggle){
        this.draw=toggle;
    }
    update(){
        this.draw();
        
    }
}

class Rectangle{
   
    constructor(x,y, width, height, color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color = color;
        this.drawSprite=true;
    }
    draw(){
        if(this.drawSprite){


            Game.context.beginPath();
            Game.context.fillStyle = this.color;
            Game.context.fillRect(this.x,this.y,this.width,this.height);
            Game.context.stroke();
        }
        
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
    }

    drawToggle(toggle){
        this.drawSprite=toggle;
    }

    selfDestruct(){
        try {
            global.sprites.splice(global.sprites.indexOf(this),1);
        } catch (error) {
            return false;
        }
        
    }

    update(){
            /*

            if(65 in global.keysDown){
            
               
            }
        
      
            if(68 in global.keysDown){
            
               
            }
            */
        this.draw();
    }
}



/*
function circleMaker(){
    
    const width=randint(10,Constants.maxCircleSize);
    let r=0;
    let g=0;
    let b=0;
    while(true){
        r=randint(0,255);
        g=randint(0,255);
        b=randint(0,255);
        if(!((r>g+60||r<g-60)&&(r>b+60||r<b-60)&&(b>g+60||b<g-60))){
            break;
        }
    }
    const color='rgb('+r+','+g+','+b+')';
    let circle=new Circle(randint(width/2,512-(width/2)),(width/2),width,color,Constants.fallSpeed);
    global.sprites.push(circle);
    global.pool.push(circle);
    
}
*/




function startGame(){
    Game.start();
    setupy();
   
   
}

function rectCollision(rect1, rect2){
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
    ) 
      
}

function circleCollision(circle1, circle2){
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return (distance < (circle1.diamater/2) + (circle2.diamater/2));
}

function differentColiderCollision(rect,circle){
    const distX = Math.abs(circle.x - rect.x-rect.width/2);
    const distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.diamater/2)) { return false; }
    if (distY > (rect.height/2 + circle.diamater/2)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    const dx=distX-rect.width/2;
    const dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=((circle.diamater/2)*(circle.diamater/2)));
}


let Game ={
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width=512;
        this.canvas.height=512;
        this.context=this.canvas.getContext("2d");
        this.canvas.style.cssText='border: 2px solid black;';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(update(), 250);
        this.inGame=true;
    },
   

    clear: function(){
       
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
       
    },
    
    addText:function(string, x, y, size, color){
        this.context.font = size+"px Arial";
        this.context.fillStyle= color;
        return this.context.fillText(string, x, y);
    },



}

function setupy(){
        let now=Date.now();
        let dt=(now-global.lastTime)/1000.0;
        Game.clear();
        update();
       
        global.gameTime=dt;
        global.lastTime=now;
        requestAnimFrame(setupy);
        return global.gameTime;

}

let requestAnimFrame = (function(){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame||
        window.mozRequestAnimationFrame||
        function(callback){
            window.setTimeout(callback, 1000/60);
        }
})()

addEventListener("keydown",function(e){
    global.keysDown[e.keyCode]=true;

},false);
addEventListener("keyup",function(e){
    delete global.keysDown[e.keyCode];

},false);















function updateSprites(){
    if(global.sprites.length > 0){
        for(let i=0; i<global.sprites.length; i++){
            global.sprites[i].update();
        }
    }
}










// if 32 in global.keysDown do something

//impliment sprite block space invaders movement

class Invader extends Rectangle{
    constructor(x,y){
        super(x,y,10,10,'black');
        this.direction=this.width+4;
    }
    
}


function makeSlice(invaderCount, startX,startY, sliceName){
    let slice=[];
    let width=4;
    let x=startX;
    for(let i=0; i<invaderCount; i++){
        let invader=new Invader(startX,startY);
        global.sprites.push(invader);
        slice.push(invader);
        startX+=14;
        width+=14;
    }
    global.layers[sliceName]=(slice,width,x);
}



function sliceLogic(){
    let masterWidth=0;
    let keys=Object.keys(global.layers);
    let masterX=global.layers[keys[0]][2];
    for(let i=0; i<keys.length; i++){
        if(global.layers[keys[i]][1]>masterWidth){
            masterWidth=global.layers[keys[i]][1]; 
        }
        if(global.layers[keys[i]][2]<masterX){
            masterX=global.layers[keys[i]][2];
        }
        
    }
    if(){
        for(let i=0; i<keys.length; i++){
            for(let j=0; j<global.layers[keys[i]][0].length; j++){
                global.layers[keys[i]][0][j].move(0,14);
                global.layers[keys[i]][0][j].direction=
            }
        }
    }
    for(let i=0; i<keys.length; i++){
        for(let j=0; j<global.layers[keys[i]].length; j++){
            global.layers[keys[i]][j].move(global.layers[keys[i]][j].direction,0);
        }
    }
    

}
makeSlice(10,0,0,"axolittle"); 

sliceLogic();

function update(){
    
    updateSprites();
    //draw rect here
   
    
    if(global.updateClock>=20){
        global.updateClock=0;
        sliceLogic();
        
        
    }
    global.updateClock++;



}

