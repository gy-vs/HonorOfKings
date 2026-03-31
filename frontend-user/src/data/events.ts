// 赛事模拟数据
// Requirements: 1.4, 2.1, 4.1, 5.1

import type { GameEvent } from '@/types'

// 本地图片列表
const localSkinImages = [
  '/images/skins/17a7fed7bdcbe197699ccdb0f8ae1c5e.png',
  '/images/skins/2c88693726aa7f102082864ef00a4781.png',
  '/images/skins/3473d2f128b9e1dbeee4e0ca2e2d00ff.png',
  '/images/skins/aef5e7f12fe208ca436a1b8ca67b69e5.png',
  '/images/skins/d4147fbfc182255e8c760f21bd4089c8.png',
  '/images/skins/ec2151491a1b2b2511804a89dfe325d0.png'
]

export const events: GameEvent[] = [
  {
    id: 1,
    title: '2024 KPL春季赛总决赛',
    date: '2024-06-15',
    status: 'completed',
    teams: [
      { name: 'AG超玩会', logo: localSkinImages[0] },
      { name: '重庆狼队', logo: localSkinImages[1] }
    ],
    description: 'KPL春季赛总决赛，AG超玩会与重庆狼队巅峰对决，争夺春季赛冠军荣耀。经过五局激烈对战，AG超玩会以4:1的比分获得冠军。',
    prize: '3000万元'
  },
  {
    id: 2,
    title: '2024 KPL夏季赛常规赛',
    date: '2024-07-20',
    status: 'ongoing',
    teams: [
      { name: 'eStarPro', logo: localSkinImages[2] },
      { name: 'DYG', logo: localSkinImages[3] }
    ],
    description: 'KPL夏季赛常规赛正在火热进行中，各大战队为季后赛席位展开激烈争夺。本周焦点战：eStarPro对阵DYG。',
    prize: '2000万元'
  },
  {
    id: 3,
    title: '2024 世界冠军杯',
    date: '2024-08-10',
    status: 'upcoming',
    teams: [
      { name: '待定', logo: localSkinImages[4] },
      { name: '待定', logo: localSkinImages[5] }
    ],
    description: '王者荣耀世界冠军杯即将开启，来自全球各赛区的顶尖战队将齐聚一堂，争夺世界冠军的荣耀。',
    prize: '5000万元'
  },
  {
    id: 4,
    title: '2024 KPL挑战者杯',
    date: '2024-05-20',
    status: 'completed',
    teams: [
      { name: '武汉eStarPro', logo: localSkinImages[0] },
      { name: '佛山DRG', logo: localSkinImages[1] }
    ],
    description: 'KPL挑战者杯是新赛季开始前的重要赛事，武汉eStarPro在决赛中以3:2险胜佛山DRG，夺得挑战者杯冠军。',
    prize: '1000万元'
  },
  {
    id: 5,
    title: '2024 KPL夏季赛季后赛',
    date: '2024-09-01',
    status: 'upcoming',
    teams: [
      { name: '待定', logo: localSkinImages[2] },
      { name: '待定', logo: localSkinImages[3] }
    ],
    description: 'KPL夏季赛季后赛即将开启，常规赛排名前八的战队将进入季后赛，争夺夏季赛冠军。',
    prize: '2500万元'
  },
  {
    id: 6,
    title: '2024 全明星周末',
    date: '2024-07-28',
    status: 'ongoing',
    teams: [
      { name: '东部全明星', logo: localSkinImages[4] },
      { name: '西部全明星', logo: localSkinImages[5] }
    ],
    description: '一年一度的KPL全明星周末正在进行，由粉丝投票选出的明星选手将进行表演赛，还有各种趣味活动。'
  },
  {
    id: 7,
    title: '2024 K甲春季赛',
    date: '2024-04-15',
    status: 'completed',
    teams: [
      { name: 'XYG', logo: localSkinImages[0] },
      { name: 'WE', logo: localSkinImages[1] }
    ],
    description: 'K甲联赛是KPL的次级联赛，为新生代选手提供展示舞台。XYG战队在春季赛中表现出色，成功晋级KPL。',
    prize: '500万元'
  },
  {
    id: 8,
    title: '2024 亚运会王者荣耀项目',
    date: '2024-10-05',
    status: 'upcoming',
    teams: [
      { name: '中国队', logo: localSkinImages[2] },
      { name: '韩国队', logo: localSkinImages[3] }
    ],
    description: '王者荣耀作为亚运会正式比赛项目，中国队将代表国家出战，争夺亚运会金牌。'
  }
]

// 根据状态获取赛事
export const getEventsByStatus = (status: string) => {
  if (!status || status === 'all') return events
  return events.filter(event => event.status === status)
}

// 根据ID获取赛事
export const getEventById = (id: number) => {
  return events.find(event => event.id === id)
}

// 获取所有状态
export const eventStatuses = [
  { key: 'all', name: '全部' },
  { key: 'upcoming', name: '即将开始' },
  { key: 'ongoing', name: '进行中' },
  { key: 'completed', name: '已结束' }
]
