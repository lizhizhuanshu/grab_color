import { FeatureSelectListener } from "./imageCanvas";
import { RGBTo0xHexString, RGBToStyleColorString, setClipboard, showMessage } from "./utils";

export interface CoordColor{
    x:number;
    y:number;
    r:number;
    g:number;
    b:number;
}

export class CoordColorList implements FeatureSelectListener{
    private listView ;
    private coordColors:CoordColor[];
    constructor(){
        this.listView = <HTMLElement> document.getElementById("coord_color_list");
        this.coordColors = Array();
    }

    public getCoordColors(){
        return this.coordColors;
    }

    private appendView(x: number, y: number,  r:number,g:number,b:number){
        let div = document.createElement("div");
        div.style.height = "40px";
        let coord_color = document.createElement("div");
        coord_color.className = "coord_color";
        coord_color.style.backgroundColor = RGBToStyleColorString(r,g,b);
        coord_color.textContent = `${x},${y},${RGBTo0xHexString(r,g,b)}`;
        coord_color.style.width = "150px";
        coord_color.style.float = "left";
        coord_color.onclick=(e)=>{
            let text = ""
            if(coord_color.textContent){
                if(e.offsetX <50){
                    let r= coord_color.textContent.split(",");
                    text = `${r[0]},${r[1]}`;
                }else if(e.offsetX >100){   
                    text = coord_color.textContent.split(",")[2];
                }else{
                    text = coord_color.textContent ;
                }
            }

            setClipboard(text).then(()=>{
                showMessage(`${text}已经复制到你的剪切板`);
            });
        };
        let del = document.createElement("button");
        del.className = "coord_color_element";
        del.textContent = "del";
        del.onclick = (e)=>{
            this.listView.removeChild(div);
            for (let index = 0; index < this.coordColors.length; index++) {
                const element = this.coordColors[index];
                if(element.x === x && element.y === y)
                {
                    this.coordColors.splice(index,1);
                    break;
                }
            }
        }
        div.append(coord_color);
        div.append(del);
        this.listView.append(div);
    }

    onSelected(x: number, y: number, r:number,g:number,b:number): void {
        this.coordColors.push({
            x:x,
            y:y,
            r:r,
            g:g,
            b:b
        });
        this.appendView(x,y,r,g,b);
    }


}