// @ts-check
let canvas = null
let ctx = null
let GoL = null
let x_grid_w = null
let y_grid_h = null;
let grid_ratio = 2
let pause = false
let proghue = true
let i = 0


window.addEventListener("load", ()=>{
    canvas = document.querySelector("canvas")
    ctx = canvas.getContext("2d")
    x_grid_w = Math.floor(canvas.width/grid_ratio)
    y_grid_h = Math.floor(canvas.height/grid_ratio)
    GoL = new GoLmodel(x_grid_w,x_grid_w)
    tick()
})

window.addEventListener("keydown",(event)=>{
    if(event.keyCode == 8){
        console.log('allo')
        pause = true
        setTimeout(()=>{pause = false},10000)
    }

    else if(event.keyCode == 73){
        proghue = !proghue
    }

    else if(event.keyCode == 39){
        x_grid_w = Math.floor(canvas.width/grid_ratio)
        y_grid_h = Math.floor(canvas.height/grid_ratio)
        GoL.nextRule()
    }

})

const tick = () =>{

    if(!pause){
        let newTiles = GoL.tick()
        ctx.clearRect(0,0,canvas.width,canvas.height)
        let cpt = 0
        for(let y = 0; y < y_grid_h; y++ ){
            for(let x = 0; x < x_grid_w; x++){
                if (newTiles[cpt] >0) {
                    let starthue = proghue?i:GoL.sh
                    let hue = (starthue - (newTiles[cpt] * GoL.rg))%360
                    ctx.fillStyle = 'hsl( '+ hue +',100%,50%)'
                }
                else{
                    ctx.fillStyle = "#000000"
                }
                ctx.fillRect(x*grid_ratio,y*grid_ratio,grid_ratio,grid_ratio)
                cpt++
            }
        }
    }
    i +=0.5
    setTimeout(() =>{window.requestAnimationFrame(tick)}, GoL.sp)
    
}


