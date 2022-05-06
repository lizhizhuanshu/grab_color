import { BuilderFactory } from "./builderFactory";
import { CoordColorList } from "./coordColorList";
import { ImageCanvas } from "./imageCanvas";
import { MagnisyGlassesImp } from "./magnisyGlasses";
import { ScopeListener } from "./scopeListener";
import { buildAutoluaCompareFeature, buildAutoluaFindFeature, setClipboard, showMessage } from "./utils";


let imageCanvas = new ImageCanvas();
let glassCanvas = <HTMLCanvasElement> document.getElementById("magnify_glasses");
let glasses = new MagnisyGlassesImp(glassCanvas,15,10);
imageCanvas.setGlasses(glasses);

let coordColorList = new CoordColorList();
imageCanvas.setFeatureListener(coordColorList);

let scopeListener = new ScopeListener(true);
imageCanvas.setScopeListener(scopeListener);

document.onkeydown=(e)=>{
    if(e.code === "ArrowLeft"){
        imageCanvas.mouseMove(-1,0);
    }else if(e.code === "ArrowRight"){
        imageCanvas.mouseMove(1,0);
    }else if(e.code === "ArrowUp"){
        imageCanvas.mouseMove(0,-1);
    }else if(e.code === "ArrowDown"){
        imageCanvas.mouseMove(0,1);
    }else if(e.code === "Enter"){
        imageCanvas.featureSelect()
    }
}

let builderFactory = new BuilderFactory();

builderFactory.addBuilder("AutoLua比色特征",()=>{
    let feature = buildAutoluaCompareFeature(coordColorList.getCoordColors());
    setClipboard(feature).then(()=>{
        showMessage(`比色特征已经复制到你的剪切板`);
    });
});


builderFactory.addBuilder("AutoLua一般比色",()=>{
    let feature = buildAutoluaCompareFeature(coordColorList.getCoordColors());
    feature = `Display:isFeatureByShiftColorSum("${feature}",76,0)`;
    setClipboard(feature).then(()=>{
        showMessage(`比色特征已经复制到你的剪切板`);
    });
});

builderFactory.addBuilder("AutoLua找色特征",()=>{
    let feature = buildAutoluaFindFeature(coordColorList.getCoordColors());
    setClipboard(feature).then(()=>{
        showMessage(`找色特征已经复制到你的剪切板`);
    });
});