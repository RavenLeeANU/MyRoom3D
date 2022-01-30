import { AnimationGroup, Nullable, Observable, Observer, Scene, Skeleton, TransformNode, Vector3 } from "@babylonjs/core";
import { Console } from "./logger";
import { calcDistance3D } from "./utils";

const walkSpeed = 2;
const step = 1000 / 25;

export class Player{
    
    private _scene !:Scene;
    private _skeleton !:Skeleton;
    private _animations : AnimationGroup[] = [];
    private _root !: TransformNode;
    private _actOb !: Nullable<Observer<Scene>>;
    private _activeAnim !: AnimationGroup;

    constructor(scene : Scene,root: TransformNode){
        this._scene = scene;
        //@ts-ignore
        this._skeleton = root.skeleton;
        //@ts-ignore
        this._animations = root.animationGroups;
        this._root = root;
        
        this._activeAnim = this._animations.find((ag)=>{return ag.name == 'Idle'})!;
        this._activeAnim.play(true);
        
    }

    public move(dest : Vector3){
        
        const current = this._root.position;
       
        dest.y = current.y;
        Console.debug(dest + ";"+ current);
        let time = calcDistance3D(current, dest) / walkSpeed;
        
        return new Promise<void>((resolve,reject)=>{
            if (this._actOb) {
                this._scene.onBeforeRenderObservable.remove(this._actOb);
            }

            this._activeAnim && this._activeAnim.stop();
            this._activeAnim = this._animations.find((ag)=>{return ag.name == 'Walking'})!;
            this._activeAnim.play(true);
            
            let present = 0;
            this._root?.lookAt(dest);

            this._actOb = this._scene?.onBeforeRenderObservable.add(() => {
                if (present < 1) {
                    const currentWalkPos = Vector3.Lerp(
                      current,
                      dest,
                      present
                    );                    
                    present += step / (time * 1000);
                    this._root.position = currentWalkPos;
                  } else {
                    
                    this._activeAnim && this._activeAnim.stop();
                    this._activeAnim = this._animations.find((ag)=>{return ag.name == 'Idle'})!;
                    this._activeAnim.play(true);

                    this._scene.onBeforeRenderObservable.remove(this._actOb);
                    return resolve();           
                  }
            })
        })  
    }

  
    public stop(){}

}