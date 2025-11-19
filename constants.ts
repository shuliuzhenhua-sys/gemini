import { Step, StepConfig } from './types';

export const SYSTEM_INSTRUCTION = `
# Role & Identity
你现在是 **"Visual Prompt Studio" (视觉提示词工作室)**，一个运行在 Gemini 3 Pro 架构上的高级提示词构建向导。
你的目标是引导用户生成高质量的 Midjourney (MJ) 或 Stable Diffusion (SD) 提示词，并**教会用户**每个提示词的作用。

# Core Capabilities (核心能力)
* **结构化引导**: 像网站表单一样，分步骤引导用户。
* **视觉化菜单**: 提供风格/选项列表。**注意：禁止使用 HTML <br> 标签，请使用逗号或列表格式。**
* **参数教学 (Key Feature)**: 在生成最终提示词后，**必须**逐一解释每个关键词的含义和选择理由。
* **反向推导 (Reverse Engineering)**: 分析参考图并生成提示词。

# The 6-Step Creation Workflow (6步创作流)
除非用户要求一次性生成，否则严格按照以下顺序，**一步一步**与用户交互：

1. **Step 1: 【主体 (Subject)】** - 画什么？
2. **Step 2: 【细节 & 氛围 (Details)】** - 环境、天气、情绪。
3. **Step 3: 【风格 (Style)】** - 核心画风 (如 Cyberpunk, Oil Painting)。
4. **Step 4: 【构图 (Composition)】** - 镜头视角 (如 Wide angle, Close-up)。
5. **Step 5: 【质量 (Quality)】** - 画质参数 (如 8k, masterpiece)。
6. **Step 6: 【避免 (Negative)】** - 负面提示词。

# Final Output Format (最终输出规范)
在流程结束时，请严格按照以下三个部分输出：

### 1. 🎨 视觉概念 (Visual Concept)
> [用简短优美的中文描述最终画面的意境]

### 2. 🚀 最终提示词 (Final Prompt)
\`\`\`markdown
[Subject], [Details], [Style], [Composition], [Quality] --ar [Ratio]
\`\`\`

### 3. 📚 参数详解 (Parameter Breakdown) - **重要！**
请为用户解释提示词中每个关键值的含义：
* **[Keyword 1]**: [中文解释] - [作用/效果]
* **[Keyword 2]**: [中文解释] - [作用/效果]
* **--ar [Ratio]**: [构图比例解释]

# Interaction Rules (交互规则)
* **Tone**: 专业、耐心、富有教学性。
* **Format**: 表格内容禁止换行标签。
* **Language**: 全程中文交流，Prompt 保持英文。
`;

export const STEPS_DATA: Record<Step, StepConfig> = {
  [Step.SUBJECT]: {
    title: "主体 (Subject)",
    description: "画面的核心焦点是什么？",
    options: [
      { label: "人物 (Portrait)", value: "A stunning portrait of a character", icon: "👤" },
      { label: "风景 (Landscape)", value: "A breathtaking landscape view", icon: "🏔️" },
      { label: "赛博城市 (Cyberpunk)", value: "Futuristic cyberpunk city street", icon: "🌃" },
      { label: "奇幻生物 (Creature)", value: "A mythical dragon in a cave", icon: "🐉" },
    ]
  },
  [Step.DETAILS]: {
    title: "细节与氛围 (Details)",
    description: "设定环境、灯光和情绪。",
    options: [
      { label: "晴朗 (Sunny)", value: "bright natural sunlight, cinematic lighting, blue sky", icon: "☀️" },
      { label: "雨夜 (Rainy)", value: "raining, wet streets, neon reflections, moody atmosphere", icon: "🌧️" },
      { label: "迷雾 (Misty)", value: "heavy fog, mysterious atmosphere, volumetric lighting", icon: "🌫️" },
      { label: "战场 (War Zone)", value: "smoke, fire, debris, dramatic shadows, intense action", icon: "🔥" },
    ]
  },
  [Step.STYLE]: {
    title: "风格 (Style)",
    description: "选择艺术表现形式。",
    options: [
      { label: "写实 (Realism)", value: "photorealistic, 8k, shot on 35mm lens, hyper-realistic", icon: "📸" },
      { label: "二次元 (Anime)", value: "anime style, studio ghibli style, vibrant colors, cel shading", icon: "🌸" },
      { label: "油画 (Oil)", value: "oil painting, textured brushstrokes, classical art style", icon: "🎨" },
      { label: "赛博朋克 (Cyber)", value: "cyberpunk aesthetic, neon lights, high tech low life", icon: "🤖" },
      { label: "3D渲染 (3D)", value: "3d render, unreal engine 5, octane render, ray tracing", icon: "🎲" },
    ]
  },
  [Step.COMPOSITION]: {
    title: "构图 (Composition)",
    description: "镜头的视角和位置。",
    options: [
      { label: "特写 (Close-up)", value: "close-up shot, macro details, depth of field", icon: "🔍" },
      { label: "全身 (Full Body)", value: "full body shot, centered composition", icon: "🧍" },
      { label: "广角 (Wide)", value: "wide angle lens, fisheye effect, panoramic view", icon: "👁️" },
      { label: "仰视 (Low Angle)", value: "low angle shot, looking up, imposing perspective", icon: "📐" },
    ]
  },
  [Step.QUALITY]: {
    title: "画质增强 (Quality)",
    description: "提升细节的魔法词。",
    options: [
      { label: "标准增强", value: "8k, masterpiece, best quality, ultra-detailed", icon: "⭐" },
      { label: "渲染引擎", value: "unreal engine 5 render, octane render, v-ray", icon: "🖥️" },
      { label: "摄影质感", value: "raw photo, f/1.8, iso 100, 4k texture", icon: "📷" },
    ]
  },
  [Step.NEGATIVE]: {
    title: "反向提示词 (Negative)",
    description: "画面中不要出现的东西。",
    options: [
      { label: "通用反向", value: "nsfw, low quality, ugly, deformed, extra fingers, missing limbs, text, watermark", icon: "🚫" },
      { label: "去模糊", value: "blur, depth of field, bokeh, out of focus", icon: "👓" },
      { label: "去3D感", value: "3d, render, cgi, cartoon, drawing", icon: "✏️" },
    ]
  },
  [Step.DONE]: {
    title: "生成完成 (Done)",
    description: "您的提示词已准备就绪。",
    options: []
  }
};