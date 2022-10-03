import { WindowRefService } from './../services/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Jugador } from '../models/jugador/jugador';
import {
  Engine,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Vector3,
  HemisphericLight,
  DirectionalLight,
  StandardMaterial,
  Texture,
  DynamicTexture,
  Space,
  FollowCamera,
  ActionManager,
  ExecuteCodeAction,
  Axis,
  CannonJSPlugin,
  PhysicsImpostor,
  AxesViewer,
  MeshBuilder,
  Quaternion,
  AbstractMesh,
  ShadowGenerator,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
//import '@babylonjs/core/Debug/debugLayer';
//import '@babylonjs/inspector';
import { SocketsIoService } from '../services/sockets-io/sockets-io.service';
import { Subscription } from 'rxjs';
import * as GUI from '@babylonjs/gui';
import { NicknameService } from '../services/nickname.service';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: FollowCamera;
  private scene: Scene;
  private light: Light;
  private light2: DirectionalLight;

  private sphere: Mesh;
  private base: Mesh;
  private box1: Mesh;
  private avatar: AbstractMesh;

  //public jugadors:any;
  enviarJugador: Object;
  subscription: Subscription;
  peticioXatJugador: Subscription;

  nomJugador: string;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    private sockets: SocketsIoService,
    private nicknameService: NicknameService
  ) {}

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new Engine(this.canvas, true);
    this.engine.resize(true);

    //definicio nom del jugador
    //console.log(this.sockets);
    setTimeout(() => {
      this.nomJugador = this.nicknameService.getNickname();
    }, 500);

    // create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.5, 0.5, 0.5, 0);

    //debug
    //this.scene.debugLayer.show();

    let jugador1 = new Jugador('UsuariNom', [0, 0, 0], [0, 0, 0, 0]);
    //console.log(jugador1);

    //motor fisic
    var gravityVector = new Vector3(0, 0, 0);
    var physicsPlugin = new CannonJSPlugin();
    //this.scene.enablePhysics(gravityVector, physicsPlugin);

    // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
    this.box1 = MeshBuilder.CreateBox(
      'box1',
      { width: 0.4, height: 0.4, depth: 0.6 },
      this.scene
    );
    // let figura;
    //  SceneLoader.AppendAsync('/assets/', 'ghost.glb', this.scene).then(
    //   (result) => {
    //     for (let i = 0; i < result.meshes.length; i++) {
    //       //console.log(result.meshes[i]);
    //       let nomdescargat = result.meshes[i].name;
    //       console.log(nomdescargat);

    //       if (result.meshes[i].name == 'Fleeing_ghost') {
    //         //result.meshes[i].material = MaterialInalambric;
    //         result.meshes[i].name = 'Ghost';
    //         figura =  result.meshes[i];
    //       }
    //     }
    //   }
    // );

    // move the sphere upward 1/2 of its height
    this.box1.position.y = 5;
    this.box1.rotationQuaternion = Quaternion.RotationAxis(
      new Vector3(1, 0, 0),
      0
    );

    var MaterialInalambric = new StandardMaterial('texture1', this.scene);
    MaterialInalambric.wireframe = true;

    // create the material with its texture for the sphere and assign it to the sphere
    const MaterialGroc = new StandardMaterial('sun_surface', this.scene);
    MaterialGroc.diffuseTexture = new Texture(
      'assets/textures/sun.jpg',
      this.scene
    );
    //textura jugador
    let materialJugador = new StandardMaterial('materialJugador', this.scene);

    // this.sphere.material = materialBase;
    // Groc sol material
    SceneLoader.AppendAsync('/assets/', 'base03.glb', this.scene).then(
      (result) => {
        for (let i = 0; i < result.meshes.length; i++) {
          //console.log(result.meshes[i]);
          let nomdescargat = result.meshes[i].name;
          //console.log(nomdescargat);

          if (result.meshes[i].name == 'Cylinder') {
            result.meshes[i].material = MaterialGroc;
            result.meshes[i].name = 'Base1';
          }
        }
      }
    );
    // Material inalambric
    SceneLoader.AppendAsync('/assets/', 'base03.glb', this.scene).then(
      (result) => {
        for (let i = 0; i < result.meshes.length; i++) {
          //console.log(result.meshes[i]);
          let nomdescargat = result.meshes[i].name;
          //console.log(nomdescargat);

          if (result.meshes[i].name == 'Cylinder') {
            result.meshes[i].material = MaterialInalambric;
            result.meshes[i].name = 'Base2';
          }
        }
      }
    );

    // 3D Jugador avatar
    SceneLoader.AppendAsync('/assets/', 'avatar.glb', this.scene).then(
      (result) => {
        for (let i = 0; i < result.meshes.length; i++) {
          //console.log(result.meshes[i]);
          let nomdescargat = result.meshes[i].name;
          //console.log(nomdescargat);
          this.avatar = result.meshes[i];

          if (result.meshes[i].name == 'avatar') {
            this.avatar.parent = this.box1;
            this.box1.visibility = 0;
            this.avatar.material = materialJugador;
            // this.avatar.enableEdgesRendering();
            // this.avatar.edgesWidth=1.0;
            // this.avatar.edgesColor = new Color4(0,0,0,1);
            this.avatar.outlineColor = Color3.Black();
            this.avatar.renderOutline = true;

            // Shadows
            var shadowGenerator = new ShadowGenerator(1024, this.light2);
            shadowGenerator.addShadowCaster(this.scene.getMeshByName('avatar'));
            shadowGenerator.useExponentialShadowMap = true;
            let terra = this.scene.getMeshByName('Base1');
            terra.receiveShadows = true;
          }
        }
      }
    );

    // Crear fisica
    //this.box1.physicsImpostor = new PhysicsImpostor(this.box1, PhysicsImpostor.BoxImpostor, {mass:1000, restitution: 0.1, friction:0.2}, this.scene)

    //Crear nom sobre jugador
    // GUI
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
    //   setTimeout(() => {

    //     var rect1 = new GUI.Rectangle();
    //     rect1.width = "200px";
    //   rect1.height = "40px";
    //   rect1.cornerRadius = 20;
    //   rect1.color = "Orange";
    //   rect1.thickness = 4;
    //   rect1.background = "green";
    //   advancedTexture.addControl(rect1);
    //   rect1.linkWithMesh(this.box1);
    //   rect1.linkOffsetY = 300;

    //   var label = new GUI.TextBlock();
    //   label.text = this.nomJugador;
    //   rect1.addControl(label);

    //   var target = new GUI.Ellipse();
    //   target.width = "40px";
    //   target.height = "40px";
    //   target.color = "Orange";
    //   target.thickness = 4;
    //   target.background = "green";
    //   target.linkOffsetY = -45;
    //   advancedTexture.addControl(target);
    //   target.linkWithMesh(this.box1);

    //   var line = new GUI.Line();
    //   line.lineWidth = 4;
    //   line.color = "Orange";
    //   line.y2 = -20;
    //   line.linkOffsetY = 0;
    //   advancedTexture.addControl(line);
    //   line.linkWithMesh(this.box1);
    //   line.connectedControl = rect1;

    // }, 1500);

    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    //this.camera = new ArcRotateCamera('camera1', 0, 0, 5, new Vector3(0, 0, 0), this.scene);

    // target the camera to scene origin
    //this.camera.setTarget(Vector3.Zero());

    // attach the camera to the canvas
    // this.camera.attachControl(this.canvas, false);
    //this.camera.attachControl(true); //lliga el moviment de la camera amb el mouse
    //console.log(this.camera);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new HemisphericLight(
      'light1',
      new Vector3(1, 1, 0),
      this.scene
    );

    this.light2 = new DirectionalLight(
      'dir01',
      new Vector3(-1, -2, -1),
      this.scene
    );
    this.light2.position = new Vector3(20, 40, 20);
    this.light2.intensity = 0.5;

    this.camera = new FollowCamera(
      'cameraSegueix',
      new Vector3(1, 15, 0),
      this.scene,
      this.box1
    );
    this.camera.fov = 1.2;
    this.camera.radius = 2;
    this.camera.heightOffset = 1.5;

    //moviment teclat
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
    const velocitat = 0.05;
    let F; //FPS
    let rotacio; // salvar la posicio de rotacio
    let usuari = this.box1; //asigna figura 3d a moviments teclat
    // let usuari = this.avatar; //asigna figura 3d a moviments teclat
    //console.log(usuari);

    let caure = false;

    //Generar uns Axis pel propi jugador
    //  const localAxes = new AxesViewer(this.scene, 1);
    // localAxes.xAxis.parent = usuari;
    //  localAxes.yAxis.parent = usuari;
    //  localAxes.zAxis.parent = usuari;

    //Variables altes usuaris
    let jugadors = [];

    //Panell GUI on es mostren finestra de xat privat
    let panel = new GUI.StackPanel();
    advancedTexture.addControl(panel);
    panel.top = '50px';

    let button = GUI.Button.CreateSimpleButton('but', 'inicial');
    button.isVisible = false; // amaga a l'inicia
    button.width = '100px';
    button.height = '100px';
    button.color = 'black';
    button.background = 'green';
    button.cornerRadius = 20;

    panel.addControl(button);

    let button2 = GUI.Button.CreateSimpleButton('but', 'inicial');
    button2.isVisible = false; // amaga a l'inicia
    button2.width = '100px';
    button2.height = '100px';
    button2.color = 'black';
    button2.background = 'red';
    button2.cornerRadius = 20;

    panel.addControl(button2);

    //Rebre posicions d'altres jugadors per subscripcio
    this.subscription = this.sockets.getJugadors().subscribe((jugador) => {
      //console.log(jugador," aixo es el jugador que ha arribat i que esta subscrit");
      let indexJugador = jugadors.findIndex((item) => item.nom == jugador.nom);
      if (indexJugador != -1) {
        Object.assign(jugadors[indexJugador], jugador);
      } else {
        let nouJugador = new Jugador(jugador.nom, jugador.pos, jugador.dir);
        //console.log(nouJugador);
        try {
          if (jugador.nom.length > 0) {
            //tarda uns microsegons a asignar jugador al nom, arribar sense nom sino
            jugadors.push(nouJugador);
            setTimeout(() => {
              crearJugadorExtern(
                jugador.nom,
                jugador.pos,
                jugador.dir,
                this.scene,
                this.avatar
              );
              //console.log("S'ha creat un jugador");
            }, 1000);
          }
        } catch (err) {
         // console.log(jugador.nom, 'és undefined');
        }
      }
    });

    //Borrar jugador desconectat del array de jugadors
    this.subscription = this.sockets
      .getJugadorsDesconectats()
      .subscribe((jugador) => {
        let indexJugador = jugadors.findIndex((item) => item.nom == jugador);
        jugadors.splice(indexJugador, 1);
        //console.log(indexJugador, jugador, jugadors);
        let meshDesconectat = this.scene.getMeshByName(jugador);
        meshDesconectat.dispose();
        let labelDesconectat = advancedTexture.getControlByName(jugador);
        labelDesconectat.dispose();
      });

    //Rebre peticions de xat privat d'altres jugadors
    this.peticioXatJugador = this.sockets
      .rebrepeticioXatPrivat()
      .subscribe((jugadorPeticio) => {
        //finestra de rebre peticions per parlar
        button2.textBlock.text =
          jugadorPeticio + ' vol parlar amb tu en privat, acceptes?';
        button2.isVisible = true;
        button2.onPointerClickObservable.add(() => {
          this.sockets.confirmacioPeticioXatPrivat(
            this.nomJugador,
            jugadorPeticio
          );
          button2.isVisible = false;
        });
      });

    function crearJugadorExtern(nom: string, pos, dir, scene, avatar3d) {
      let box1 = MeshBuilder.CreateBox(
        nom,
        { width: 0.4, height: 0.4, depth: 0.6 },
        scene
      );
      //box1.physicsImpostor = new PhysicsImpostor(box1, PhysicsImpostor.BoxImpostor, {mass:1000, restitution: 0.1, friction:0.2}, scene)
      box1.position.x = Number(pos[0]);
      box1.position.y = Number(pos[1]);
      box1.position.z = Number(pos[2]);
      box1.rotationQuaternion = Quaternion.RotationAxis(
        new Vector3(1, 0, 0),
        0
      );
      box1.rotationQuaternion._x = 0;
      box1.rotationQuaternion._y = Number(dir[1]);
      box1.rotationQuaternion._z = 0;
      box1.rotationQuaternion.w = Number(dir[3]);
      let avatar2 = avatar3d.clone('avatar2', box1);
      avatar2.parent = box1;
      box1.visibility = 0;
      setTimeout(() => {
        let rect1 = new GUI.Rectangle();
        rect1.width = '200px';
        rect1.height = '40px';
        rect1.cornerRadius = 20;
        rect1.color = 'Black';
        rect1.thickness = 2;
        rect1.background = 'Grey';
        advancedTexture.addControl(rect1);
        rect1.linkWithMesh(box1);
        rect1.linkOffsetY = -180;
        rect1.name = nom;

        let label = new GUI.TextBlock();
        label.text = nom;
        rect1.addControl(label);
      }, 500);
    }

    function updateJugadorExtern(nom: string, pos, dir, scene) {
      try {
        let box1 = scene.getMeshByName(nom);
        if (box1 != null) {
          //console.log(box1);
          //console.log(typeof pos[0], pos[1], pos[2], 'aqui esta actualitzant')
          //console.log((box1.position.x), 'aqui esta actualitzant');

          box1.position.x = Number(pos[0]);
          box1.position.y = Number(pos[1]);
          box1.position.z = Number(pos[2]);
          box1.rotationQuaternion._x = 0;
          box1.rotationQuaternion._y = Number(dir[1]);
          box1.rotationQuaternion._z = 0;
          box1.rotationQuaternion.w = Number(dir[3]);
        }
      } catch (err) {
        console.log(err);
      }
    }

    //Animacio jugador
    this.scene.registerAfterRender(() => {
      if ((map['s'] || map['S']) && (map['a'] || map['A'])) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, deltaRotacio, Space.LOCAL);
        usuari.translate(Axis.Z, velocitat, Space.LOCAL);
      } else if ((map['s'] || map['S']) && (map['d'] || map['D'])) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, -deltaRotacio, Space.LOCAL);
        usuari.translate(Axis.Z, velocitat, Space.LOCAL);
      } else if ((map['w'] || map['W']) && (map['a'] || map['A'])) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, -deltaRotacio, Space.LOCAL);
        usuari.translate(Axis.Z, -velocitat, Space.LOCAL);
      } else if ((map['w'] || map['W']) && (map['d'] || map['D'])) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, deltaRotacio, Space.LOCAL);
        usuari.translate(Axis.Z, -velocitat, Space.LOCAL);
      } else if (map['s'] || map['S']) {
        usuari.translate(Axis.Z, velocitat, Space.LOCAL);
      } else if (map['a'] || map['A']) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, -deltaRotacio, Space.LOCAL);
      } else if (map['d'] || map['D']) {
        rotacio += deltaRotacio;
        usuari.rotate(Axis.Y, deltaRotacio, Space.LOCAL);
      } else if (map['w'] || map['W']) {
        usuari.translate(Axis.Z, -velocitat, Space.LOCAL);
      }

      if (usuari.position.y > 0.2) {
        //console.log('Esta volant');
        usuari.translate(Axis.Y, -velocitat, Space.LOCAL);
      }

      //funcio caure
      if (
        Math.pow(
          Math.pow(usuari.position._x, 2) + Math.pow(usuari.position._z, 2),
          0.5
        ) > 3 ||
        caure
      ) {
        usuari.translate(Axis.Y, -velocitat, Space.WORLD);

        //usuari.rotate(Axis.X,0.01,Space.LOCAL);
        caure = true;
        //console.log('esta caient')
        usuari.rotate(Axis.X, 0.005, Space.LOCAL);

        this.camera.radius = 2;
        this.camera.heightOffset = -3;
      }

      //reset
      if (usuari.position.y < -10) {
        caure = false;
        usuari.rotation.x = 0;
        usuari.rotation.y = 0;
        usuari.rotation.z = 0;
        usuari.position.x = 0;
        usuari.position.y = 5;
        usuari.position.z = 0;
        usuari.rotationQuaternion._x = 0;
        usuari.rotationQuaternion._z = 0;
        usuari.rotationQuaternion._y = 0;
        usuari.rotationQuaternion._w = 1;
        this.camera.radius = 2;
        this.camera.heightOffset = 1;
      }

      //definir jugador per al servidor
      Object.assign(jugador1, {
        nom: this.nomJugador,
        pos: [
          usuari.position.x.toFixed(2),
          usuari.position.y.toFixed(2),
          usuari.position.z.toFixed(2),
        ],
        dir: [
          usuari.rotationQuaternion.x.toFixed(2),
          usuari.rotationQuaternion.y.toFixed(2),
          usuari.rotationQuaternion.z.toFixed(2),
          usuari.rotationQuaternion.w.toFixed(2),
        ],
      });

      ////Sockets
      //Enviar posicio jugador
      //console.log(jugador1, "info jugador partida");
      this.sockets.enviarJugador(jugador1);

      //renderiza posicions jugadors externs
      //console.log(jugadors, "info jugadors externs");

      for (let i = 0; i < jugadors.length; i++) {
        //console.log(jugadors[i]);
        updateJugadorExtern(
          jugadors[i].nom,
          jugadors[i].pos,
          jugadors[i].dir,
          this.scene
        );
        let distancia = Math.pow(
          Math.pow(usuari.position._x - jugadors[i].pos[0], 2) +
            Math.pow(usuari.position._z - jugadors[i].pos[2], 2),
          0.5
        );

        if (distancia < 0.5) {
          // console.log('Surt menu per fer xat privat');
          button.textBlock.text = 'Petició xat privat amb ' + jugadors[i].nom;
          button.onPointerClickObservable.add(() => {
            this.sockets.peticioXatPrivat(jugadors[i].nom, this.nomJugador);
            button.isVisible = false;
          });
          button.isVisible = true;
          //confirmacio
        }
        if (distancia > 0.5) {
          button.isVisible = false;
          button2.isVisible = false;
        }
      }
    });

    // generates the world x-y-z axis for better understanding
    // this.showWorldAxis(8);
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

  ngOnDestroy() {
    console.log('ngOnDestroy: cleaning up...');
    this.subscription.unsubscribe();
  }
}
