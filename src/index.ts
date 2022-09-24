import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';

import * as poseDetection from '@tensorflow-models/pose-detection';

import World from './world'; //webpack.config.jsのresolveに設定があるため、拡張子は不要

const root: HTMLElement | null = document.getElementById("root");
const world = new World("Hello World!!!!");
world.sayHello(root);

Run();

async function Run() {
    const model = poseDetection.SupportedModels.MoveNet;
    const detector = await poseDetection.createDetector(model);

    const PATH = "../img/pose1.jpg";
    const image = await loadImage(PATH);
    // manual input
    image.setAttribute("width", "467");
    image.setAttribute("height", "700");
    console.log("image", image);

    const poses = await detector.estimatePoses(image);
    console.log(poses);
}

async function loadImage(imagePath: string) {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    let ctx: CanvasRenderingContext2D | null;
    if (canvas !== null) {
        ctx = canvas.getContext("2d");
        console.log("ctx", ctx);
    }

    let image = new Image();
    // const promise = new Promise((resolve, reject) => {
    //     image.crossOrigin = "";
    //     image.onload = () => {
    //         resolve(image);
    //     };
    // });

    image.onload = function () {
        console.log("onload start");
        if (ctx !== null) {
            console.log("draw start");
            ctx.drawImage(image, 0, 0);
        }
    };

    image.src = imagePath;
    return image;
}
