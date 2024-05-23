import { useTheme } from "@/contexts/ThemeProvider"

export const blackLogoSrc = "https://i.ibb.co/60rs2B1/lexicon-ai-high-resolution-logo-white-transparent-1.png";
export const whiteLogoSrc = "https://i.ibb.co/dmp4fnd/lexicon-ai-high-resolution-logo-black-transparent.png";
export const greenLogoSrc = "https://i.ibb.co/L0tHRr9/lexicon-ai-high-resolution-logo-transparent-1.png";

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

