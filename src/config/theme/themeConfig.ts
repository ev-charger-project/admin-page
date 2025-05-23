import { Inter } from "next/font/google";
import type { ThemeConfig } from "antd";

const inter = Inter({
    subsets: ["latin"]
});

const theme: ThemeConfig = {
    token: {
        fontFamily: inter.style.fontFamily
    },
    components: {
        Layout: {
            headerBg: "inherit"
        },
        Menu: {
            horizontalItemHoverBg: "#C3E5CC",
            horizontalItemSelectedBg: "#34A853",
            activeBarHeight: 0
        }
    }
};

export default theme;
