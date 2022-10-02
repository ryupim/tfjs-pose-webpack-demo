import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';

import * as poseDetection from '@tensorflow-models/pose-detection';

import WebCamera from './webCamera';
import World from './world'; //webpack.config.jsのresolveに設定があるため、拡張子は不要

const root: HTMLElement | null = document.getElementById("root");
// const world = new World("Hello World!!!!");
// world.sayHello(root);

WebCamera();
Run();

async function Run() {
    const model = poseDetection.SupportedModels.MoveNet;
    const detector = await poseDetection.createDetector(model);

    const object: string = "video";

    if (object === "image") {
        const PATH = "../img/pose1.jpg";
        const image = await loadImage(PATH);
        // manual input
        image.setAttribute("width", "467");
        image.setAttribute("height", "700");
        console.log("image", image);

        const poses = await detector.estimatePoses(image);
        console.log(poses);
    } else if (object === "video") {
        setInterval(() => {
            detect(detector);
        }, 100);
    }
}

const detect = async (detector: poseDetection.PoseDetector) => {
    const videoElement = document.getElementById(
        "video"
    ) as HTMLVideoElement | null;
    if (videoElement !== null) {
        // Get Video Properties
        videoElement.setAttribute("width", "640");
        videoElement.setAttribute("height", "480");

        // Make Detections
        console.log("videoElement", videoElement);
        detector.estimatePoses(videoElement).then(function (pose: any) {
            console.log("pose result", pose[0]);
            drawKeypoints(pose[0]);
        });

        // drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
};

async function loadImage(imagePath: string) {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas-image");
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

const poseStore: any = {};
const webcamCanvas = document.getElementById(
    "webacamCanvas"
) as HTMLCanvasElement;
const webcamCtx: CanvasRenderingContext2D | null =
    webcamCanvas.getContext("2d");

function drawKeypoints(pose: { keypoints: any[] }) {
    const canvasSize = { width: 640, height: 480 };
    if (webcamCtx !== null) {
        webcamCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    }

    //TODO: fix inaccurate value of x & y
    pose.keypoints.forEach(
        (keypoint: { score: number; name: string; x: number; y: number }) => {
            if (keypoint.score > 0.4) {
                poseStore[keypoint.name] = {
                    x: 480 / 2 - keypoint.x,
                    y: 320 / 2 - keypoint.y,
                };

                if (webcamCtx !== null) {
                    webcamCtx.beginPath();
                    webcamCtx.fillStyle = "rgb(255, 255, 0)"; // yellow
                    webcamCtx.arc(
                        keypoint.x,
                        keypoint.y,
                        5,
                        (10 * Math.PI) / 180,
                        (80 * Math.PI) / 180,
                        true
                    );
                    webcamCtx.fill();
                    webcamCtx.fillText(
                        keypoint.name,
                        keypoint.x,
                        keypoint.y + 10
                    );
                }
            }
        }
    );
}
