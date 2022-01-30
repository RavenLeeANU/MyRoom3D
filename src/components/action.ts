import { Action, Mesh, Scene, Vector3 } from "@babylonjs/core";
import { actions } from "../../resources/configs.json"
import { Console } from "./logger"

export class Interactor{
    
    private _scene !: Scene;

    constructor(scene: Scene){
        this._scene = scene;
    }

    public interact(object : Mesh, hotPoint: Vector3){
        
        let actionList : String[] = [];

        //@ts-ignore
        switch(object.types){

            case actions.Ground:
                actionList = actions.Ground;
                break;
            case actions.Decoration:
                actionList = actions.Decoration;
                break;
            case actions.Armature:
                actionList = actions.Armature;
                break;
            case actions.UrlObjects:
                actionList = actions.UrlObjects;
                break;
            default:
                Console.error("no such type");
                break;

        }

        actionList.forEach((action)=>{
            
            switch(action){
                case "Focus":
                    this._focusOnObject();
                    break;
                case "Rotate":
                    this._rotateObject()
                    break;
                case "MoveAvatar":
                    this._moveAvatarTo(object,hotPoint);
                    break;
                case "OpenLink":
                    this._openLink();
                    break;
                default:
                    Console.error("no such type of actions");
                    break;
            }
        })
       

    }

    private _moveAvatarTo(object : Mesh, hotPoint: Vector3){
        Console.debug("excute move avatar");
    }

    private _focusOnObject(){
        Console.debug("excute _focusOnObject");
    }

    private _openLink(){
        Console.debug("excute openLink");
    }

    private _rotateObject(){
        Console.debug("excute rotate");
    }
}
