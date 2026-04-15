---
id: game02
common:
  category: Game
  image: /files/main-3.png
  fullscreen: false
#   websiteUrl: https://lun3cy.github.io/LUNA-Badge/
  githubUrl: https://github.com/17857310394/project-x
  videoUrl: /videos/game02.mp4
zh: 
  title: 杀戮尖塔风格卡牌战斗框架
  subtitle: ""
  tags:
    - 游戏demo
    - godot
  role:
    开发者
  description: 类杀戮尖塔战斗框架
  concept: 提供一个拥有杀戮尖塔战斗部分的核心玩法，模块化设计方便扩展的基础框架
---

# 杀戮尖塔风格卡牌游戏框架
基于 **Godot 4** 引擎开发的卡牌 Roguelike 游戏框架，实现了完整的回合制战斗系统、卡牌系统、敌人AI、效果系统等核心模块。

## 🎮 游戏特性

- **经典回合制战斗**：抽牌→打牌→结算的核心循环
- **策略性战斗**：敌人意图预判机制，提前规划策略
- **卡牌收集**：丰富的卡牌类型和效果组合
- **状态效果**：护盾、易伤等多种Buff机制
- **配置驱动**：所有数据通过CSV配置，无需编码即可扩展

## 🛠 技术亮点

- **状态机架构**：游戏流程通过状态机管理，逻辑清晰
- **工厂模式**：效果系统高度可扩展，新增效果只需继承基类
- **配置驱动**：数据与逻辑完全分离，便于策划独立配置
- **事件驱动**：模块间通过信号机制通信，低耦合
- **Model-View分离**：数据与表现分离，便于维护