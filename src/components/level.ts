import { ActionManager, Color3, DynamicTexture, ExecuteCodeAction, PBRBaseMaterial, PointerEventTypes, PointerInfo, Scene, SceneLoader, Sound, StandardMaterial, Texture, TransformNode, VideoTexture } from "@babylonjs/core";
import { configs } from "../../resources/configs.json"
import Hls from 'hls.js'
import { Console } from "./logger";
import { Player } from "./player"
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
    private _player !:Player;

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

        this._loadScene();
    }


    public responseTouch(info : PointerInfo){
        const hitPoint = info.pickInfo?.pickedPoint;
        //@ts-ignore
        const meshType = info.pickInfo?.pickedMesh.types;

        switch(meshType){
            case "Ground":
                if(this._player && hitPoint){
                    this._player.move(hitPoint);
                }
                break;
            default:
                break;
        }

    }

    //load from glb
    private _loadScene(){
        
        SceneLoader.LoadAssetContainerAsync(configs.Path,configs.Url.MainLevel,this._scene).then((container)=>{
            
            const entries = container.instantiateModelsToScene((name) => {
                if(name == "__root__"){
                    return "gameObjects"
                }else{
                    return name;
                }
            });
            
            const root  = this._scene.getMeshByName("gameObjects");
            
            entries.animationGroups.forEach((ag)=>{
                ag.stop();
            })

            
            //attach types to meshes
            root!.getChildren().forEach((type)=>{
                
                if(configs.Avatar){
                    //debugger
                    configs.Avatar.forEach((avatarInfos)=>{
                        if(avatarInfos.ObjectId == type.name){
                            //to do fix multiple avatar
                            //@ts-ignore
                            type.animationGroups = entries.animationGroups;
                            //@ts-ignore
                            type.skeleton = entries.skeletons[0];

                            this._player = new Player(this._scene,type as TransformNode);
                            
                        }
                    })
                }

                type.getChildMeshes().forEach((mesh)=>{
                    //@ts-ignore
                    mesh.types = type.name;

                    mesh.actionManager = new ActionManager(this._scene);
                    
                    if(configs.Objects){
                        
                        configs.Objects.Urls && configs.Objects.Urls.forEach((pair)=>{
                            if(pair.ObjectId === mesh.name){
                                
                                //@ts-ignore
                                mesh.url = pair.url;
                                mesh.actionManager!.registerAction(
                                    new ExecuteCodeAction(ActionManager.OnPickTrigger, 
                                    function(event){
                                        window.open(pair.url);
                                    })
                                );

                            }
                        })

                        configs.Objects.Media && configs.Objects.Media.forEach((pair)=>{
                            if(pair.ObjectId === mesh.name){
                                
                                //@ts-ignore
                                mesh.media = pair.url;
                                
                                const videoTexture = new VideoTexture('TV',pair.url,this._scene,
                                false,
                                false,
                                undefined,
                                {
                                  autoPlay: true,
                                  autoUpdateTexture: true,
                                  muted: true,
                                });
                                
                                //to do fix mirror tv
                                const mat = new StandardMaterial("mediaMat", this._scene);
                                mesh.material = mat;
                                (mesh.material as StandardMaterial).diffuseTexture = videoTexture;
                                videoTexture.invertZ = false;
                                mat.roughness = 1;
                                mat.emissiveColor = Color3.White();

                                this._scene.onPointerObservable.add(function(evt){
                                    if(evt.pickInfo!.pickedMesh === mesh){
                                        //console.log("picked");
                                            if(videoTexture.video.paused)
                                                videoTexture.video.play();
                                            else
                                                videoTexture.video.pause();
                                            console.log(videoTexture.video.paused?"paused":"playing");
                                    }
                            }, PointerEventTypes.POINTERPICK);
                            }
                        })

                        configs.Objects.Photos && configs.Objects.Photos.forEach((pair)=>{
                            if(pair.ObjectId === mesh.name){
                                Console.debug(pair.ObjectId+","+mesh.name);
                                //@ts-ignore
                                mesh.photo = pair.url;
                                const mat = new StandardMaterial("photoMat", this._scene);
                                mesh.material = mat;

                                const photo = new Texture(pair.url,this._scene,false,false);
                                //debugger
                                (mesh.material as StandardMaterial).diffuseTexture = photo;

                            }
                        });

                        configs.Objects.Music && configs.Objects.Music.forEach((pair)=>{
                            if(pair.ObjectId === mesh.name){
                                //@ts-ignore
                                mesh.music = pair.url;
                                var music = new Sound("Violons", pair.url, this._scene, null, { loop: true, autoplay: true });
                                
                                this._scene.onPointerObservable.add(function(evt){
                                    if(evt.pickInfo!.pickedMesh === mesh){
                                        //console.log("picked");
                                            if(music.isPaused)
                                                music.play();
                                            else
                                                music.pause();
                                    }

                                })
                            }    
                        });

                        configs.Objects.Text && configs.Objects.Text.forEach((pair)=>{
                            if(pair.ObjectId === mesh.name){
                                //@ts-ignore
                                mesh.text = pair.txt;
                                var font_size = 48;
                                var font = "bold " + font_size + "px Arial";
                                
                                //Set height for dynamic texture
                                var DTHeight = 1.5 * font_size; //or set as wished
                                var planeHeight = 3;
                                //Calcultae ratio
                                var ratio = planeHeight/DTHeight;
                                var temp = new DynamicTexture("DynamicTexture", 64, this._scene);
                                var tmpctx = temp.getContext();
                                tmpctx.font = font;
                                var DTWidth = tmpctx.measureText(pair.txt).width + 8;
                                
                                //Calculate width the plane has to be 
                                var planeWidth = DTWidth * ratio;

                                //Create dynamic texture and write the text
                                var dynamicTexture = new DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight}, this._scene, false);
                                var mat = new StandardMaterial("mat", this._scene);
                                mat.diffuseTexture = dynamicTexture;
                                dynamicTexture.drawText(pair.txt, null, null, font, "#000000", "#ffffff", true);
                                
                                //Create plane and set dynamic texture as material
                                mesh.material = mat;

                            }
                        })
                    }
                })
            })

            this._status = SCENE_STATUS.LOADED_SUCCEED;
        })
    }

}