class AppError extends Error{ // abctract class
    #type=null;
    #statusCode=null;
    constructor(message){
        super(message);
    }

    set statusCode(statusCode){
        this.#statusCode=statusCode;
    }

    get statusCode(){
        return this.#statusCode;
    }

    set type(type){
        this.#type=type;
    }
    
    get type(){
        return this.#type;
    }

}

module.exports=AppError;