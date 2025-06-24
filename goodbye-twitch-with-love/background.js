(function () {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (this._url && this._url.includes("usher.ttvnw.net/api/channel/hls")) {
            const url = new URL(this._url);
            const tokenParam = url.searchParams.get("token");

            try {
                const tokenObj = JSON.parse(decodeURIComponent(tokenParam));
                tokenObj.maximum_resolution = "ULTRA_HD";
                tokenObj.maximum_video_bitrate_kbps = 30000;
                delete tokenObj.maximum_resolution_reasons;
                delete tokenObj.maximum_video_bitrate_kbps_reasons;

                const newToken = encodeURIComponent(JSON.stringify(tokenObj));
                url.searchParams.set("token", newToken);

                this._url = url.toString();
            } catch (e) {
                console.error("Twitch Quality Unlocker: failed to patch token", e);
            }

            const newOpen = originalOpen.bind(this);
            newOpen("GET", this._url);
        }
        return originalSend.apply(this, arguments);
    };
})();
