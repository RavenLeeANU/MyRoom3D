
export class Console{
    
    static print(info : String){
        console.info(`[Room Logger]: ${info}`);
    }

    static warn(info : String){
        console.warn(`[Room Warning]: ${info}`);
    }

    static error(info : String){
        console.error(`[Room Error]: ${info}`);
    }

    static debug(info : String){
        console.error(`=====>: ${info}`);
    }

}

const rConsole = new Console();
