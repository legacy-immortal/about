/**
 * Icon registry — maps icon name strings (from content markdown) to
 * react-icons components. Keeps content data free of imports.
 */

import type { IconType } from "react-icons";
import {
   GiKey,
   GiLockedDoor,
   GiLockers,
   GiLockPicking,
   GiScrollQuill,
   GiLockedChest,
   GiMartyrMemorial,
   GiThreeKeys,
   GiTiedScroll,
} from "react-icons/gi";

export const ICON_MAP: Record<string, IconType> = {
   GiKey,
   GiLockedDoor,
   GiLockers,
   GiLockPicking,
   GiScrollQuill,
   GiLockedChest,
   GiMartyrMemorial,
   GiThreeKeys,
   GiTiedScroll,
};

export function resolveIcon(name: string): IconType {
   return ICON_MAP[name] || GiKey;
}
