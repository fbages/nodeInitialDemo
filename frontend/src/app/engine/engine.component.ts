import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { EngineService } from './engine.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss'],
  providers: [EngineService],
})
export class EngineComponent implements OnInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) {}

  public ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
  }

  public ngOnDestroy(): void {
    //console.log("S'ha borrat enginecomponent")
  }
}
