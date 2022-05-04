import { getColorData, getColorToHexString, orderScope } from "./utils";

export interface MagnisyGlasses{
    conceal():void;
    narrow(offsetX:number,offsetY:number):void;
    magnisy(offsetX:number,offsetY:number):void;
    show(canvas:HTMLCanvasElement,offsetX:number,offsetY:number, imageX:number,imageY:number):void;
    moveAndUpdate(offsetX:number,offsetY:number,imageX:number,imageY:number):void;
    move(offsetX:number,offsetY:number):void;
}

export interface FeatureSelectListener{
    onSelected(x:number,y:number,r:number,g:number,b:number):void;
}

export interface ScopeSelectListener{
    onSelected(x:number,y:number,x1:number,y1:number):void;
}



export class ImageCanvas{
    private readonly context:CanvasRenderingContext2D;
    private readonly canvas:HTMLCanvasElement;
    private image:HTMLImageElement;
    private hasImage = false;

    private glasses:MagnisyGlasses|undefined;
    private featureListener:FeatureSelectListener|undefined;
    private scopeListener:ScopeSelectListener|undefined;

    public constructor(){
        this.canvas = this.initCanvas();
        this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.image = this.initImage();
        this.clearCanvas();
        this.activeDragOpen();
        this.activeMouseEvent();
        this.listenResizeEvent();
    }

    public mouseMove(x:number,y:number){
        let event = new MouseEvent("mousemove",{
            clientX:this.canvas.offsetLeft+this.mouseLastX+x,
            clientY:this.canvas.offsetTop+this.mouseLastY+y,
        });
        this.canvas.dispatchEvent(event);
    }

    public setFeatureListener(listener:FeatureSelectListener){
        this.featureListener = listener;
    }

    public setScopeListener(listener:ScopeSelectListener){
        this.scopeListener = listener;
    }


    public setGlasses(glasses:MagnisyGlasses){
        this.glasses = glasses;
    }

    private warning(message:string){
        console.log(message);
    }

    private saveMaxImageOffset(){
        if(this.image.width < this.canvas.width){
            this.maxImageOffsetX = 0;
        }else{
            this.maxImageOffsetX = this.image.width -this.canvas.width;
        }
        if(this.image.height<this.canvas.height){
            this.maxImageOffsetY = 0;
        }else{
            this.maxImageOffsetY = this.image.height - this.canvas.height;
        }
    }

    private initImage():HTMLImageElement{
        let img = new Image();
        img.onload = (e)=>{
            this.hasImage = true;
            this.context.drawImage(img,0,0);
            this.saveMaxImageOffset();
            this.glasses?.show(this.canvas,this.mouseLastX,this.mouseLastY,
                this.mouseLastX,this.mouseLastY,);
        };
        img.onerror = (e)=>{
            this.warning("图片读取失败！！！");
        };
        return img;
    }

    private initCanvas():HTMLCanvasElement{
        let canvas = <HTMLCanvasElement> document.getElementById("image_canvas");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        return canvas;
    }

    private listenResizeEvent():void{
        window.addEventListener("resize",(e)=>{
            if(this.hasImage)
            {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                this.context.drawImage(this.image,0,0);
                this.saveMaxImageOffset();
            }
        });
    }

    private imageOffsetX = 0;
    private imageOffsetY = 0;

    private clearCanvas():void{
        this.context.fillStyle = "#323232";
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.context.fillStyle = "#000000";
        this.context.font = 'bold 50px sans-serif';
        this.context.textAlign = 'center';
        this.context.fillText('暂无图片', this.canvas.width/2, this.canvas.height/2);
    }

    private mouseButton = -1;
    private mouseCtrl = false;
    private mouseDownX = 0;
    private mouseDownY = 0;
    private activeMouseEvent(){
        this.canvas.addEventListener("mouseover",(e)=>{
            this.mouseLastX = e.offsetX;
            this.mouseLastY = e.offsetY;
            if(this.hasImage && this.glasses){
                let x = this.imageOffsetX+e.offsetX;
                let y = this.imageOffsetY+e.offsetY;
                this.glasses.show(this.canvas,e.offsetX,e.offsetY,x,y);
            }
        });

        this.canvas.addEventListener("mouseout",(e)=>{
            if(this.hasImage && this.glasses){
                this.glasses.conceal();
            }
        });

        this.canvas.oncontextmenu = (e)=>{
            e.preventDefault();
        }

        this.canvas.addEventListener("mousedown",(e)=>{
            if(this.hasImage){
                this.mouseButton = e.button;
                this.mouseCtrl = e.ctrlKey;
                this.mouseDownX = e.offsetX;
                this.mouseDownY = e.offsetY;
            }
        });
        this.canvas.addEventListener("mousemove",(e)=>{
            if(this.hasImage){
                
                if(this.mouseButton === 0){
                    if(!this.mouseCtrl){
                        this.onTryScollImage(e.offsetX,e.offsetY);
                    }else{
                        this.onDrawScopeSelectLine(e.offsetX,e.offsetY);
                        this.glasses?.moveAndUpdate(
                            e.offsetX,e.offsetY,
                            this.imageOffsetX+e.offsetX,
                            this.imageOffsetY+e.offsetY);
                    }
                    
                }else{
                    this.glasses?.moveAndUpdate(
                        e.offsetX,e.offsetY,
                        this.imageOffsetX+e.offsetX,
                        this.imageOffsetY+e.offsetY);
                }
            }
            this.mouseLastX = e.offsetX;
            this.mouseLastY = e.offsetY;
        });

        this.canvas.addEventListener("mouseup",(e)=>{
            if(!this.hasImage){
                return;
            }
            this.onMouseUp(e);
        });

    }

    private onDrawScopeSelectLine(offsetX:number,offsetY:number){
        this.updateCanvasImage();
        let scope = orderScope(this.mouseDownX,this.mouseDownY,offsetX,offsetY);
        let width = scope[2]-scope[0];
        let height = scope[3]-scope[1];
        this.context.setLineDash([5]);
        this.context.lineWidth=2;
        this.context.strokeStyle = "red";
        this.context.strokeRect(scope[0],scope[1],width,height);
    }



    private maxImageOffsetX = 0;
    private maxImageOffsetY = 0;
    private mouseLastX = 0;
    private mouseLastY = 0;
    private onTryScollImage(offsetX:number,offsetY:number){
        let shiftX = offsetX - this.mouseLastX;
        let shiftY = offsetY - this.mouseLastY;
        let imgX =this.imageOffsetX-shiftX;
        let imgY = this.imageOffsetY-shiftY;
        if(imgX<0){
            imgX = 0;
        }else if(imgX>this.maxImageOffsetX){
            imgX = this.maxImageOffsetX;
        }
        if(imgY<0){
            imgY = 0;
        }else if(imgY>this.maxImageOffsetY){
            imgY = this.maxImageOffsetY;
        }
        if(imgX !== this.imageOffsetX || imgY !== this.imageOffsetY){
            this.updateCanvasImage(imgX,imgY);
            this.glasses?.move(offsetX,offsetY);
        }else{
            this.glasses?.moveAndUpdate(offsetX,offsetY,this.imageOffsetX+offsetX,this.imageOffsetY+offsetY);
        }
        // console.log(`last x:${this.mouseLastX},y:${this.mouseLastY},now x:${offsetX},y:${offsetY},shift x:${shiftX},y:${shiftY},new index x:${imgX},y:${imgY}`);
    }

    private getDrawWidth():number{
        if(this.image.width < this.canvas.width){
            return this.image.width;
        }
        return this.canvas.width;
    }

    private getDrawHeight():number{
        if(this.image.height<this.canvas.height){
            return this.image.height;
        }
        return this.canvas.height;
    }

    private updateCanvasImage(x?:number,y?:number){
        this.imageOffsetX = x || this.imageOffsetX;
        this.imageOffsetY = y || this.imageOffsetY;
        let w = this.getDrawWidth();
        let h = this.getDrawHeight();
        this.context.drawImage(this.image,this.imageOffsetX,this.imageOffsetY,w,h,0,0,w,h);
    }

    private onMouseUp(e:MouseEvent){
        if(this.mouseButton === 0){//on left
            if(this.mouseCtrl){//on alt
                if(this.mouseDownX === e.offsetX && this.mouseDownY === e.offsetY){
                    this.onMagnisyEvent(e);// don't move
                }else{
                    this.onScopeEvent(e);
                }
            }else{
                if(this.mouseDownX === e.offsetX && this.mouseDownY === e.offsetY){   
                    this.onFeatureSelectEvent(e); //don't move
                }else{
                    //nothing to do;
                }
            }
            this.mouseButton = -1;
        }else if(this.mouseButton == 2){
            if(this.mouseCtrl){
                if(this.mouseDownX === e.offsetX && this.mouseDownY === e.offsetY){
                    this.onNarrowEvent(e);//on alt+right
                }
            }else{
                this.updateCanvasImage();
            }
        }
    }

    private onNarrowEvent(e:MouseEvent){
        if(this.glasses){
            this.glasses.narrow(e.offsetX,e.offsetY);
        }
    }

    private onMagnisyEvent(e:MouseEvent){
        if(this.glasses){
            this.glasses.magnisy(e.offsetX,e.offsetY);
        }
    }

    private onFeatureSelectEvent(e:MouseEvent){
        if(this.featureListener)
        {
            let data = getColorData(this.context,e.offsetX,e.offsetY);
            this.featureListener.onSelected(
                this.imageOffsetX+e.offsetX,
                this.imageOffsetY+e.offsetY,
                data[0],data[1],data[2]
            );
        }
    }

    private onScopeEvent(e:MouseEvent){
        if(this.scopeListener)
        {
            let scope = orderScope(this.imageOffsetX+this.mouseDownX,
                this.imageOffsetY+this.mouseDownY,
                this.imageOffsetX + e.offsetX,
                this.imageOffsetY+e.offsetY);
            this.scopeListener.onSelected(scope[0],scope[1],scope[2],scope[3]);
        }
    }


    private activeDragOpen():void{
        this.canvas.addEventListener("dragover",(e)=>{
            e.preventDefault();
        });

        this.canvas.addEventListener("dragleave",(e)=>{
            e.preventDefault();
        });

        this.canvas.addEventListener("drop",(e)=>{
            e.preventDefault();
            if(e.dataTransfer)
            {
                let files = e.dataTransfer.files;
                if(files.length)
                {
                    let url = window.URL || window.webkitURL;
                    this.hasImage = false;
                    this.clearCanvas();
                    this.image.src = url.createObjectURL(files[0]);
                    return;
                }
            }
            this.warning("图片读取失败！！！");
        })

    }


}

