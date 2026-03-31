// 英雄模拟数据
// Requirements: 1.4, 2.1, 4.1, 5.1

import type { Hero } from '@/types'

export const heroes: Hero[] = [
  {
    id: 1,
    name: '亚瑟',
    title: '永恒之誓',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg',
    role: 'warrior',
    difficulty: 1,
    skills: [
      { id: 101, name: '圣光守护', icon: '/images/jn/13100.webp', description: '亚瑟每损失3%最大生命值，将增加1%伤害减免，最多增加30%伤害减免。', cooldown: 0 },
      { id: 102, name: '誓约之盾', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/16610.png', description: '亚瑟向前冲锋，对路径上的敌人造成物理伤害并沉默1秒。', cooldown: 8 },
      { id: 103, name: '回旋打击', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/16620.png', description: '亚瑟挥动圣剑，对周围敌人造成物理伤害并标记敌人。', cooldown: 5 },
      { id: 104, name: '圣剑裁决', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/16630.png', description: '亚瑟跃向目标，召唤圣剑从天而降，对目标造成真实伤害。', cooldown: 12 }
    ],
    skins: [
      { id: 1001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166-bigskin-1.jpg' },
      { id: 1002, name: '死亡骑士', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166-bigskin-2.jpg', price: 288 },
      { id: 1003, name: '狮心王', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166-bigskin-3.jpg', price: 888 }
    ],
    story: '亚瑟是古代王国的守护骑士，他以圣剑和盾牌守护着王国的和平。'
  },
  {
    id: 2,
    name: '妲己',
    title: '魅惑之狐',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg',
    role: 'mage',
    difficulty: 1,
    skills: [
      { id: 201, name: '失心', icon: '/images/jn/17900.webp', description: '妲己的技能命中敌人后，会降低目标的魔法防御。', cooldown: 0 },
      { id: 202, name: '灵魂冲击', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/10910.png', description: '妲己释放狐火，对前方敌人造成法术伤害。', cooldown: 6 },
      { id: 203, name: '偶像魅力', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/10920.png', description: '妲己向指定方向释放魅惑之力，命中敌人后造成眩晕。', cooldown: 10 },
      { id: 204, name: '女王崇拜', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/10930.png', description: '妲己召唤5道狐火攻击附近的敌人，造成大量法术伤害。', cooldown: 30 }
    ],
    skins: [
      { id: 2001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109-bigskin-1.jpg' },
      { id: 2002, name: '热情桑巴', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109-bigskin-2.jpg', price: 288 },
      { id: 2003, name: '仙境爱丽丝', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109-bigskin-3.jpg', price: 888 }
    ],
    story: '妲己是一只修炼千年的九尾狐，她拥有迷惑人心的魅力。'
  },

  {
    id: 3,
    name: '李白',
    title: '青莲剑仙',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg',
    role: 'assassin',
    difficulty: 3,
    skills: [
      { id: 301, name: '侠客行', icon: '/images/jn/13100.webp', description: '李白普攻命中敌人4次后，下一次普攻将触发剑气。', cooldown: 0 },
      { id: 302, name: '将进酒', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/13110.png', description: '李白向指定方向突进，对路径上的敌人造成物理伤害。', cooldown: 12 },
      { id: 303, name: '神来之笔', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/13120.png', description: '李白以自身为中心释放剑气，对周围敌人造成物理伤害。', cooldown: 6 },
      { id: 304, name: '青莲剑歌', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/13130.png', description: '李白化身剑气，进入不可选中状态。', cooldown: 25 }
    ],
    skins: [
      { id: 3001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131-bigskin-1.jpg' },
      { id: 3002, name: '范海辛', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131-bigskin-2.jpg', price: 788 },
      { id: 3003, name: '千年之狐', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131-bigskin-3.jpg', price: 1688 },
      { id: 3004, name: '凤求凰', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131-bigskin-4.jpg', price: 1688 }
    ],
    story: '李白是一位传奇的剑客诗人，他的剑术与诗才同样出众。'
  },
  {
    id: 4,
    name: '后羿',
    title: '射日神弓',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg',
    role: 'marksman',
    difficulty: 1,
    skills: [
      { id: 401, name: '迟缓之箭', icon: '/images/jn/18700.webp', description: '后羿的普攻会减速目标，持续2秒。', cooldown: 0 },
      { id: 402, name: '多重箭矢', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/16910.png', description: '后羿的普攻变为散射，同时攻击多个目标。', cooldown: 10 },
      { id: 403, name: '落日余晖', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/16920.png', description: '后羿向指定方向射出一支箭矢。', cooldown: 8 },
      { id: 404, name: '灼日之矢', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/16930.png', description: '后羿向指定方向射出一支强力箭矢。', cooldown: 40 }
    ],
    skins: [
      { id: 4001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169-bigskin-1.jpg' },
      { id: 4002, name: '精灵王', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169-bigskin-2.jpg', price: 288 },
      { id: 4003, name: '黄金射手座', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169-bigskin-3.jpg', price: 888 }
    ],
    story: '后羿是上古时代的神射手，他曾射下九个太阳。'
  },
  {
    id: 5,
    name: '蔡文姬',
    title: '乱世才女',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg',
    role: 'support',
    difficulty: 2,
    skills: [
      { id: 501, name: '长歌行', icon: '/images/jn/18400.webp', description: '蔡文姬的技能命中敌人后，会为附近的友军回复生命值。', cooldown: 0 },
      { id: 502, name: '胡笳乐', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/18410.png', description: '蔡文姬弹奏胡笳，对周围敌人造成法术伤害并减速。', cooldown: 7 },
      { id: 503, name: '思无邪', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/18420.png', description: '蔡文姬为指定友军回复生命值并提供护盾。', cooldown: 10 },
      { id: 504, name: '忘忧曲', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/18430.png', description: '蔡文姬演奏忘忧曲，持续为周围友军回复生命值。', cooldown: 60 }
    ],
    skins: [
      { id: 5001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184-bigskin-1.jpg' },
      { id: 5002, name: '繁星吟游', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184-bigskin-2.jpg', price: 588 },
      { id: 5003, name: '花朝月夕', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184-bigskin-3.jpg', price: 888 }
    ],
    story: '蔡文姬是东汉末年的才女，精通音律和文学。'
  },
  {
    id: 6,
    name: '项羽',
    title: '霸王',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg',
    role: 'tank',
    difficulty: 2,
    skills: [
      { id: 601, name: '霸体', icon: '/images/jn/52100.webp', description: '项羽生命值低于50%时，获得额外的物理和法术防御。', cooldown: 0 },
      { id: 602, name: '无畏冲锋', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/13510.png', description: '项羽向前冲锋，将路径上的敌人击退。', cooldown: 10 },
      { id: 603, name: '破釜沉舟', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/13520.png', description: '项羽挥动战戟，对周围敌人造成物理伤害并减速。', cooldown: 8 },
      { id: 604, name: '霸王斩', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/13530.png', description: '项羽跃向目标区域，对范围内敌人造成物理伤害并击飞。', cooldown: 35 }
    ],
    skins: [
      { id: 6001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135-bigskin-1.jpg' },
      { id: 6002, name: '霸王别姬', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135-bigskin-2.jpg', price: 288 },
      { id: 6003, name: '西楚霸王', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135-bigskin-3.jpg', price: 888 }
    ],
    story: '项羽是秦末的霸王，力能扛鼎，勇冠三军。'
  },

  {
    id: 7,
    name: '貂蝉',
    title: '绝世舞姬',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg',
    role: 'mage',
    difficulty: 2,
    skills: [
      { id: 701, name: '落红', icon: '/images/jn/52400.webp', description: '貂蝉的技能命中敌人后，会在敌人身上留下印记。', cooldown: 0 },
      { id: 702, name: '落雁', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/14110.png', description: '貂蝉向指定方向释放花瓣。', cooldown: 4 },
      { id: 703, name: '闭月', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/14120.png', description: '貂蝉向指定方向位移。', cooldown: 8 },
      { id: 704, name: '羞花', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/14130.png', description: '貂蝉在指定区域绽放花朵。', cooldown: 20 }
    ],
    skins: [
      { id: 7001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141-bigskin-1.jpg' },
      { id: 7002, name: '圣诞恋歌', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141-bigskin-2.jpg', price: 288 },
      { id: 7003, name: '异域舞娘', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141-bigskin-3.jpg', price: 888 },
      { id: 7004, name: '猫影幻舞', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141-bigskin-4.jpg', price: 1688 }
    ],
    story: '貂蝉是东汉末年的绝世美人，她的舞姿倾国倾城。'
  },
  {
    id: 8,
    name: '韩信',
    title: '国士无双',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg',
    role: 'assassin',
    difficulty: 3,
    skills: [
      { id: 801, name: '无双', icon: '/images/jn/52900.webp', description: '韩信的技能命中敌人后，会重置普攻。', cooldown: 0 },
      { id: 802, name: '无情冲锋', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/15010.png', description: '韩信向指定方向冲锋。', cooldown: 8 },
      { id: 803, name: '背水一战', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/15020.png', description: '韩信挥剑横扫。', cooldown: 6 },
      { id: 804, name: '国士无双', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/15030.png', description: '韩信向指定方向发起冲锋。', cooldown: 40 }
    ],
    skins: [
      { id: 8001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150-bigskin-1.jpg' },
      { id: 8002, name: '街头霸王', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150-bigskin-2.jpg', price: 288 },
      { id: 8003, name: '白龙吟', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150-bigskin-3.jpg', price: 1688 },
      { id: 8004, name: '飞衡', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150-bigskin-4.jpg', price: 1688 }
    ],
    story: '韩信是西汉开国功臣，被誉为"兵仙"。'
  },
  {
    id: 9,
    name: '鲁班七号',
    title: '机关造物',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg',
    role: 'marksman',
    difficulty: 1,
    skills: [
      { id: 901, name: '机关枪', icon: '/images/jn/64000.webp', description: '鲁班七号的普攻会连续射击。', cooldown: 0 },
      { id: 902, name: '河豚手雷', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/11210.png', description: '鲁班七号投掷河豚手雷。', cooldown: 8 },
      { id: 903, name: '无敌鲨嘴炮', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/11220.png', description: '鲁班七号召唤鲨嘴炮。', cooldown: 12 },
      { id: 904, name: '空中支援', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/11230.png', description: '鲁班七号呼叫空中支援。', cooldown: 50 }
    ],
    skins: [
      { id: 9001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112-bigskin-1.jpg' },
      { id: 9002, name: '木偶奇遇记', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112-bigskin-2.jpg', price: 288 },
      { id: 9003, name: '电玩小子', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112-bigskin-3.jpg', price: 888 },
      { id: 9004, name: '星空梦想', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112-bigskin-4.jpg', price: 1688 }
    ],
    story: '鲁班七号是鲁班大师创造的机关人偶。'
  },
  {
    id: 10,
    name: '孙尚香',
    title: '千金重弩',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg',
    role: 'marksman',
    difficulty: 2,
    skills: [
      { id: 1001, name: '劲弩', icon: '/images/jn/13100.webp', description: '孙尚香的普攻会附带额外的物理伤害。', cooldown: 0 },
      { id: 1002, name: '翻滚突袭', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/11110.png', description: '孙尚香向指定方向翻滚。', cooldown: 6 },
      { id: 1003, name: '红莲爆弹', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/11120.png', description: '孙尚香向指定方向投掷爆弹。', cooldown: 10 },
      { id: 1004, name: '无畏火炮', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/11130.png', description: '孙尚香架起重弩。', cooldown: 35 }
    ],
    skins: [
      { id: 10001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111-bigskin-1.jpg' },
      { id: 10002, name: '杀手不太冷', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111-bigskin-2.jpg', price: 288 },
      { id: 10003, name: '蔷薇恋人', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111-bigskin-3.jpg', price: 888 },
      { id: 10004, name: '末日机甲', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111-bigskin-4.jpg', price: 1688 }
    ],
    story: '孙尚香是东吴的郡主，性格豪爽，武艺高强。'
  },

  {
    id: 11,
    name: '诸葛亮',
    title: '绝代智谋',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg',
    role: 'mage',
    difficulty: 3,
    skills: [
      { id: 1101, name: '策谋之刻', icon: '/images/jn/17900.webp', description: '诸葛亮的技能命中敌人后，会获得策谋之刻印记。', cooldown: 0 },
      { id: 1102, name: '东风破袭', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/19010.png', description: '诸葛亮向指定方向释放法球。', cooldown: 3 },
      { id: 1103, name: '时空穿梭', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/19020.png', description: '诸葛亮向指定方向位移。', cooldown: 10 },
      { id: 1104, name: '元气弹', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/19030.png', description: '诸葛亮蓄力释放元气弹。', cooldown: 30 }
    ],
    skins: [
      { id: 11001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190-bigskin-1.jpg' },
      { id: 11002, name: '黄金分割率', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190-bigskin-2.jpg', price: 288 },
      { id: 11003, name: '武陵仙君', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190-bigskin-3.jpg', price: 1688 }
    ],
    story: '诸葛亮是三国时期蜀汉的丞相，被誉为"卧龙"。'
  },
  {
    id: 12,
    name: '吕布',
    title: '天下无双',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg',
    role: 'warrior',
    difficulty: 2,
    skills: [
      { id: 1201, name: '饕餮血统', icon: '/images/jn/18400.webp', description: '吕布的普攻会附带真实伤害。', cooldown: 0 },
      { id: 1202, name: '方天画戟', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/12310.png', description: '吕布向指定方向挥动方天画戟。', cooldown: 7 },
      { id: 1203, name: '贪狼之握', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/12320.png', description: '吕布向指定方向冲锋。', cooldown: 10 },
      { id: 1204, name: '魔神降世', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/12330.png', description: '吕布跃向目标区域。', cooldown: 25 }
    ],
    skins: [
      { id: 12001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123-bigskin-1.jpg' },
      { id: 12002, name: '野性能量', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123-bigskin-2.jpg', price: 288 },
      { id: 12003, name: '天魔缭乱', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123-bigskin-3.jpg', price: 1688 },
      { id: 12004, name: '圣诞狂欢', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123-bigskin-4.jpg', price: 888 }
    ],
    story: '吕布是东汉末年的猛将，被誉为"人中吕布，马中赤兔"。'
  },
  {
    id: 13,
    name: '庄周',
    title: '南华真人',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg',
    role: 'support',
    difficulty: 2,
    skills: [
      { id: 1301, name: '自然意志', icon: '/images/jn/18700.webp', description: '庄周每隔一段时间会解除自身的控制效果。', cooldown: 0 },
      { id: 1302, name: '蝴蝶效应', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/11310.png', description: '庄周释放蝴蝶。', cooldown: 5 },
      { id: 1303, name: '化蝶飞', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/11320.png', description: '庄周化身蝴蝶。', cooldown: 8 },
      { id: 1304, name: '逍遥游', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/11330.png', description: '庄周进入逍遥状态。', cooldown: 50 }
    ],
    skins: [
      { id: 13001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113-bigskin-1.jpg' },
      { id: 13002, name: '云端筑梦师', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113-bigskin-2.jpg', price: 888 },
      { id: 13003, name: '玄嵩', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113-bigskin-3.jpg', price: 1688 }
    ],
    story: '庄周是战国时期的哲学家，道家学派的代表人物。'
  },
  {
    id: 14,
    name: '程咬金',
    title: '混世魔王',
    avatar: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg',
    role: 'tank',
    difficulty: 1,
    skills: [
      { id: 1401, name: '不死之身', icon: '/images/jn/52100.webp', description: '程咬金生命值低于30%时，每秒回复最大生命值的4%。', cooldown: 0 },
      { id: 1402, name: '一往无前', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/14410.png', description: '程咬金向前冲锋。', cooldown: 8 },
      { id: 1403, name: '激流勇进', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/14420.png', description: '程咬金挥动大斧。', cooldown: 6 },
      { id: 1404, name: '正义潜能', icon: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/14430.png', description: '程咬金爆发潜能。', cooldown: 60 }
    ],
    skins: [
      { id: 14001, name: '经典', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144-bigskin-1.jpg' },
      { id: 14002, name: '爱与正义', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144-bigskin-2.jpg', price: 288 },
      { id: 14003, name: '功夫厨神', image: 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144-bigskin-3.jpg', price: 888 }
    ],
    story: '程咬金是隋唐时期的猛将，性格豪爽，武艺高强。'
  }
]

// 获取热门英雄
export const popularHeroes = heroes.slice(0, 6)

// 根据角色获取英雄
export const getHeroesByRole = (role: string) => {
  if (!role || role === 'all') return heroes
  return heroes.filter(hero => hero.role === role)
}

// 根据ID获取英雄
export const getHeroById = (id: number) => {
  return heroes.find(hero => hero.id === id)
}

// 搜索英雄
export const searchHeroes = (keyword: string) => {
  if (!keyword) return heroes
  const lowerKeyword = keyword.toLowerCase()
  return heroes.filter(hero => 
    hero.name.toLowerCase().includes(lowerKeyword) ||
    hero.title.toLowerCase().includes(lowerKeyword)
  )
}