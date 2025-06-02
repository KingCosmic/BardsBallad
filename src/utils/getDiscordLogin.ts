import api from "@lib/api.js";

export const getDiscordLogin = async () => {
    try {
        const resp = await api.get(`/discord/getLoginLink`)
        return resp.data.url
    } catch (err) {
        return null;
    }
}