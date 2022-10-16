import { qs, createElement } from "./utils.js"

export class ClockFace {
    #value;
    #unit;
    #element;
    #parent;

    #counter;
    #numbers;
    #plusButton;
    #minusButton;
    
    constructor(parent = document.body, unit = "seconds"){
        this.#parent   = qs(parent);
        this.#unit     = unit;
        this.#value    = 0;
        this.#createElements();
        this.#addEventListeners();
    }

    // Private methods

    #createElements(){
        this.#element     = createElement("div"  , {id:"clockFaceFrame"                       }, this.#parent );
        this.#counter     = createElement("div"  , {id:"counter"                              }, this.#element );
        this.#numbers     = createElement("h1"   , {id:"numbers",          text  :this.#value }, this.#counter );                      
        this.#plusButton  = createElement("span" , {id:"plusButton",       class :   "button" }, this.#element );
        this.#minusButton = createElement("span" , {id:"minusButton",      class :   "button" }, this.#element );
    }
    
    #addEventListeners(){
        this.#plusButton.addEventListener( "click", ()=> this.setCounter("+", 1));
        this.#minusButton.addEventListener("click", ()=> this.setCounter("-", 1));
    }
    
    //Public methods
    getValue() { return this.#value }

    setCounter(operator, step){
        if      (operator === "+" && this.#value < 60) this.#value += step;
        else if (operator === "-" && this.#value >  0) this.#value -= step;
        this.#numbers.innerText = this.#value;
    }

    async autoDecrementCounter(callback, ms){
        if (this.#unit === "seconds"){
            return new Promise(resolve => {
                this.setCounter("-", 1);
                const interval = setInterval(async () => {
                    if (this.#value === 0)clearInterval(interval);
                    if (await callback(this.#value, interval)) {
                        resolve();
                        clearInterval(interval);
                    }
                    this.setCounter("-", 1);
                }, ms);
            })
        } 
    }
}

class StopWatch {
    #element;
    #startButton
    #minutesCounter;
    #secondsCounter;

    constructor(){
        this.#createElements();
        this.#minutesCounter = new ClockFace("#stopWatchFrame");
        this.#secondsCounter = new ClockFace("#stopWatchFrame");
        this.#addEventListeners()
    }

    #createElements(){
        this.#element     = createElement("div" , { id:"stopWatchFrame"                }                );
        this.#startButton = createElement("span", { id:"startButton", class : "button" }, this.#element );
    }
    
    condition(i) {
        console.log(`Current second: ${i-1}`);
        return i === 0;
    }

    #addEventListeners(){
        this.#startButton.addEventListener( "click",
            async () => {
                console.log('Start');
                await this.#secondsCounter.autoDecrementCounter(this.condition, 1000);
                while (this.#minutesCounter.getValue() > 0) {
                    this.#minutesCounter.setCounter("-", 1);
                    this.#secondsCounter.setCounter("+", 60);
                    await this.#secondsCounter.autoDecrementCounter(this.condition, 1000);
                }
                console.log('Countdown done !');
            }
        )
    }
}

new StopWatch();