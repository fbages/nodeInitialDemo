import { WindowRefService } from './../services/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Jugador } from '../models/jugador/jugador'
import {
  Engine,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  Texture,
  DynamicTexture,
  Space,
  ArcRotateCamera,
  FollowCamera,
  ActionManager,
  ExecuteCodeAction,
  Axis,
  CannonJSPlugin,
  PhysicsImpostor,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { SocketsIoService } from '../services/sockets-io/sockets-io.service';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: FollowCamera;
  private scene: Scene;
  private light: Light;

  private sphere: Mesh;
  private base: Mesh;
  private sphere2 : Mesh;

  enviarJugador:Object;
  jugadors:Array<Object>;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    private sockets: SocketsIoService
  ) {}

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    console.log(this.canvas);

    // Then, load the Babylon 3D engine:
    this.engine = new Engine(this.canvas, true);
    this.engine.resize(true);

    // create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.5, 0.5, 0.5, 0);

    //debug
    //this.scene.debugLayer.show();
    let jugador1 = new Jugador("francesc2", [0,0,0], [0,0,0,0]);
    console.log(jugador1);
      
    //motor fisic
     var gravityVector = new Vector3(0,-20, 0);
     var physicsPlugin = new CannonJSPlugin();
     this.scene.enablePhysics(gravityVector, physicsPlugin);
    
    // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
    //this.sphere = Mesh.CreateBox('box1',2,this.scene);
    this.sphere = Mesh.CreateSphere('sphere1', 16, 0.4, this.scene);
     this.sphere2 = Mesh.CreateSphere('sphere2', 16, 0.3, this.scene);
     let ground = Mesh.CreateGround('Ground1',3,3,2,this.scene);
       
    // move the sphere upward 1/2 of its height
    this.sphere.position.y = 1.2;
     this.sphere2.position.y = 2.4;
        
     this.sphere.physicsImpostor = new PhysicsImpostor(this.sphere, PhysicsImpostor.SphereImpostor, { mass: 1000, restitution: 0.1, friction : 0.5 }, this.scene);
     this.sphere2.physicsImpostor = new PhysicsImpostor(this.sphere2, PhysicsImpostor.SphereImpostor, { mass: 1000, restitution: 0.1, friction : 0.1 }, this.scene);
     ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.2, friction:0.5 }, this.scene);
  
    
    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    //this.camera = new ArcRotateCamera('camera1', 0, 0, 5, new Vector3(0, 0, 0), this.scene);
    this.camera = new FollowCamera(
      'cameraSegueix',
      new Vector3(1, 1, 0),
      this.scene,
      this.sphere
    );

    // target the camera to scene origin
    //this.camera.setTarget(Vector3.Zero());

    // attach the camera to the canvas
    // this.camera.attachControl(this.canvas, false);
    //this.camera.attachControl(true); //lliga el moviment de la camera amb el mouse 
    this.camera.radius = 3;
    //console.log(this.camera);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new HemisphericLight(
      'light1',
      new Vector3(1, 1, 0),
      this.scene
    );

    //material de la base
    var materialBase = new StandardMaterial('materialBase', this.scene);
    // materialBase.diffuseColor = new Color3(1, 0, 1);
    // materialBase.specularColor = new Color3(0.5, 0.6, 0.87);
    // materialBase.ambientColor = new Color3(0.23, 0.98, 0.53);

    var materialSphere1 = new StandardMaterial('texture1', this.scene);
    materialSphere1.wireframe = true;

    // create the material with its texture for the sphere and assign it to the sphere
    const spherMaterial = new StandardMaterial('sun_surface', this.scene);
    spherMaterial.diffuseTexture = new Texture(
      'assets/textures/sun.jpg',
      this.scene
    );
    this.sphere.material = materialBase;



    // simple rotation along the y axis
    // this.scene.registerAfterRender(() => {
    //   this.sphere.rotate (
    //     new Vector3(0, 1, 0),
    //     0.02,
    //     Space.LOCAL
    //   );
    // });

    // SceneLoader.AppendAsync("https://models.babylonjs.com/", "alien.glb", this.scene);
    // SceneLoader.AppendAsync('/assets/', 'basePoly.glb', this.scene).then(
    //   (result) => {
    //     for (let i = 0; i < result.meshes.length; i++) {
    //       //console.log(result.meshes[i]);
    //       let nomdescargat = result.meshes[i].name;
    //       console.log(nomdescargat);

    //       if (result.meshes[i].name == 'Cylinder') {
    //         result.meshes[i].material = materialBase;
    //         console.log('Aplicat material');
    //         result.meshes[i].name = 'Base';
    //       }
    //     }
    //   }
    // );

    var map = {}; //object for multiple key presses
    this.scene.actionManager = new ActionManager(this.scene);

    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
      })
    );

    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
      })
    );

    // 'Variables moviment jugador'
    const deltaRotacio = 0.15 / Math.PI;
    let rotacio = 0; //podra ser aleatori
    const velocitat = 0.05;
    let posicio = [0, 0]; //array posicio X Y
    let F; //FPS
    let usuari = this.sphere;
    console.log(usuari);
    let camera = this.camera;
    let caure = false;


    //Animacio jugador
    this.scene.registerAfterRender(function () {
      // F = this.engine.getFPS() //Recull els FPS

      if (map['a'] || map['A']) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, -deltaRotacio, Space.LOCAL);
      }
      if (map['d'] || map['D']) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, deltaRotacio, Space.LOCAL);
      }

      if (map['w'] || map['W']) {
        usuari.translate(Axis.Z, -velocitat, Space.LOCAL);
      }

      if (map['s'] || map['S']) {
        usuari.translate(Axis.Z, velocitat, Space.LOCAL);
      }

      if (map['c'] || map['C']) {
        console.log(camera)
      }

      //funcio caure
      if (
        Math.pow(
          Math.pow(usuari.position._x, 2) + Math.pow(usuari.position._z, 2),
          0.5
        ) > 1 || caure
       )  {
        usuari.translate(Axis.Y, -velocitat, Space.LOCAL);
        caure = true;
      }
      
      //reset
      if (usuari.position.y < -5) {
        caure = false;
        usuari.position.x = 0;
        usuari.position.y = 1.2;
        usuari.position.z = 0;
      }

      //definir jugador
      Object.assign(jugador1,{"nom":"ana","pos":[usuari.position.x,usuari.position.y,usuari.position.z],"dir":[usuari.rotationQuaternion.x,usuari.rotationQuaternion.y,usuari.rotationQuaternion.z,usuari.rotationQuaternion.w] })
      //console.log(usuari.rotationQuaternion.x,usuari.rotationQuaternion.y,usuari.rotationQuaternion.z,usuari.rotationQuaternion.w);
      ////Sockets
      //Enviar posicio jugador
      //Rebre posicions d'altres jugadors
      //this.jugadors = this.rebreJugadorsEngine();
    });
    
    this.enviarJugadorEngine(jugador1);

    // generates the world x-y-z axis for better understanding
    this.showWorldAxis(8);
  }

  public enviarJugadorEngine(jugador:Object):void{
    this.sockets.enviarJugador(jugador);
  }

  public rebreJugadorsEngine():Object{
    return {"nom":"Ana","pos":[0,1,0],"dir":[1,0,1]};
    // return this.sockets.getJugadors();
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (this.windowRef.document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      this.windowRef.window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }

  /**
   * creates the world axes
   *
   * Source: https://doc.babylonjs.com/snippets/world_axes
   *
   * @param size number
   */
  public showWorldAxis(size: number): void {
    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new DynamicTexture(
        'DynamicTexture',
        50,
        this.scene,
        true
      );
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(
        text,
        5,
        40,
        'bold 36px Arial',
        color,
        'transparent',
        true
      );
      const plane = Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, -0.05 * size, 0),
      ],
      this.scene,
      true
    );

    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(),
        new Vector3(0, size, 0),
        new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0),
        new Vector3(0.05 * size, size * 0.95, 0),
      ],
      this.scene,
      true
    );

    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(),
        new Vector3(0, 0, size),
        new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size),
        new Vector3(0, 0.05 * size, size * 0.95),
      ],
      this.scene,
      true
    );

    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }
}
