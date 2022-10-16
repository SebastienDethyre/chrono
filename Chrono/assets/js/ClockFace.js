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
        this.#element     = createElement("div" , {id:"clockFrame"                         }, this.#parent  );
        this.#counter     = createElement("div" , {id:"counter"                            }, this.#element );
        this.#numbers     = createElement("h1"  , {id:"numbers"      , text  : this.#value }, this.#counter );                      
        this.#plusButton  = createElement("span", {id:"plusButton"   , class :    "button" }, this.#element );
        this.#minusButton = createElement("span", {id:"minusButton"  , class :    "button" }, this.#element );
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

    async autoDecrementCounter(callback, timeInterval){
        if (this.#unit === "seconds"){
            return new Promise(resolve => {
                this.setCounter("-", 1);
                const interval = setInterval(async () => {
                    if (this.#value === 0) clearInterval(interval);
                    if (await callback(this.#value, interval)) {
                        resolve();
                        clearInterval(interval);
                    }
                    this.setCounter("-", 1);
                }, timeInterval);
            })
        } 
    }
}