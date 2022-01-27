import { Engine, Scene,FreeCamera,DirectionalLight,HemisphericLight,Vector3,ArcRotateCamera, SceneLoader} from "@babylonjs/core";

export class Room{
    public engine!: Engine;
    public scene!: Scene;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public canvas!: HTMLCanvasElement | any;
    public mainCamera!: FreeCamera;

    constructor(){
        
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine,undefined);

        //debugger
        // const light = new DirectionalLight(
        //     "light",
        //     new Vector3(-1, -1, 0),
        //     this.scene
        //   );

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
        
        SceneLoader.LoadAssetContainerAsync('./resources/','myroom.glb',this.scene).then((container)=>{
            container.instantiateModelsToScene()
        })  

        this.scene.debugLayer.show();
        // run the main render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    
}