/*
* 实体属性定义
* @author 后天 2017.9.28
**/

module Entity
{
    export enum enPropEntity
    {
        PROP_ENTITY_ID = 0,   //实体的id
        PROP_ENTITY_POSX = 1, //位置 posx
        PROP_ENTITY_POSY = 2, //位置pos y
        PROP_ENTITY_MODELID = 3, //实体的模型ID
        PROP_ENTITY_ICON = 4,  //头像ID
        PROP_ENTITY_DIR = 5,   //实体的朝向
        PROP_CREATURE_LEVEL = 6, //等级
        PROP_CREATURE_HP = 7, //血
        PROP_CREATURE_MP = 8,  //蓝
        PROP_CREATURE_STATE = 9,  //实体的状态
        PROP_CREATURE_COLOR = 10,				//实体的颜色
        //下面这些是战斗属性
        PROP_CREATURE_MAXHP = 11,				//最大血，也就是生命
        PROP_CREATURE_MAXMP =  12,				//最大蓝，也就是内力
        PROP_CREATURE_PHYSICAL_ATTACK_MIN = 13, // 最小物理攻击
        PROP_CREATURE_PHYSICAL_ATTACK_MAX = 14, // 最大物理攻击
        PROP_CREATURE_MAGIC_ATTACK_MIN = 15,		// 最小魔法攻击
        PROP_CREATURE_MAGIC_ATTACK_MAX = 16,		// 最大魔法攻击

        PROP_CREATURE_WIZARD_ATTACK_MIN = 17,	// 最小道术攻击
        PROP_CREATURE_WIZARD_ATTACK_MAX = 18,	// 最大道术攻击

        PROP_CREATURE_PYSICAL_DEFENCE_MIN = 19,  // 最小物理防御
        PROP_CREATURE_PYSICAL_DEFENCE_MAX = 20,  // 最大物理防御

        PROP_CREATURE_MAGIC_DEFENCE_MIN = 21,	// 最小魔法防御
        PROP_CREATURE_MAGIC_DEFENCE_MAX = 22,	// 最大魔法防御

        PROP_CREATURE_HITVALUE = 23,				//准确
        PROP_CREATURE_DODVALUE = 24,				//敏捷

        PROP_CREATURE_MAGIC_HITRATE = 25,		//魔法命中
        PROP_CREATURE_MAGIC_DOGERATE = 26,		//魔法闪避
        PROP_CREATURE_TOXIC_DOGERATE = 27,		//毒物闪避

        PROP_CREATURE_HP_RENEW = 28,				//HP恢复
        PROP_CREATURE_MP_RENEW = 29,				//MP恢复
        PROP_CREATURE_TOXIC_RENEW = 30,			//毒物恢复

        PROP_CREATURE_LUCK = 31,					//幸运 
        PROP_CREATURE_CURSE = 32,			    //诅咒

        PROP_CREATURE_MOVEONESLOTTIME = 33,		//移动1格需要的时间，单位ms
        PROP_CREATURE_ATTACK_SPEED = 34,			//攻击速度
        PROP_ACTOR_BAG_WEIGHT = 35,      //负重
        PROP_ACTOR_BAG_MAX_WEIGHT = 36,	//背包最大负重

        PROP_ACTOR_EQUIP_WEIGHT = 37,	//当前装备负重
        PROP_ACTOR_EQUIP_MAX_WEIGHT = 38,	//装备最大负重

        PROP_ACTOR_WEAPON_WEIGHT = 39,	//武器的负重
        PROP_ACTOR_ARM_POWER = 40,		 //玩家的腕力

        PROP_ACTOR_WEAPONAPPEARANCE = 41, // 武器外观
        PROP_ACTOR_MOUNTAPPEARANCE = 42,		//坐骑外观
        PROP_ACTOR_SWINGAPPEARANCE = 43,		//翅膀外观

        //============存DB==================
        PROP_ACTOR_PK_MOD = 44,			//玩家的PK模式
        PROP_ACTOR_SEX = 45, //性别 0:男；1:女
        PROP_ACTOR_VOCATION = 46, //职业(0 无职业或者任何职业; 1 战士; 2 法师; 3 道士, tagActorVocation 定义在 script\interface\SystemParamDef.h)
        PROP_ACTOR_EXP = 47, //这个多1个字节,uint64的
        PROP_ACTOR_PK_VALUE = 48, //玩家的pk值(杀戮值)

        PROP_ACTOR_BAG_GRID_COUNT ,   //背包的格子数量
        PROP_ACTOR_STALL_GRID_COUNT, //低位是地摊格子数量,高位是玩家随身仓库的格子数量

        PROP_ACTOR_ZHANHUN,  //荣誉

        PROP_ACTOR_BIND_COIN,	//绑定金钱
        PROP_ACTOR_COIN, //非绑定金钱
        PROP_ACTOR_BIND_YUANBAO, //绑定元宝
        PROP_ACTOR_YUANBAO, //非绑定元宝
        PROP_ACTOR_CHARM, //魅力值，男的叫帅气值，女的叫魅力值

        PROP_ACTOR_GUILD_ID, //行会的ID
        PROP_ACTOR_TEAM_ID, //队伍的ID
        PROP_ACTOR_SOCIALMASK,// 社会关系的mask，是一些bit位合用的
        PROP_ACTOR_GUILDEXP, //玩家个人当前的贡献度
        PROP_ACTOR_MOUNT_EXP, //坐骑的经验

        PROP_ACTOR_DEFAULT_SKILL, //玩家的默认技能的ID(DB没有这个字段)


        PROP_ACTOR_MAX_EXP,     //玩家的最大经验，64位的

        PROP_ACTOR_ACIEVEPOINT,  //玩家的成就点

        PROP_ACTOR_CURTITLE,   //当前启用成就的id

        PROP_ACTOR_VIP_EXPIRETIME,	// vip过期时间，新版本含义已经变为‘周卡’的剩余时间

        PROP_ACTOR_VIPFLAG, // VIP开通标记，通过位掩码标记各种VIP类型。enVIPType定义着VIP类型，分别对应0-2位掩码。

        PROP_ACTOR_INNER_EXP,       //玩家的内功经验(db:activity)
        PROP_ACTOR_DRAW_YB_COUNT,  //提取元宝数目
        PROP_ACTOR_BATTLE_POWER,   //玩家的战力

        PROP_ACTOR_HONOUR,				//玩家的荣誉
        PROP_ACTOR_HONOUR_LV,			//玩家的荣誉等级
        PROP_ACTOR_HONOUR_USED,			///< 正在使用哪个荣誉
        PROP_ACTOR_HONOUR_BUFFDL,		//玩家荣誉buff时间
        PROP_ACTOR_DEPORT_GRID_COUNT,	//仓库的格子数目(空的，DB没有这个字段)
        PROP_ACTOR_CIRCLE,			//转数
        PROP_ACTOR_CIRCLE_SOUL,		//转生灵魄 转生修为
        PROP_ACTOR_ANGER,		//怒气		低两位表示当前怒气值 高两位表示最大怒气值
        PROP_ACTOR_INNER,		//玩家的内功值

        PROP_ACTOR_RIDEONID,			//骑乘的坐骑id
        PROP_ACTOR_RIDE_LEVEL,			//当前坐骑的等级
        PROP_ACTOR_TAKEON_RIDEID,		//佩戴的时效坐骑id(改为 高位：注入翅膀魂石(防)数量，低位：注入翅膀魂石(攻)数量)
        PROP_ACTOR_WARDROBE,			//衣橱(byte1-2:时装激活标志；byte3:穿戴的时装；byte4:衣橱等级)(nridebattle)
        PROP_ACTOR_STOREPOINT,			//商城积分
        PROP_ACTOR_RIDE_EXPIRED_TIME,	//时效坐骑过期时间(改为 低位：注入翅膀魂石(血)数量)

        PROP_ACTOR_WORK1DAY,							//活动与副本第1日未完成次数,这个多1个字节,uint64的
        PROP_ACTOR_WORK2DAY ,	//活动与副本第2日未完成次数,这个多1个字节,uint64的
        PROP_ACTOR_WORK3DAY,	//活动与副本第3日未完成次数,这个多1个字节,uint64的

        PROP_ACTOR_SIGNIN,	//每日签到标识
        PROP_ACTOR_DEPOT_YB,			//仓库元宝
        PROP_ACTOR_DEPOT_COIN,			//仓库金币
        PROP_ACTOR_AVOIDINJURY_MAX,		//最大真气值
        PROP_ACTOR_AVOIDINJURY,			//当前真气
        PROP_ACTOR_ONLINE_TIME,			//当天累积在线时间（秒），对应数据库字段：zhanxunpoint
        PROP_ACTOR_VIP_GRADE,			//vip等级
        PROP_ACTOR_VIP_POINT,			//vip积分(充值的元宝数)
        PROP_ACTOR_BAG_TIME ,			//背包中在线时间
        PROP_ACTOR_MAGIC_EQUIPID,		//魔法装备ID
        PROP_ACTOR_MAGIC_EQUIPEXP,		//魔法装备当前经验
        PROP_ACTOR_OFFICE,				//官职(gildid)(有排行榜,不能分高低位)
        PROP_ACTOR_WARDROBE_EXP,		//衣橱经验(gildexp)
        PROP_ACTOR_SWINGID,				//翅膀ID
        PROP_ACTOR_SWING_EXP,			//翅膀经验
        PROP_ACTOR_FLAG,				//玩家标志
        PROP_ACTOR_SOUL1,				//通灵境界1
        PROP_ACTOR_SOUL2,				//通灵境界2
        PROP_ACTOR_ENERGY,				//能量
        PROP_ACTOR_IMMORTAL,			//修真等级
        PROP_ACTOR_INNER_LEVEL,			//玩家的内功等级(db:innerlevel)
        PROP_ACTOR_SPIRITVALUE,			//战功值
        PROP_ACTOR_MERCENA_LEVEL,		//雇佣兵等级
        PROP_ACTOR_MERCENA_EXP,			//雇佣兵经验
        PROP_ACTOR_APOTHEOSIZE_LEVEL,	//封神等级
        PROP_ACTOR_APOTHEOSIZE_EXP,		//封神经验
        PROP_ACTOR_AVOIDINJURY_LEVEL,	//真气等级[潜能等级,分为：攻势等级(10bit)、健体等级(10bit),合用一个字段]
        PROP_ACTOR_AVOIDINJURY_EXP,		//真气经验(灵力值)
        PROP_ACTOR_WARPATH_ID,			//征途节点ID（byte0:征途节点ID,byte1:战将练体等级,byte2:军团ID)
        PROP_ACTOR_MAGIC_SOUL,			//符魄值
        PROP_ACTOR_GEM_CRYSTAL,			//宝石结晶
        PROP_ACTOR_SHIELD_SPIRIT,		//盾灵 护盾碎片
        PROP_ACTOR_PEARL_CHIP,			//灵珠碎片
        PROP_ACTOR_FEATHER,				//羽毛
        PROP_ACTOR_ALCHEMY,				//炼金值
        PROP_ACTOR_STONE,				//金刚石
        PROP_ACTOR_RING_CRYSTAL,		//特戒结晶
        PROP_ACTOR_VIGOUR,				//真元值
        PROP_ACTOR_PET_SPIRIT,			//灵宠值(战将灵力)
        PROP_ACTOR_HONOR_VALUE,			//荣誉值
        PROP_ACTOR_REALINJURY,		//真实伤害
        PROP_ACTOR_GATHER_VALUE,  //采集力量
        PROP_ACTOR_DUR_KILLTIMES, //连击的次数

        PROP_ACTOR_MOUNT_TYPE,	// 坐骑类型

        PROP_ACTOR_ZY,			//阵营类型

        PROP_ACTOR_HEAD_TITLE,	//头衔
        PROP_ACTOR_CURRENT_HEAD_TITLE, //当前选择的头衔（byte0:头衔1[0为没有选择],byte1:头衔2[0为没有选择],byte2:捐献排行[0为没有上榜]),需要广播
        PROP_ACTOR_MAX_INNER,	//玩家最大内功值
        PROP_ACTOR_DIAMOND_POINT,	//魂石评分
        PROP_ACTOR_HERO_DIAMOND_PINT,	//英雄评分
        PROP_ACTOR_GM_LEVEL,		//gm等级
        PROP_ACTOR_MAGICAPPEARANCE,	//法宝外观
        PROP_ACTOR_FOOTAPPEARANCE,	//足迹斗笠外观 (byte0:足迹外观, byte1:足迹特效; byte2:斗笠外观, byte3:斗笠特效)
        PROP_ACTOR_RIDE_PETID,			//当前出战坐骑的ID
        PROP_ACTOR_TITLE_ID,	//头衔ID(第2个头衔), 0 为没有头衔, 配置在: data\config\TitleIdText.lua
        PROP_ACTOR_AREA_EFFECTID,	//区域特效
        PROP_ACTOR_LEFTSPECIALRING,	//左边特戒道具id
        PROP_ACTOR_RIGHTSPECIALRING,	//右边特戒id
        PROP_ACTOR_REALINJURY_TOTAL, //总的真实伤害- 人物+装备+buff

        PROP_MAX_ACTOR,

    }

    export enum PropertyDataType
    {
        NORMAL = 0,
        INT = 1,
        UINT = 2,
        STRING = 3,
        FLOAT = 4,
        DOUBLE = 5
    }
    
}
