import type { CustomizeOption } from "@/lib/types";

// 选项构造器（客户端安全：不引入任何服务端依赖），供后台编辑器与种子数据共用。
export const SIZE_VALUES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
export const PLACEMENT_VALUES = [
  { value: "left-chest", label: "Left Chest" },
  { value: "front-center", label: "Front Center" },
  { value: "back-center", label: "Back Center" },
];

export function colorOption(
  colors: { value: string; label: string; swatch?: string }[]
): CustomizeOption {
  return { id: "color", label: "Color", type: "select", required: true, choices: colors };
}
export const sizeOption: CustomizeOption = {
  id: "size",
  label: "Size",
  type: "select",
  required: true,
  choices: SIZE_VALUES.map((v) => ({ value: v, label: v })),
};

// 袜子专用：仅两个尺码（Small / Large）
export const socksSizeOption: CustomizeOption = {
  id: "size",
  label: "Size",
  type: "select",
  required: true,
  choices: [
    { value: "small", label: "Small" },
    { value: "large", label: "Large" },
  ],
};
export const placementOption: CustomizeOption = {
  id: "placement",
  label: "Embroidery Placement",
  type: "select",
  required: true,
  choices: PLACEMENT_VALUES,
};
export const embroideryStyleOption: CustomizeOption = {
  id: "embroideryStyle",
  label: "Embroidery Style",
  type: "select",
  required: true,
  choices: [
    { value: "portrait-only", label: "Portrait Only" },
    { value: "portrait-name", label: "Portrait + Name" },
    { value: "name-only", label: "Name Only" },
  ],
};
export const petNameOption: CustomizeOption = {
  id: "petName",
  label: "Add your pet's name (optional)",
  type: "text",
  placeholder: "e.g. MAX",
};

// 加绒选项：选 Yes 在结算价基础上 +$5（由 ProductCustomizer 计价）
export const fleeceOption: CustomizeOption = {
  id: "fleece",
  label: "Fleece Lining",
  type: "select",
  required: true,
  choices: [
    { value: "no", label: "No" },
    { value: "yes", label: "Yes (+$5)" },
  ],
};
