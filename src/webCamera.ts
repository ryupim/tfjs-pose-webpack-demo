export default function WebCamera() {
    const cameraOptions = document.querySelector(".video-options>select");
    const customSelect =
        document.querySelector<HTMLSelectElement>(".custom-select");
    let cameraId: string | undefined = customSelect?.value;

    const startStream = (id?: string) => {
        const video = document.getElementById(
            "video"
        ) as HTMLVideoElement | null;

        const videoConstraint = {
            deviceId: id,
        };

        if (video !== null) {
            navigator.mediaDevices
                .getUserMedia({
                    video: videoConstraint,
                    audio: false,
                })
                .then((stream) => {
                    console.log("stream", stream);
                    video.srcObject = stream;
                    video.play();
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const getCameraSelection = async (cameraOptions: Element) => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
        );
        const options = videoDevices.map((videoDevice) => {
            return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
        });
        cameraOptions.insertAdjacentHTML("beforeend", options.join(""));
    };

    customSelect?.addEventListener("change", (evt) => {
        const customSelect =
            document.querySelector<HTMLSelectElement>(".custom-select");
        const id: string | undefined = customSelect?.value;
        cameraId = id !== undefined ? id : "";
        console.log("cameraId", cameraId);
        console.log("currentTarget", evt.currentTarget);

        startStream(cameraId);
    });

    if (cameraOptions !== null) {
        getCameraSelection(cameraOptions);
    }

    startStream(cameraId);
}
