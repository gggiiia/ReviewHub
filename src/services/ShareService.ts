import {proxy, subscribe} from "valtio/vanilla";
import { useSnapshot } from "valtio/react";
import {designService} from "@/services/DesignService.ts";
import {generateThemeVariables} from "@/lib/colors.ts";

interface ShareState {
  bgColor: string;
}

const DEFAULT_BG = "#ffffff"; // brandy blue default

export const shareState = proxy<ShareState>({
  bgColor: DEFAULT_BG,
});

export const shareActions = {
  setBgColor(color: string) {
    // basic normalization: ensure starts with # and length acceptable
    const c = (color || "").trim();
    if (!c) {
      shareState.bgColor = DEFAULT_BG;
      return;
    }
    shareState.bgColor = c.startsWith("#") ? c : `#${c}`;
  },
};

export function useShare() {
  return useSnapshot(shareState);
}
