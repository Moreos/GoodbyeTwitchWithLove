chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = new URL(details.url);
        const tokenParam = url.searchParams.get("token");

        if (tokenParam) {
            try {
                const tokenObj = JSON.parse(decodeURIComponent(tokenParam));

                // Модифицируем токен
                tokenObj.maximum_resolution = "ULTRA_HD";
                tokenObj.maximum_video_bitrate_kbps = 30000;
                delete tokenObj.maximum_resolution_reasons;
                delete tokenObj.maximum_video_bitrate_kbps_reasons;

                const newToken = encodeURIComponent(JSON.stringify(tokenObj));
                url.searchParams.set("token", newToken);

                return { redirectUrl: url.toString() };
            } catch (e) {
                console.error("Twitch Quality Unlocker: Failed to patch token", e);
            }
        }

        return {};
    },
    {
        urls: ["*://usher.ttvnw.net/api/channel/hls*"],
        types: ["xmlhttprequest", "sub_frame", "main_frame"]
    },
    ["blocking"]
);