import { ScopeSelectListener } from "./imageCanvas";
import { setClipboard, showMessage } from "./utils";

export class ScopeListener implements ScopeSelectListener{
    private elment;
    private autoCopy;
    constructor(autoCopy?:boolean){
        this.elment = <HTMLElement>document.getElementById("select_scope");
        this.autoCopy = autoCopy;
        this.elment.onclick = (e)=>{
            this.copy();
        }
    }

    private copy(){
        setClipboard(this.elment.textContent ||"").then(()=>{
            showMessage(`范围:${this.elment.textContent}已复制到你的剪切板`);
        });
    }

    onSelected(x: number, y: number, x1: number, y1: number): void {
        this.elment.textContent = `${x},${y},${x1},${y1}`;
        if(this.autoCopy){
            this.copy();
        }
    }
    
}