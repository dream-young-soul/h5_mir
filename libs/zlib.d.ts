declare module Zlib {  
    export class Inflate {  
        constructor(dataany);  
        decompress():any;  
     }  
       
    export class Deflate {   
        constructor(dataany);  
        compress():any;  
    }  
      
}  