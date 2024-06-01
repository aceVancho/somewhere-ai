import { useTheme } from "@/contexts/ThemeProvider"

export const blackLogoSrc = "https://i.postimg.cc/fb3PFNmQ/megpt-high-resolution-logo-transparent.png";
export const whiteLogoSrc = "https://i.postimg.cc/fb3PFNmQ/megpt-high-resolution-logo-transparent.png";
export const greenLogoSrc = "https://i.postimg.cc/fb3PFNmQ/megpt-high-resolution-logo-transparent.png";

export const useLogo = () => {
    const { theme } = useTheme();
  
    switch (theme) {
      case 'dark':
        return greenLogoSrc;
      case 'light':
        return whiteLogoSrc;
      default:
        return greenLogoSrc;
    }
  };

