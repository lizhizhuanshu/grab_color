import { CoordColor } from "./coordColorList";

export function getColorData(ctx:CanvasRenderingContext2D,x:number,y:number){
    let imageData = ctx.getImageData(x,y,1,1);
    return imageData.data;
}


function toHexString(n:number){
    let r = n.toString(16);
    if(r.length == 1){
        r = "0"+r;
    }
    return r;
}

export function RGBToHexString(r:number,g:number,b:number){
    return `${toHexString(r)}${toHexString(g)}${toHexString(b)}`.toUpperCase();
}
export function RGBTo0xHexString(r:number,g:number,b:number){
    return "0x"+(`${toHexString(r)}${toHexString(g)}${toHexString(b)}`.toUpperCase());
}


export function RGBToStyleColorString(r:number,g:number,b:number){
    return `#${toHexString(r)}${toHexString(g)}${toHexString(b)}`;
}

export function getColorToHexString(ctx:CanvasRenderingContext2D,x:number,y:number){
    let data = getColorData(ctx,x,y);
    return RGBTo0xHexString(data[0],data[1],data[2]);
}


export function buildAutoluaCompareFeature( list: CoordColor[]){
    let arr:string[]=Array();
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        let color = RGBToHexString(element.r,element.g,element.b);
        arr.push(`${element.x}|${element.y}|${color}`);
    }
    return arr.join(",");
}

export function buildAutoluaFindFeature(list :CoordColor[]){
    if(list.length===0){
        return "";
    }
    let ox = list[0].x;
    let oy = list[0].y;

    let arr:string[]=Array();
    for (let index = 1; index < list.length; index++) {
        const element = list[index];
        let color = RGBToHexString(element.r,element.g,element.b);
        arr.push(`${element.x-ox}|${element.y-oy}|${color}`);
    }
    return `0x${RGBToHexString(list[0].r,list[0].g,list[0].b)},"${arr.join(",")}"`;
}


export function orderScope(x:number,y:number,x1:number,y1:number){
    if(x>x1){
        let local = x;
        x = x1;
        x1 = local;
    }
    if(y>y1){
        let local = y;
        y = y1;
        y1 = local;
    }
    return [x,y,x1,y1];
}

export function setClipboard(text:string){
    try{
        return navigator.clipboard.writeText(text);
    }catch(err){
        return new Promise<void>(()=>{});
    }
}

export function showMessage(message:string,time?:number){
    let e = document.createElement("div");
    e.style.position = "fixed";
    e.style.zIndex = "1000";
    e.style.top = "10px";
    e.style.height = "40px";
    e.style.textAlign = "center";
    e.style.lineHeight = "40px";
    e.textContent = message;
    e.style.color = "#000000";
    e.style.backgroundColor = "#ffffff";
    e.style.fontWeight="bolder";
    document.getElementById("body")?.appendChild(e);
    if(e.clientWidth<window.innerWidth){
        e.style.left = `${(window.innerWidth-e.clientWidth)/2}px`;
    }
    setTimeout(()=>{
        document.getElementById("body")?.removeChild(e);
    },time||1500);
}

