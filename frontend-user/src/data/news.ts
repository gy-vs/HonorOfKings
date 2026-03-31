// 新闻和轮播图模拟数据
// Requirements: 1.4

import type { NewsItem, BannerItem } from '@/types'

// 高清轮播图 - 使用王者荣耀官方英雄皮肤大图（1920x1080分辨率）
// 这些是官方CDN提供的高清皮肤原画，确保清晰度
const bannerImages = [
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131-bigskin-4.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141-bigskin-4.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150-bigskin-3.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190-bigskin-3.jpg'
]

// 新闻缩略图 - 使用官方高清英雄皮肤大图（1920x1080分辨率）
// 使用项目中已确认存在的高清皮肤图片，确保显示清晰
const newsImages = [
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166-bigskin-2.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109-bigskin-3.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169-bigskin-3.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184-bigskin-2.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135-bigskin-3.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112-bigskin-3.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111-bigskin-3.jpg',
  'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123-bigskin-3.jpg'
]

export const news: NewsItem[] = [
  {
    id: 1,
    title: '新英雄「瑶」正式上线，仙灵守护者降临王者峡谷',
    summary: '全新辅助英雄瑶正式上线，她拥有独特的附身机制，可以附身在队友身上提供保护和增益效果。',
    image: newsImages[0],
    date: '2024-07-15',
    category: '新英雄'
  },
  {
    id: 2,
    title: 'KPL夏季赛第五周战报：AG超玩会豪取五连胜',
    summary: 'KPL夏季赛第五周比赛结束，AG超玩会以出色的表现豪取五连胜，暂居积分榜首位。',
    image: newsImages[1],
    date: '2024-07-14',
    category: '赛事'
  },
  {
    id: 3,
    title: '夏日狂欢活动开启，限定皮肤免费领取',
    summary: '夏日狂欢活动正式开启，完成活动任务即可免费获得限定皮肤和丰厚奖励。',
    image: newsImages[2],
    date: '2024-07-13',
    category: '活动'
  },
  {
    id: 4,
    title: '版本更新：多位英雄技能调整，游戏平衡性优化',
    summary: '本次版本更新对多位英雄进行了技能调整，旨在提升游戏的平衡性和可玩性。',
    image: newsImages[3],
    date: '2024-07-12',
    category: '更新'
  },
  {
    id: 5,
    title: '李白「凤求凰」皮肤返场投票开启',
    summary: '年度皮肤返场投票活动开启，李白「凤求凰」皮肤位列候选名单，快来为你喜爱的皮肤投票吧。',
    image: newsImages[4],
    date: '2024-07-11',
    category: '活动'
  },
  {
    id: 6,
    title: '王者荣耀五周年庆典即将开启',
    summary: '王者荣耀五周年庆典活动即将开启，届时将有丰富的福利活动和限定内容等待玩家。',
    image: newsImages[5],
    date: '2024-07-10',
    category: '活动'
  },
  {
    id: 7,
    title: '新赛季S35正式开启，段位继承规则公布',
    summary: 'S35赛季正式开启，新赛季段位继承规则已公布，快来开启新赛季的征程吧。',
    image: newsImages[6],
    date: '2024-07-09',
    category: '更新'
  },
  {
    id: 8,
    title: '世界冠军杯参赛队伍名单公布',
    summary: '2024王者荣耀世界冠军杯参赛队伍名单正式公布，来自全球各赛区的16支顶尖战队将角逐世界冠军。',
    image: newsImages[7],
    date: '2024-07-08',
    category: '赛事'
  }
]

// 轮播图数据 - 使用高清英雄皮肤原画（1920x1080）
export const banners: BannerItem[] = [
  {
    id: 1,
    image: bannerImages[0],
    title: '李白 · 凤求凰 - 青莲剑仙',
    link: '/heroes/3'
  },
  {
    id: 2,
    image: bannerImages[1],
    title: '貂蝉 · 猫影幻舞 - 绝世舞姬',
    link: '/heroes/7'
  },
  {
    id: 3,
    image: bannerImages[2],
    title: '韩信 · 白龙吟 - 国士无双',
    link: '/heroes/8'
  },
  {
    id: 4,
    image: bannerImages[3],
    title: '诸葛亮 · 武陵仙君 - 智谋之主',
    link: '/heroes/11'
  }
]

// 获取最新新闻
export const getLatestNews = (count: number = 6) => {
  return news.slice(0, count)
}

// 根据分类获取新闻
export const getNewsByCategory = (category: string) => {
  if (!category || category === 'all') return news
  return news.filter(item => item.category === category)
}

// 根据ID获取新闻
export const getNewsById = (id: number) => {
  return news.find(item => item.id === id)
}

// 新闻分类
export const newsCategories = [
  { key: 'all', name: '全部' },
  { key: '新英雄', name: '新英雄' },
  { key: '赛事', name: '赛事' },
  { key: '活动', name: '活动' },
  { key: '更新', name: '更新' }
]
