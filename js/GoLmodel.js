// @ts-check
class GoLmodel{

    //largely inspired from Mirek's celebration of GoL : http://psoup.math.wisc.edu/mcell/rullex_life.html
    // This is an implementation of Weighted Life (enhanced game of life). The code is mine (but inspired from an old java version from the website), but the concepts and rules are not
    constructor(width, height){
        this.width = width
        this.height = height
        this.oldUniverse = []
        this.newUniverse = []

        //pc = percentage
        this.pc = 30
        
        this.hi= 0 //nb of states, 0 = no history by default

        this.sh = Math.floor(Math.random()*360) //SH = start hue
        this.rg = 20 //hue increment by generation

        //+ for Birth, - for Survive
        this.rule = [] 
        //nb weights, all 1 by default (regular GoL)
        this.nw = 1
        this.nn = 1
        this.ne = 1
        this.ww = 1
        this.ce = 0 
        this.ee = 1
        this.sw = 1
        this.ss = 1
        this.se = 1


        this.sp = 5//speed in ms
        this.weightRegex = /^[nsewchiprg]{2}\d+/
        this.ruleRegex = /^[bs]\d+/

        //wanted to keep rules in some txt or json file, but its an ordeal so its all kept here instead
        this.stringRules = new Map()

        //init functions
        this.fillWithRules()
        this.setRandRule()
        // this.readGoLargs(this.stringRules.get(''))
        this.fillRandom()
    }

    readGoLargs(a){
        this.rule = []
        let params = a.toLowerCase().split(' ')
        params.forEach(p => {
            if(p.match(this.weightRegex)){

                //not recommended security-wise but im lazy, also security is irrelevant for school project
                eval("this."+p.slice(0,2)+"="+p.slice(2)) 
            }
            else if(p.match(this.ruleRegex)){
                let r = p.slice(1)
                r *= p[0]=='b'?1:-1
                this.rule.push(r)
            }
        });
    
    }

    fillRandom(){
        for(let i = 0; i < this.width*this.height;i++){
            let outcome = Math.random()>this.pc/100?0:1
            this.newUniverse[i]=outcome
        }
    }

    getValifInbound(val){
        //this is some kind of 1d wrap around where the end of the array feeds into its beginning and vice versa
        //works fine to keep a state of "perpetual motion"
        val = val<0?(this.width*this.height)+val:val
        val = val> (this.width*this.height)?val%(this.width*this.height):val
        return val > 0 && val < this.width * this.height?this.oldUniverse[val]==1?1:0:0
    }

    getNeighbourCount(index){
        let count=  this.getValifInbound(index-this.width-1)    *this.nw      // NW
        count+=     this.getValifInbound(index-this.width)    *this.nn              //N
        count+=     this.getValifInbound(index-this.width+1)      *this.ne            //NE
        count+=     this.getValifInbound(index+1)               *this.ee                     //E
        count+=     this.getValifInbound(index+this.width+1)    *this.se        //SE
        count+=     this.getValifInbound(index+this.width)    *this.ss            //S
        count+=     this.getValifInbound(index+this.width-1)    *this.sw         //SW
        count+=     this.getValifInbound(index-1)               *this.ww                     //WW
        count+=     this.getValifInbound(index)                *this.ce                     //CENTER
        count*=     this.getValifInbound(index) > 0? -1:1       //CENTER flipper (S or B case)

        return count
    }


    calcOutcome(val){ //return 0 if outcome results in void (galactic kind)
        let retval = 0
        this.rule.forEach(element => {
            if(element == val){
                retval = 1
            }
            });
        return retval
    }

    tick(){
        this.oldUniverse = this.newUniverse.slice()

        for(let i = 0; i < this.width*this.height;i++){
        
            let outcome = this.calcOutcome(this.getNeighbourCount(i))
            if(this.hi<1){ //no history, cell gains value each time it survives
                outcome = (this.oldUniverse[i]+1)*outcome
                this.newUniverse[i] = outcome

            }
            else{ //then we have history
                this.newUniverse[i] = this.oldUniverse[i]>1? (this.oldUniverse[i]+1)%(this.hi-1):outcome //if >1, it only gets older, otherwise, get the outcome
                this.newUniverse[i] = this.oldUniverse[i] == 1 && outcome == 0?(this.oldUniverse[i]+1)%(this.hi-1):this.newUniverse[i] //if outcome is 1 and cell alive, its goes into above cited mode
            }   
        }
        return this.newUniverse
    }

    setRandRule(){
        let rules = Array.from(this.stringRules.entries())
        let r = rules[Math.floor(Math.random()*this.stringRules.size)]
        console.log(r[0])
        this.readGoLargs(r[1])
    }

    fillWithRules(){
        //ugly rules hardcoding

        //default GoL has these settings: NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI0 (all weight 1 except center, no generations)
        // this.stringRules.set('bustle', 'NW2 NN1 NE2 WW1 CE0 EE1 SW2 SS1 SE2 HI4 S2 S4 S5 S7 B3 SP1 PC2') //meh
        this.stringRules.set('midges','NW2 NN2 NE2 WW1 CE0 EE1 SW2 SS1 SE2 HI9 S0 S2 S3 B4 B5 B6 PC1')
        // this.stringRules.set('cyclones','NW1 NN1 NE0 WW1 ME0 EE1 SW0 SS1 SE1 HI5 S2 S4 S5 B2 B3 B4 B5 B6 PC10') //meh
        this.stringRules.set('cyclish','NW0 NN1 NE0 WW1 CE0 EE1 SW0 SS1 SE0 HI7 S2 B1 B2 B3 PC50') 
        this.stringRules.set('bloomerang','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI24 s2 s3 s4 b3 b4 b6 b7 b8 rg7 pc10') 
        // this.stringRules.set('bombers','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI25 s3 s4 s5 b2 b4 sh75 rg3 sp10 pc5') //doest fill screen enough 
        this.stringRules.set('meteor_gun','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI8 s0 s1 s2 s4 s5 s6 s7 s8 b3 rg10 p12') 
        this.stringRules.set('xtasy','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI16 s1 s4 s5 s6 b2 b3 b5 b6 rg5 pc2') 
        this.stringRules.set('ortho','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI4 s3 b2 pc2 rg100') 
        this.stringRules.set('cooties','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI8 s2 s3 b2 pc15') 
        this.stringRules.set('fireworks','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI21 s2 b1 b3 PC70 SP10 RG5') 
        this.stringRules.set('wanderers','NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI5 s3 s4 s5 b3 b4 b6 b7 b8 pc15') 
        this.stringRules.set('navaho','NW4 NN1 NE4 WW5 CE7 EE5 SW4 SS1 SE4 HI12 S8 S9 S11 B2 B5 rg10') 
        this.stringRules.set('stampede','NW1 NN3 NE0 WW3 CE0 EE3 SW1 SS3 SE0 HI8 S4 S6 S9 S10 B4 B7 PC10')
        this.stringRules.set('walled_cities', 'NW1 NN1 NE1 WW1 CE0 EE1 SW1 SS1 SE1 HI0 S2 S3 S4 S5 B2 B5 B6 B7 B8 RG100 PC10')
        this.stringRules.set('frost', 'NW0 NN1 NE0 WW1 CE0 EE1 SW0 SS1 SE0 HI25 B1 RG5 SP50 PC1')

    }
}