import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   @ViewChild('rectangle') rect !: ElementRef;
   constructor(private gestureCtrl: GestureController){}
   public type !: any;
   public currentX !: any;
   ngAfterViewInit(): void { 
     this.updateGestures();
   }
  
    updateGestures(){
      const drag = this.gestureCtrl.create({
        el : this.rect.nativeElement, // element need to create gesture on it
        threshold: 0, // the minimum distance that user pointer must move before guster recognized
        gestureName: 'drag', // gesture name
        onMove: ev => { // call back function invoked when gesture is moved
         this.type = ev.type; // ev is event contain information about movment, this referse to event type
         this.currentX = ev.currentX; // ev.currentX is numeric current position of user pointer on x axis
         console.log(this.currentX); // ev.velocityX is numeric velocity of user pointer on x axis
         console.log(this.type);
          //ev.event original browser event   
        }
       });
       drag.enable();
    }
}
