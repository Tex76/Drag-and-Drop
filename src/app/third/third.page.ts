import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonItem, Gesture, GestureController } from '@ionic/angular';

@Component({
  selector: 'app-third',
  templateUrl: './third.page.html',
  styleUrls: ['./third.page.scss'],
})
export class ThirdPage implements AfterViewInit {

  @ViewChild('dropZone') dropZone!: ElementRef;
  @ViewChildren(IonItem, { read: ElementRef }) items!: QueryList<ElementRef>;

  public myArray: string[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip'];
  public dropArea: string[] = [];

  constructor(public gestureCtrl: GestureController, public changeDetectorRef: ChangeDetectorRef) { }

  gesturearray: Gesture[] = [];

  ngAfterViewInit(): void {
    this.updateGestures();
  }

  updateGestures() {
    this.gesturearray.map(gesture => gesture.destroy());
    this.gesturearray = [];
    const arr = this.items.toArray();
    for (let i = 0; i < arr.length; i++) {
      const oneItem = arr[i];
      const drag = this.gestureCtrl.create({
        el: oneItem.nativeElement,
        threshold: 0,
        gestureName: 'drag',
        onMove: ev => {
          oneItem.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
          oneItem.nativeElement.style.zIndex = '11';
          this.checkDropZoneHover(ev.currentX, ev.currentY);
        },
        onEnd: ev => {
          this.handleDrop(oneItem, ev.currentX, ev.currentY, i);
        }
      });
      drag.enable();
      this.gesturearray.push(drag);
    }

    this.items.changes.subscribe(res => {
      this.updateGestures();
    });
  }

  handleDrop(item: ElementRef<any>, endX: number, endY: number, index: number) {
    const dropZone = this.dropZone.nativeElement.getBoundingClientRect();
    if (this.isInZone(endX, endY, dropZone)) {
      item.nativeElement.remove();
      const removedItem = this.myArray.splice(index, 1);
      this.dropArea.push(removedItem[0]);
      this.detectChanges(); // Manually trigger change detection
    } else {
      item.nativeElement.style.transform = 'translate(0px, 0px)';
      item.nativeElement.style.zIndex = '0';
    }
    this.dropZone.nativeElement.style.backgroundColor = 'white';
  }

  checkDropZoneHover(x: number, y: number) {
    const dropzone = this.dropZone.nativeElement.getBoundingClientRect();
    if (this.isInZone(x, y, dropzone)) {
      this.dropZone.nativeElement.style.backgroundColor = '#009fff';
      this.dropZone.nativeElement.style.color = 'blue';
    } else {
      this.dropZone.nativeElement.style.backgroundColor = 'white';
      this.dropZone.nativeElement.style.color = 'black';
    }
  }

  isInZone(x: number, y: number, dropzone: DOMRect): boolean {
    if (x < dropzone.left || x >= dropzone.right) {
      return false;
    }
    if (y < dropzone.top || y >= dropzone.bottom) {
      return false;
    }
    return true;
  }

  private detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  resetChanges() {
    this.dropArea = [];
    this.myArray = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    this.detectChanges();
  }
  undo(){
    if(this.dropArea.length == 0){
      return;
    }
    this.myArray.push(this.dropArea[this.dropArea.length - 1]);
    this.dropArea.pop();
    this.detectChanges();
  }

}
