import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonItem, Gesture, GestureController } from '@ionic/angular';


@Component({
  selector: 'app-second',
  templateUrl: './second.page.html',
  styleUrls: ['./second.page.scss'],
})
export class SecondPage{
 @ViewChild('dropzoneA') dropA !: ElementRef;
 @ViewChild('dropzoneB') dropB !: ElementRef;
 @ViewChildren(IonItem, {read: ElementRef}) items !: QueryList<ElementRef>;

  public myArray = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  public teamA: string[] = [];
  public teamB: string[] = [];
  

  constructor(private gestureCtrl: GestureController, private changeDetectorRef: ChangeDetectorRef){}
   ngAfterViewInit(): void { 
     this.updateGestures();
   }

   //contentscrollActive = true;
   gesturearray: Gesture[] = [];
  

    updateGestures(){
      this.gesturearray.map(gesture => gesture.destroy());
      this.gesturearray = [];
      const arr = this.items.toArray();
      for (let i=0; i<arr.length; i++){
      const oneItem = arr[i];
      const drag = this.gestureCtrl.create({
      el: oneItem.nativeElement,
      threshold: 1,
      gestureName: 'drag',
      onStart: ev =>{
        oneItem.nativeElement.style.transition = '';
        oneItem.nativeElement.style.opacity = '0.8';
        oneItem.nativeElement.style.fontWeight = 'bold';
        this.changeDetectorRef.detectChanges();
        },
      onMove: ev => {
        oneItem.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
        oneItem.nativeElement.style.zIndex = 11; 
        this.checkDropZoneHover(ev.currentX,ev.currentY);
        },
      onEnd: ev => {
        this.handleDrop(oneItem,ev.currentX,ev.currentY,i);
        }
      });
      drag.enable();
      this.gesturearray.push(drag);
      }
      // when the items changes I will update the gesture? and recreate it
      this.items.changes.subscribe(res =>{
      this.updateGestures();
      });
      }
      

      checkDropZoneHover(x : any,y : any){
        // we are calculating the bounding of boxA and boxB
          const dropA = this.dropA.nativeElement.getBoundingClientRect();
          const dropB = this.dropB.nativeElement.getBoundingClientRect();
          if ( this.isInZone(x,y,dropA)) {
            this.dropA.nativeElement.style.backgroundColor= '#009fff';
          } else {
            this.dropA.nativeElement.style.backgroundColor= 'white';
            this.dropA.nativeElement.style.color = 'black';
          }
          if ( this.isInZone(x,y,dropB)) {
            this.dropB.nativeElement.style.backgroundColor= 'red';
          } else {
            this.dropB.nativeElement.style.backgroundColor= 'white';
            this.dropB.nativeElement.style.color = 'black';
          }
       }
       

       isInZone(x : any , y : any, dropzone : any) : boolean{
              if ( x < dropzone.left || x >= dropzone.right ){
                return false;
              }
              if ( y < dropzone.top || y >= dropzone.bottom ){
                return false;
              }
           return true;
          }
        

              // Decide what to do with dropped item
    handleDrop(item : any, endX : any, endY : any, index : any){
      const dropA = this.dropA.nativeElement.getBoundingClientRect();
      const dropB = this.dropB.nativeElement.getBoundingClientRect();
       // Dropped in Zone A
      if ( this.isInZone(endX,endY,dropA)) {
        item.nativeElement.remove();
        const removeditem = this.myArray.splice(index,1);
        this.teamA.push(removeditem[0]);
      } else if ( this.isInZone(endX,endY,dropB)) {
        item.nativeElement.remove();
        const removeditem = this.myArray.splice(index,1);
        this.teamB.push(removeditem[0]);
      }
      // don't drop it in a zone, bring it back to the initial position
      else {
        // back to normal settings every thing will return to deafult
        item.nativeElement.style.transition = '.2s ease-out';
        item.nativeElement.style.zIndex = 'inherit';
        item.nativeElement.style.transform = `translate(0,0)`;
        item.nativeElement.style.opacity = '1';
        item.nativeElement.style.fontWeight = 'normal';
      }
      this.dropA.nativeElement.style.backgroundColor = 'white';
      this.dropB.nativeElement.style.backgroundColor = 'white';
      this.updateGestures();
    }
 }

      
      
    




