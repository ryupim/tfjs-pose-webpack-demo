export default function WebCamera() {
    const video = document.getElementById("video") as HTMLVideoElement | null;

    if (video !== null) {
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: false,
            })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((e) => {
                console.log(e);
            });
    }
}
