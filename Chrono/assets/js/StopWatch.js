import { createElement } from "./utils.js"
import { ClockFace     } from"./ClockFace.js"

export class StopWatch {
    #element;
    #startButton
    #numberColor
    #minutesCounter;
    #secondsCounter;

    constructor(){
        this.#createElements();
        this.#minutesCounter = new ClockFace("#stopWatchFrame");
        this.#secondsCounter = new ClockFace("#stopWatchFrame");
        this.#addEventListeners();
    }

    #createElements(){
        this.#element     = createElement( "div"  , {id:"stopWatchFrame"                                                }                );
        this.#startButton = createElement( "span" , {id:"startButton", class : "button"          , title:"Start"        }, this.#element );
        this.#numberColor = createElement( "input", {id:"numberColor", type  : "range" , value: 0, title:"Change color" }, this.#element );
    }
    
    #specialCondition(i) {
        console.log(`Current : ${i-1}`);
        return i === 0;
    }
    
    #normalCondition(i) {
        console.log(`Current : ${i-1}`);
        return i === 1;
    }
    
    #addEventListeners(){
        const countDown = async () => {
            console.log("Start");
            this.#startButton.removeEventListener("click", countDown);

            if (this.#minutesCounter.getValue() !== 0 && this.#secondsCounter.getValue() === 0) 
                 await this.#secondsCounter.autoDecrementCounter(this.#specialCondition , 1000);
            else await this.#secondsCounter.autoDecrementCounter(this.#normalCondition  , 1000);

            while (this.#minutesCounter.getValue() > 0) {
                this.#minutesCounter.setCounter("-", 1);
                this.#secondsCounter.setCounter("+", 60);
                if (this.#minutesCounter.getValue() !== 0 && this.#secondsCounter.getValue() === 0) 
                     await this.#secondsCounter.autoDecrementCounter(this.#specialCondition , 1000);
                else await this.#secondsCounter.autoDecrementCounter(this.#normalCondition  , 1000);
            }               
           
            this.#startButton.addEventListener("click", countDown)
            console.log("Countdown done !");
        }
        this.#startButton.addEventListener("click", countDown);
console.log("test")
        this.#numberColor.addEventListener("input", ()=> {
            let root = document.documentElement;
            root.style.setProperty('--numberColor', this.#numberColor.value * 3.6);
        })
    }
}