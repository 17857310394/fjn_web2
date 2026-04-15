---
id: game03
common:
  category: Game
  image: /files/main-4.jpeg
  fullscreen: false
#   websiteUrl: https://lun3cy.github.io/LUNA-Badge/
  githubUrl: https://github.com/17857310394/zzzdemo
  videoUrl: /videos/game03.mp4
zh: 
  title: 绝区零战斗系统
  subtitle: ""
  tags:
    - 游戏demo
    - 战斗系统
    - unity
  role:
    开发者
  description: 绝区零战斗系统
  concept: 绝区零战斗系统
---

## 核心系统设计

### 第三人称角色控制
- 采用 `CharacterController.Move()` 方法实现基础移动
- 通过 `OnAnimationMove` 回调，使用动画根运动驱动角色位移，保持动画与物理的同步

### 动画状态机框架
基于 Unity Animator + 有限状态机（FSM）实现动画过渡与播放逻辑：
- **核心接口**：所有状态继承 `IState` 接口
- **双状态机架构**：
  - `MovementStateMachine`：处理移动相关状态
  - `ComboStateMachine`：处理连招攻击状态
- **状态机基类**：`StateMachine` 实现状态切换逻辑，子类负责状态缓存与初始化
- **状态内部逻辑**：输入事件处理、动画播放、数据初始化/变更、状态退出与过渡

### 连招系统
基于 `ComboState` 实现流畅的连招机制：
- 攻击键输入事件检测
- 预输入动画事件（支持提前输入）
- 必要时间动画事件（确保连招完整性）
- 打断连招衔接动画事件

### 伤害与受击系统
`CharacterHealth` 组件负责：
- 伤害事件注册与分发
- 攻击者伤害计算与处理
- 受伤/格挡动画播放
- 受击音效与特效生成

### 打击反馈优化
为提升战斗体验，系统实现了多层次的打击反馈机制：

**视觉反馈**
- **受击特效**：根据攻击类型生成对应特效（斩击特效、冲击特效、能量爆发）
- **屏幕震动**：根据攻击强度动态调整震动幅度和持续时间

**音效反馈**

**相机反馈**
- **镜头抖动**：受击时轻微的镜头抖动，增强代入感
- **目标锁定特写**：攻击命中时的短暂特写镜头

### 镜头系统
基于 Cinemachine 实现灵活的镜头控制：
- **状态驱动相机**（State-Driven Camera）：根据角色状态切换镜头行为
- **Dolly 滑轨相机**：配合 Timeline 动态更新路径数据
- **水平居中**：移动状态下保持角色屏幕居中

