import { Scene, SceneLoader } from "@babylonjs/core";
import { configs } from "../../resources/configs.json"


export interface settings {

}

export enum SCENE_STATUS {
    UNLOAD = -1,
    LOADED_SUCCEED = 0,
    LOADED_FAILED = 1,
    PARSE_CONFIG_FAILED = 2,
    PARSE_CONFIG_FINISH = 3,
    UNKOWN_ERR = 4
}


// class of base level
export class LevelScene {
    
    private _scene !:Scene;
    private _status!: SCENE_STATUS;

    constructor(scene: Scene){
        this._scene = scene;
        this._status = SCENE_STATUS.UNLOAD
    }

    //check if config valid
    private _checkConfig(){
        if(!configs || !configs.Url.MainLevel){
            return false;
        }

        return true;
    }

    //init levels to scene
    public init(){
        if(this._checkConfig()){
            this._status = SCENE_STATUS.PARSE_CONFIG_FINISH;
        }else{
            this._status = SCENE_STATUS.PARSE_CONFIG_FAILED;
            return;
        }

        this._load();
    }

    //load from glb
    private _load(){
        
        SceneLoader.LoadAssetContainerAsync(configs.Path,configs.Url.MainLevel,this._scene).then((container)=>{
            container.instantiateModelsToScene();
            this._status = SCENE_STATUS.LOADED_SUCCEED;
        })
    }

}