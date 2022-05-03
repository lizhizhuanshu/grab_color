import { MagnisyGlasses } from "./imageCanvas"; 
import { getColorToHexString } from "./utils";

export class MagnisyGlassesImp implements MagnisyGlasses{
    private canvas:HTMLCanvasElement;
    private context:CanvasRenderingContext2D;
    private bigCanvas:HTMLCanvasElement|undefined;
    private bigCtx:CanvasRenderingContext2D|undefined;
    private showView;
    private multiple;
    private radius;
    public constructor(canvas:HTMLCanvasElement,multiple:number,radius:number){
        this.multiple = multiple;
        this.radius = radius;
        this.canvas = canvas;
        this.initWidthHeight();
        this.showView = <HTMLElement>document.getElementById("now_coord_color");
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
    }


    private initWidthHeight(){
        let width = (this.radius*2+1)*this.multiple;
        this.canvas.style.width = `${width}`;
        this.canvas.style.height = `${width}`;
        this.canvas.width = width;
        this.canvas.height = width;
    }

    show(canvas:HTMLCanvasElement,offsetX:number,offsetY:number, imageX:number,imageY:number):void{
        this.canvas.style.display = "block";
        this.bigCanvas = canvas;
        this.bigCtx =<CanvasRenderingContext2D> canvas.getContext("2d");
        this.updateImage(offsetX,offsetY);
        this.showView.textContent = `${imageX},${imageY},${getColorToHexString(this.bigCtx,offsetX,offsetY)}`;
    }

    private updateImage(offsetX:number,offsetY:number){
        if(!this.bigCanvas){
            return ;
        }
        if(!this.bigCtx){
            return;
        }
        this.move(offsetX,offsetY);
        let x = offsetX-this.radius;
        let y = offsetY-this.radius;
        let x1 = offsetX+this.radius+1;
        let y1 = offsetY+this.radius+1;
        let originX = 0;
        let originY = 0;

        if(x<0){
            originX = -x;
            x = 0;
        }
        if(y<0){
            originY = -y;
            y = 0;
        }
        if(x1>this.bigCanvas.width){
            x1 = this.bigCanvas.width;
        }
        if(y1>this.bigCanvas.height){
            y1 = this.bigCanvas.height;
        }
        let width = x1-x;
        let height = y1-y;
        this.reset();
        let imageData = this.bigCtx.getImageData(x,y,width,height);
        let data = imageData.data;
        let i = 0;
        for (let nowy = originY; nowy < originY+height; nowy++) {
            for (let nowx = originX; nowx < originX+width; nowx++) {
                let r = data[i];
                let g = data[i+1];
                let b = data[i+2];
                this.context.fillStyle = `rgb(${r},${g},${b})`;
                this.context.fillRect(nowx*this.multiple,
                    nowy*this.multiple,this.multiple,this.multiple);
                i+=4;
            }
        }
        this.drawCenter();
        
    }

    private drawCenter(){
        let line_width = this.multiple/5;
        let s = this.radius*this.multiple;
        let grad = this.context.createLinearGradient(s,s,s+this.multiple,s+this.multiple);
        grad.addColorStop(0,"magenta");
        grad.addColorStop(0.5,"blue");
        grad.addColorStop(1.0,"red");
        this.context.strokeStyle = grad;
        this.context.lineWidth = line_width;
        this.context.strokeRect(s,s,this.multiple,this.multiple);
    }

    private reset(){
        this.context.fillStyle = "#787878";
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
    }

    conceal(): void {
        this.bigCanvas = undefined;
        this.canvas.style.display = "none";
        this.reset();
    }
    narrow(offsetX:number,offsetY:number): void {
        if(this.bigCanvas){
            this.radius -=1;
            this.initWidthHeight();
            this.updateImage(offsetX,offsetY);
        }
    }
    magnisy(offsetX:number,offsetY:number): void {
        if(this.bigCanvas){
            this.radius +=1;
            this.initWidthHeight();
            this.updateImage(offsetX,offsetY);
        }
    }
    moveAndUpdate(offsetX: number, offsetY: number,imageX: number, imageY: number): void {
        if(this.bigCanvas && this.bigCtx){
            this.updateImage(offsetX,offsetY);
            this.showView.textContent = `${imageX},${imageY},${getColorToHexString(this.bigCtx,offsetX,offsetY)}`;
        }
    }
    move(offsetX: number, offsetY: number): void {
        if(this.bigCanvas){
            let shiftx = offsetX<this.bigCanvas.width/2?20:-20-this.canvas.width;
            let shifty = offsetY<this.bigCanvas.height/2?20:-20-this.canvas.width;
            this.canvas.style.left = `${this.bigCanvas.offsetLeft+ offsetX+shiftx}px`;
            this.canvas.style.top = `${this.bigCanvas.offsetTop+ offsetY+shifty}px`;
        }
    }
}