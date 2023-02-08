
let global ={
    lastTime: 0,
    gameTime: 0,
}


let Constants={
    keydown:{},
}

function startGame(){
    Game.start();
    setupy();
}



let Game ={
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width=512;
        this.canvas.height=512;
        this.context=this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(update(), 250);
        this.inGame=true;
    },
    

    clear: function(){
        
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        
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

addEventListener("keyDown",function(e){
    Constants.keysDown[e.keyCode]=true;

},false)
addEventListener("keyUp",function(e){
    delete Constants.keysDown[e.keyCode];

},false)
































let x=0;


function update(){
    Game.context.beginPath();
    Game.context.arc(x,75,50,0,2*Math.PI);
    x++;
    Game.context.stroke();
    if(x>=412){
        x=0;
    }
}