// 装备模拟数据
// Requirements: 1.4, 2.1, 4.1, 5.1

import type { Equipment } from '@/types'

export const equipment: Equipment[] = [
  // 攻击装备 (attack)
  {
    id: 1, name: '无尽战刃', icon: '/images/skills/1155.webp', category: 'attack', price: 2300,
    description: '传说中的神兵利器，拥有无与伦比的破坏力。',
    attributes: [{ name: '物理攻击', value: '+110' }, { name: '暴击率', value: '+20%' }],
    passive: '唯我无双：暴击伤害提升40%'
  },
  {
    id: 2, name: '破军', icon: '/images/skills/1212.webp', category: 'attack', price: 2400,
    description: '以破军之名，斩尽一切敌人。',
    attributes: [{ name: '物理攻击', value: '+180' }],
    passive: '破军：对生命值低于50%的敌人造成额外30%伤害'
  },
  {
    id: 3, name: '泣血之刃', icon: '/images/skills/1214.webp', category: 'attack', price: 1800,
    description: '染血的利刃，每一次攻击都能汲取敌人的生命。',
    attributes: [{ name: '物理攻击', value: '+100' }, { name: '物理吸血', value: '+25%' }]
  },
  {
    id: 4, name: '影刃', icon: '/images/skills/1224.png', category: 'attack', price: 1600,
    description: '暗影中的利刃，攻击如影随形。',
    attributes: [{ name: '物理攻击', value: '+60' }, { name: '攻击速度', value: '+35%' }, { name: '暴击率', value: '+20%' }],
    passive: '疾影：普攻后提升移动速度'
  },
  // 法术装备 (magic)
  {
    id: 5, name: '博学者之怒', icon: '/images/skills/1226.webp', category: 'magic', price: 2400,
    description: '蕴含着无穷智慧的法杖，能够释放毁灭性的魔法。',
    attributes: [{ name: '法术攻击', value: '+240' }],
    passive: '狂怒：法术攻击提升35%'
  },
  {
    id: 6, name: '虚无法杖', icon: '/images/skills/1231.webp', category: 'magic', price: 2100,
    description: '能够穿透一切魔法防御的神秘法杖。',
    attributes: [{ name: '法术攻击', value: '+150' }, { name: '法术穿透', value: '+45%' }]
  },
  {
    id: 7, name: '回响之杖', icon: '/images/skills/1240.webp', category: 'magic', price: 2000,
    description: '法术的回响在空气中震荡，造成额外的伤害。',
    attributes: [{ name: '法术攻击', value: '+100' }, { name: '移动速度', value: '+5%' }],
    passive: '回响：技能命中后造成额外法术伤害'
  },

  // 防御装备 (defense)
  {
    id: 8, name: '不祥征兆', icon: '/images/skills/1242.webp', category: 'defense', price: 2090,
    description: '散发着不祥气息的护甲，能够削弱敌人的攻击。',
    attributes: [{ name: '物理防御', value: '+300' }, { name: '最大生命', value: '+1200' }],
    passive: '不祥：受到攻击时降低敌人攻击速度和移动速度'
  },
  {
    id: 9, name: '魔女斗篷', icon: '/images/skills/1325.webp', category: 'defense', price: 2180,
    description: '魔女的斗篷，能够抵御强大的魔法攻击。',
    attributes: [{ name: '法术防御', value: '+360' }, { name: '最大生命', value: '+1000' }],
    passive: '魔女庇护：生命值低于30%时获得护盾'
  },
  {
    id: 10, name: '红莲斗篷', icon: '/images/skills/1336.webp', category: 'defense', price: 2020,
    description: '燃烧着红莲之火的斗篷，能够灼烧靠近的敌人。',
    attributes: [{ name: '物理防御', value: '+240' }, { name: '最大生命', value: '+1000' }],
    passive: '红莲之火：对周围敌人造成持续法术伤害'
  },
  // 移动装备 (movement)
  {
    id: 11, name: '急速战靴', icon: '/images/skills/1347.webp', category: 'movement', price: 710,
    description: '轻便的战靴，能够大幅提升移动速度。',
    attributes: [{ name: '攻击速度', value: '+25%' }, { name: '移动速度', value: '+60' }]
  },
  {
    id: 12, name: '抵抗之靴', icon: '/images/skills/1351.webp', category: 'movement', price: 710,
    description: '坚固的战靴，能够抵抗控制效果。',
    attributes: [{ name: '法术防御', value: '+110' }, { name: '移动速度', value: '+60' }, { name: '韧性', value: '+35%' }]
  },
  {
    id: 13, name: '影忍之足', icon: '/images/skills/1522.png', category: 'movement', price: 710,
    description: '忍者的战靴，能够减少受到的物理伤害。',
    attributes: [{ name: '物理防御', value: '+110' }, { name: '移动速度', value: '+60' }],
    passive: '忍术：减少15%普攻伤害'
  },
  {
    id: 17, name: '秘法之靴', icon: '/images/skills/1725.webp', category: 'movement', price: 710,
    description: '蕴含魔力的战靴，能够提升法术穿透。',
    attributes: [{ name: '法术穿透', value: '+75' }, { name: '移动速度', value: '+60' }]
  },
  // 打野装备 (jungle)
  {
    id: 14, name: '巨人之握', icon: '/images/skills/1737.webp', category: 'jungle', price: 1800,
    description: '巨人的力量凝聚于此，能够大幅提升生命值。',
    attributes: [{ name: '最大生命', value: '+800' }, { name: '物理攻击', value: '+40' }],
    passive: '野性：对野怪造成额外伤害'
  },
  {
    id: 15, name: '符文大剑', icon: '/images/skills/1155.webp', category: 'jungle', price: 1700,
    description: '刻满符文的大剑，蕴含着神秘的力量。',
    attributes: [{ name: '物理攻击', value: '+80' }, { name: '冷却缩减', value: '+10%' }],
    passive: '符文：击杀野怪后回复生命值和法力值'
  },
  {
    id: 16, name: '贪婪之噬', icon: '/images/skills/1212.webp', category: 'jungle', price: 1600,
    description: '贪婪的化身，能够吞噬敌人的生命。',
    attributes: [{ name: '物理攻击', value: '+60' }, { name: '物理吸血', value: '+10%' }],
    passive: '贪婪：击杀野怪获得额外金币'
  }
]

// 根据分类获取装备
export const getEquipmentByCategory = (category: string) => {
  if (!category || category === 'all') return equipment
  return equipment.filter(item => item.category === category)
}

// 根据ID获取装备
export const getEquipmentById = (id: number) => {
  return equipment.find(item => item.id === id)
}

// 获取所有分类
export const equipmentCategories = [
  { key: 'all', name: '全部' },
  { key: 'attack', name: '攻击' },
  { key: 'magic', name: '法术' },
  { key: 'defense', name: '防御' },
  { key: 'movement', name: '移动' },
  { key: 'jungle', name: '打野' }
]