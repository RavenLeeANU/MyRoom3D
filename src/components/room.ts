import { Engine, Scene,FreeCamera,DirectionalLight,HemisphericLight,Vector3,ArcRotateCamera, SceneLoader, PointerEventTypes} from "@babylonjs/core";
import { LevelScene } from "./level";
import { Interactor } from "./action";
export class Room{
    public engine!: Engine;
    public scene!: Scene;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public canvas!: HTMLCanvasElement | any;
    public mainCamera!: FreeCamera;
    public levels :LevelScene[] = [];
    public action !:Interactor;
    public activeLevel :number = 0;
    constructor(){
        
        //init scene
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine,undefined);
        this.action = new Interactor(this.scene);
        // run the main render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        const light = new DirectionalLight(
            "light",
            new Vector3(-1, -1, 0),
            this.scene
          );

        const skyLight = new HemisphericLight(
        "SkyLight",
        new Vector3(1, 1, 1),
        this.scene
        );
        
        const camera = new ArcRotateCamera(
            "camera1",
            0,
            Math.PI / 4,
            7,
            new Vector3(0, 0, 0),
            this.scene
          );
      
        camera.attachControl(this.canvas, true);
            
        const level = new LevelScene(this.scene);
        level.init();
        this.levels.push(level);
          
        this.addIO();

        this.scene.debugLayer.show();
        
    }

    public addIO(){
      this.scene.onPointerObservable.add((pointerInfo) => {      		
        
        switch (pointerInfo.type) {
          
          case PointerEventTypes.POINTERDOWN:
                        
            if(pointerInfo && pointerInfo?.pickInfo?.hit) {
              
              this.levels[this.activeLevel].responseTouch(pointerInfo)
              //this.action.interact(pointerInfo.pickInfo.pickedMesh!,new Vector3(0,0,0));
              //console.error(pointerInfo.pickInfo.pickedMesh?.types);
            }
            break;
          case PointerEventTypes.POINTERUP:
                      
            break;
          case PointerEventTypes.POINTERMOVE:          
                        
            break;
          }
    });
    }
}