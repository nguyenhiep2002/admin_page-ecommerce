import { Component } from '@angular/core'

@Component({
  selector: 'app-hocmap', 
  templateUrl: './hocmap.component.html',
  styleUrls: ['./hocmap.component.scss']
})
export class HocmapComponent {
  array1: any[] = [1, 2, 3, 4, 5]
  array2: any[] = ['Hello', 'world', 'OpenAI', 'GPT-3']
  array3: any[] = ['1', '2', '3', '4', '5']
  array4: any[] = ['hello', 'world', 'openai', 'gpt-3']
  array5: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  array6: any[] = ['123', '45', '6789']
  array7: any[] = ['hello', 'world', 'openai']
  array8: any[] = ['apple', 'banana', 'orange', 'cat', 'elephant']
  array9: any[] =  [2, -5, 10, -7, 0]


  ngOnInit(): void {
    this.mapArray1(this.array1)
    this.mapArray1(this.array2)
    this.mapArray1(this.array3)
    this.mapArray1(this.array4)
    this.mapArray1(this.array5)
    this.mapArray1(this.array6)
    this.mapArray1(this.array7)
    this.mapArray1(this.array8)
    this.mapArray1(this.array9)
  }
  mapArray1(items: any[]): void {
    var newarray: any[] = []
    if (items == this.array1) {
      newarray = items.map((item) => item * item)
    }
    if (items == this.array2) {
      newarray = items.map((item) => (item = item.length))
    }
    if (items == this.array3) {
      newarray = items.map((item) => (item = parseInt(item)))
    }
    if (items == this.array4) {
      newarray = items.map((item) => (item = item.toUpperCase()))
    }
    if (items == this.array5) {
      newarray = items
        .map((item) => {
          if (item % 2 === 0) {
            return item
          } else {
            return
          }
        })
        .filter((item) => item !== undefined)
    } 
  
    // if (items == this.array6) {
    //   newarray = items.map(async(item) => { 
    //    var test =await this.forne(item)
    //     return test ;
    //   })
    // }
    if (items == this.array7) {
      newarray = items.map((item) => {item.name = item, item.number = item.length})
    }

    if (items == this.array8) {
      newarray = items.map((item) => {
        if(item === 'orange' && item ===  'elephant')
          {
            item = item.toUpperCase();
            return item
          }
          else{
            return item;
          }
      });
    }

    if (items == this.array9) {
      newarray = items.map((item) => {
        if(item <0){
          item = -item 
          return item
        }
        if(item >=0){
          return item 
        }
      })
    }
    

     console.log(newarray)
  }



  // forne(items :any){
  //   console.log(items);
    
  //   var sum :any = 0;
  //   for(var i = 0; i < items.length; i){
  //     var element = items[i];
     
  //     sum += element;
  //   }
  //   return sum;
  // }
    
}
