
export class BuilderFactory{
    private readonly _element;
    constructor(){
        this._element =<HTMLElement>document.getElementById("main_menu");
    }
    public addBuilder(name:string,clickCallback:()=>void){
        let builder = document.createElement("button");
        builder.className = "main_menu_task"
        builder.textContent = name;
        builder.onclick = clickCallback;
        this._element.appendChild(builder);
    }
}