// 版本中心模拟数据
// Requirements: 1.1, 2.1, 4.1, 4.5

import type { Version } from '@/types'

export const versions: Version[] = [
  {
    id: 'v1.0.0',
    versionNumber: '1.0.0',
    releaseDate: new Date('2024-01-15'),
    status: 'deprecated',
    summary: '游戏初始版本，包含基础英雄和装备系统',
    majorChanges: ['推出10位初始英雄', '完成装备系统', '实现基础对战模式'],
    updateContent: [
      {
        id: 'uc-1-1',
        category: 'heroes',
        title: '推出英雄：亚瑟',
        description: '圣光守护者亚瑟加入游戏，拥有强大的防御能力',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg',
        order: 1
      },
      {
        id: 'uc-1-2',
        category: 'heroes',
        title: '推出英雄：妲己',
        description: '魅惑之狐妲己加入游戏，拥有强大的控制能力',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg',
        order: 2
      },
      {
        id: 'uc-1-3',
        category: 'bugFixes',
        title: '修复登录界面显示问题',
        description: '修复了某些设备上登录界面显示不完整的问题',
        order: 3
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'v1.1.0',
    versionNumber: '1.1.0',
    releaseDate: new Date('2024-02-10'),
    status: 'deprecated',
    summary: '新增皮肤系统和英雄平衡调整',
    majorChanges: ['推出皮肤系统', '调整5位英雄数据', '优化游戏性能'],
    updateContent: [
      {
        id: 'uc-2-1',
        category: 'skins',
        title: '新皮肤：亚瑟-死亡骑士',
        description: '亚瑟的全新皮肤，展现黑暗骑士的风采',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166-bigskin-2.jpg',
        order: 1
      },
      {
        id: 'uc-2-2',
        category: 'balance',
        title: '亚瑟技能平衡调整',
        description: '调整亚瑟的防御能力',
        beforeValue: { defense: 30 },
        afterValue: { defense: 35 },
        order: 2
      },
      {
        id: 'uc-2-3',
        category: 'bugFixes',
        title: '修复皮肤加载问题',
        description: '修复了皮肤在某些情况下无法正确加载的问题',
        order: 3
      }
    ],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'v1.2.0',
    versionNumber: '1.2.0',
    releaseDate: new Date('2024-03-08'),
    status: 'deprecated',
    summary: '推出新英雄和装备平衡调整',
    majorChanges: ['推出3位新英雄', '调整装备属性', '新增排位赛模式'],
    updateContent: [
      {
        id: 'uc-3-1',
        category: 'heroes',
        title: '推出英雄：李白',
        description: '诗仙李白加入游戏，拥有高爆发伤害',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg',
        order: 1
      },
      {
        id: 'uc-3-2',
        category: 'balance',
        title: '装备平衡调整',
        description: '调整了多件装备的属性和价格',
        order: 2
      },
      {
        id: 'uc-3-3',
        category: 'other',
        title: '新增排位赛模式',
        description: '玩家现在可以参加排位赛来获得排名',
        order: 3
      }
    ],
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-08')
  },
  {
    id: 'v1.3.0',
    versionNumber: '1.3.0',
    releaseDate: new Date('2024-04-05'),
    status: 'deprecated',
    summary: '优化游戏性能和用户界面',
    majorChanges: ['优化帧率', '重新设计UI', '新增社交功能'],
    updateContent: [
      {
        id: 'uc-4-1',
        category: 'other',
        title: '游戏性能优化',
        description: '优化了游戏引擎，提升了平均帧率20%',
        order: 1
      },
      {
        id: 'uc-4-2',
        category: 'other',
        title: '用户界面重设计',
        description: '全新的UI设计，提升用户体验',
        order: 2
      },
      {
        id: 'uc-4-3',
        category: 'bugFixes',
        title: '修复多个已知问题',
        description: '修复了10+个已知的游戏问题',
        order: 3
      }
    ],
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  },
  {
    id: 'v1.4.0',
    versionNumber: '1.4.0',
    releaseDate: new Date('2024-05-12'),
    status: 'deprecated',
    summary: '推出新英雄和皮肤系列',
    majorChanges: ['推出2位新英雄', '推出皮肤系列', '调整游戏平衡'],
    updateContent: [
      {
        id: 'uc-5-1',
        category: 'heroes',
        title: '推出英雄：孙尚香',
        description: '射手孙尚香加入游戏，拥有远程输出能力',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg',
        order: 1
      },
      {
        id: 'uc-5-2',
        category: 'skins',
        title: '新皮肤系列：星辰系列',
        description: '推出5款星辰主题皮肤',
        order: 2
      },
      {
        id: 'uc-5-3',
        category: 'balance',
        title: '英雄平衡调整',
        description: '调整了8位英雄的技能数据',
        order: 3
      }
    ],
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-05-12')
  },
  {
    id: 'v1.5.0',
    versionNumber: '1.5.0',
    releaseDate: new Date('2024-06-20'),
    status: 'deprecated',
    summary: '新增团队赛事和观战系统',
    majorChanges: ['推出团队赛事', '新增观战系统', '优化匹配算法'],
    updateContent: [
      {
        id: 'uc-6-1',
        category: 'other',
        title: '团队赛事系统',
        description: '玩家现在可以组建战队参加官方赛事',
        order: 1
      },
      {
        id: 'uc-6-2',
        category: 'other',
        title: '观战系统',
        description: '支持观看职业选手的实时比赛',
        order: 2
      },
      {
        id: 'uc-6-3',
        category: 'bugFixes',
        title: '修复匹配问题',
        description: '优化了匹配算法，减少了等待时间',
        order: 3
      }
    ],
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: 'v1.6.0',
    versionNumber: '1.6.0',
    releaseDate: new Date('2024-07-18'),
    status: 'deprecated',
    summary: '推出新地图和游戏模式',
    majorChanges: ['新增地图', '新增游戏模式', '推出3位新英雄'],
    updateContent: [
      {
        id: 'uc-7-1',
        category: 'other',
        title: '新地图：魔法森林',
        description: '全新的5v5地图，充满魔法元素',
        order: 1
      },
      {
        id: 'uc-7-2',
        category: 'other',
        title: '新游戏模式：乱斗模式',
        description: '快速的5v5对战模式，适合休闲玩家',
        order: 2
      },
      {
        id: 'uc-7-3',
        category: 'heroes',
        title: '推出英雄：貂蝉',
        description: '舞蹈家貂蝉加入游戏，拥有优雅的技能',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg',
        order: 3
      }
    ],
    createdAt: new Date('2024-07-18'),
    updatedAt: new Date('2024-07-18')
  },
  {
    id: 'v1.7.0',
    versionNumber: '1.7.0',
    releaseDate: new Date('2024-08-15'),
    status: 'deprecated',
    summary: '大规模英雄平衡调整和新皮肤',
    majorChanges: ['调整12位英雄', '推出皮肤系列', '优化游戏体验'],
    updateContent: [
      {
        id: 'uc-8-1',
        category: 'balance',
        title: '大规模英雄平衡调整',
        description: '调整了12位英雄的技能和属性',
        order: 1
      },
      {
        id: 'uc-8-2',
        category: 'skins',
        title: '新皮肤系列：传说系列',
        description: '推出4款传说主题皮肤',
        order: 2
      },
      {
        id: 'uc-8-3',
        category: 'bugFixes',
        title: '修复视觉效果问题',
        description: '修复了多个英雄的技能特效显示问题',
        order: 3
      }
    ],
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-15')
  },
  {
    id: 'v1.8.0',
    versionNumber: '1.8.0',
    releaseDate: new Date('2024-09-10'),
    status: 'deprecated',
    summary: '推出新英雄和装备系统升级',
    majorChanges: ['推出2位新英雄', '升级装备系统', '新增成就系统'],
    updateContent: [
      {
        id: 'uc-9-1',
        category: 'heroes',
        title: '推出英雄：项羽',
        description: '力量型英雄项羽加入游戏',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg',
        order: 1
      },
      {
        id: 'uc-9-2',
        category: 'other',
        title: '装备系统升级',
        description: '新增装备合成系统，提升装备多样性',
        order: 2
      },
      {
        id: 'uc-9-3',
        category: 'other',
        title: '成就系统',
        description: '玩家现在可以完成各种成就获得奖励',
        order: 3
      }
    ],
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: 'v1.9.0',
    versionNumber: '1.9.0',
    releaseDate: new Date('2024-10-08'),
    status: 'deprecated',
    summary: '秋季赛事和新皮肤发布',
    majorChanges: ['推出秋季赛事', '推出5款新皮肤', '优化社交功能'],
    updateContent: [
      {
        id: 'uc-10-1',
        category: 'other',
        title: '秋季赛事',
        description: '推出秋季职业联赛，奖金池达到100万',
        order: 1
      },
      {
        id: 'uc-10-2',
        category: 'skins',
        title: '秋季皮肤系列',
        description: '推出5款秋季主题皮肤',
        order: 2
      },
      {
        id: 'uc-10-3',
        category: 'other',
        title: '社交功能优化',
        description: '新增语音聊天和队伍功能',
        order: 3
      }
    ],
    createdAt: new Date('2024-10-08'),
    updatedAt: new Date('2024-10-08')
  },
  {
    id: 'v2.0.0',
    versionNumber: '2.0.0',
    releaseDate: new Date('2024-11-05'),
    status: 'deprecated',
    summary: '游戏大版本更新，引擎升级和新系统',
    majorChanges: ['游戏引擎升级', '推出天赋系统', '推出3位新英雄'],
    updateContent: [
      {
        id: 'uc-11-1',
        category: 'other',
        title: '游戏引擎升级',
        description: '升级到新一代游戏引擎，画质提升50%',
        order: 1
      },
      {
        id: 'uc-11-2',
        category: 'other',
        title: '天赋系统',
        description: '新增天赋系统，玩家可以自定义英雄天赋',
        order: 2
      },
      {
        id: 'uc-11-3',
        category: 'heroes',
        title: '推出英雄：武则天',
        description: '皇帝武则天加入游戏，拥有强大的控制能力',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg',
        order: 3
      }
    ],
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05')
  },
  {
    id: 'v2.1.0',
    versionNumber: '2.1.0',
    releaseDate: new Date('2024-12-10'),
    status: 'deprecated',
    summary: '冬季更新和平衡调整',
    majorChanges: ['冬季皮肤系列', '调整10位英雄', '新增排行榜系统'],
    updateContent: [
      {
        id: 'uc-12-1',
        category: 'skins',
        title: '冬季皮肤系列',
        description: '推出6款冬季主题皮肤',
        order: 1
      },
      {
        id: 'uc-12-2',
        category: 'balance',
        title: '英雄平衡调整',
        description: '调整了10位英雄的技能数据',
        order: 2
      },
      {
        id: 'uc-12-3',
        category: 'other',
        title: '排行榜系统',
        description: '新增全球排行榜，展示顶级玩家',
        order: 3
      }
    ],
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'v2.2.0',
    versionNumber: '2.2.0',
    releaseDate: new Date('2025-01-08'),
    status: 'active',
    summary: '新年版本更新，推出新英雄和系统优化',
    majorChanges: ['推出2位新英雄', '优化匹配系统', '新增礼物系统'],
    updateContent: [
      {
        id: 'uc-13-1',
        category: 'heroes',
        title: '推出英雄：孙权',
        description: '统治者孙权加入游戏，拥有强大的团队能力',
        imageUrl: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg',
        order: 1
      },
      {
        id: 'uc-13-2',
        category: 'other',
        title: '匹配系统优化',
        description: '优化了匹配算法，提升了匹配质量',
        order: 2
      },
      {
        id: 'uc-13-3',
        category: 'other',
        title: '礼物系统',
        description: '玩家现在可以互相赠送礼物',
        order: 3
      }
    ],
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08')
  },
  {
    id: 'v2.3.0',
    versionNumber: '2.3.0',
    releaseDate: new Date('2025-01-20'),
    status: 'active',
    summary: '春节特别版本，新皮肤和活动',
    majorChanges: ['春节皮肤系列', '春节活动', '新增副本系统'],
    updateContent: [
      {
        id: 'uc-14-1',
        category: 'skins',
        title: '春节皮肤系列',
        description: '推出8款春节主题皮肤',
        order: 1
      },
      {
        id: 'uc-14-2',
        category: 'other',
        title: '春节活动',
        description: '推出春节限时活动，获得丰厚奖励',
        order: 2
      },
      {
        id: 'uc-14-3',
        category: 'other',
        title: '副本系统',
        description: '新增PvE副本系统，支持多人合作',
        order: 3
      }
    ],
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20')
  }
]

// 辅助函数
export const getVersionById = (id: string): Version | undefined => {
  return versions.find(v => v.id === id)
}

export const getCurrentVersion = (): Version | undefined => {
  return versions.find(v => v.status === 'active')
}

export const getVersionsByStatus = (status: string): Version[] => {
  return versions.filter(v => v.status === status)
}
