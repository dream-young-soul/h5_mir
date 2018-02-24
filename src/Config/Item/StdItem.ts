module Config
{
    export enum StdItemType
    {
        itUndefinedType = 0,		//未定义类型的物品
        itWeapon = 1,				//武器
        itDress = 2,				//衣服
        itHelmet = 3,				//头盔
        itNecklace = 4,				//项链
        itDecoration = 5,            //勋章
        itBracelet = 6,			//手镯
        itRing = 7,					//戒指
        itGirdle = 8,				//腰带
        itShoes = 9,				//鞋子
        itEquipDiamond = 10,          //宝石
        itMeterial = 11,             //材料 玉佩 护符
        itFashionDress = 12,          //神甲
        itSwing = 13,					//翅膀 
        itWeaponExtend = 14,			//神器
        itFootPrint = 15,				//足迹(斗笠)
        itShield = 16,				//盾牌
        itSeal = 17,                //官印
        itSpecialRing = 18,         //特殊戒指
        itMagicWeapon = 19,			//法宝
        itEarring = 20,				//耳坠
        itShoulderPads = 21,		//护肩
        itElbowPads = 22,			//护肘
        itKneecap = 23,				//护膝
        itAnklePad = 24,			//护踝(官职)
        itHeartMirror = 25,			//护心镜
        itMaskedVeil = 26,			//蒙面巾
        itRelease = 27,				//预留
        itZodiacShu = 28,				//鼠
        itZodiacNiu = 29,					//牛
        itZodiacHu = 30,						//虎
        itZodiacTu = 31,						//兔
        itZodiacLong = 32,					//龙
        itZodiacShe = 33,					//蛇
        itZodiacMa = 34,						//马
        itZodiacYang = 35,					//羊
        itZodiacHou = 36,					//猴
        itZodiacJi = 37,						//鸡
        itZodiacGou = 38,					//狗
        itZodiacZhu = 39,					//猪
        itGodHelmetPos = 40,					//神盔 
        itGodNecklacePos = 41,				//神链 
        itGodLeftBraceletPos = 42,			//左神镯 
        itGodRightBraceletPos = 43,			//右神镯
        itGodLeftRingPos = 44,				//左神戒 
        itGodRightRingPos = 45,				//右神戒 
        itGodGirdlePos = 46,					//神带   
        itGodShoesPos = 47,					//神靴  
        itSpecialRingEx = 48,				//特殊戒指
        itEquipMax,                 //最大的装备ID

        itHeroEquipMin = 49,
        itHeroNecklace = 50,          //英雄的项链
        itHeroCuff = 51,              //英雄的手镯
        itHeroDecorations = 52,       //英雄的戒指
        itHeroBelt = 53,			//英雄的腰带
        itHeroShoes = 54,			//英雄的鞋子
        //itHeroArmor =53,             //英雄的护甲 
        itHeroEquipMax,              //最大的装备ID


        itQuestItem = 101,			//任务物品
        itFunctionItem = 102,		//功能物品，可以双击执行功能脚本的
        itMedicaments = 103,		//普通药品
        itFastMedicaments = 104,	//速回药品
        itItemDiamond = 105,          //宝石
        itItemEquivalence = 106,     //等价道具，可以用来出售换钱的道具
        itItemEquipEnhance = 107,    //装备强化类，比如强化石等
        itItemSkillMiji = 108,       //技能的秘籍
        itItemPetSkill = 109,         //宠物的技能书
        itPetMedicaments = 110,		//宠物普通药品
        itPetFastMedicaments = 111,	//宠物速回药品
        itPetSkinChange = 112,	    //宠物换皮肤道具
        itHpPot = 113,              //经验玉，吸收杀怪经验
        itMine = 114,                //矿物，和普通物品比它的耐久表示纯度和最大纯度
        itMagicItem = 115,			//法宝
        itMagicBead = 116,			//魔珠
        itMagicEquip = 117,			//魔法装备
        itGild = 118,				//金身
        itZodiac = 119,				//生肖装备
        itRuneDebris = 120,			//符文碎片
        itItemTypeCount,			//物品类型的数量，最大值，类型值不一定是连续的
    }
    export class StdItem
    {
        public _nID:number = 0;        //道具id
        public _szName:string = "";  //道具名称
        public _szDesc:string = "";  //道具描述
        public _Type:StdItemType = StdItemType.itUndefinedType;   //道具类型
        public _nIcon:number = 0;          //图标编号
        public _nShape:number = 0;         //外观编号
        public _nAmount:number = 0;        //最大叠加数量
        public  _Vocation:Config.Vocation;   //所需职业
        public  _Sex:Sex;             //所需性别
        public _nNeedLevel:number;         //所需等级
       
        public _OtherAttr = [];
        public _RateAttr = [] ;
        public DeSerialize(pack:Net.Packet):void
        {
            this._OtherAttr = [];
            this._RateAttr = [];
            this._nID = pack.ReadInt32();
            this._szName = pack.ReadCustomString();
            this._szDesc = pack.ReadCustomString();
            this._Type = <StdItemType> pack.ReadUByte();
            this._nIcon = pack.ReadInt32();
            this._nShape = pack.ReadInt32();
            this._nAmount = pack.ReadInt32();
            this._Vocation = <Vocation>pack.ReadUByte();
            this._Sex = <Sex> pack.ReadUByte();
            this._nNeedLevel = pack.ReadUByte();
            
            //基础属性
            let nAmount:number = pack.ReadUByte();
            for(let i:number = 0;i < nAmount;i++)
            {
                let nType:Entity.enPropEntity = <Entity.enPropEntity>pack.ReadUByte();
                let nValue:number = pack.ReadInt32();
                this._OtherAttr.push({type:nType,value:nValue});
            }
            //倍率属性
             nAmount = pack.ReadUByte();
             for(let i:number = 0;i < nAmount;i++)
             {
                let nType:Entity.enPropEntity = <Entity.enPropEntity>pack.ReadUByte();
                let fValue:number = pack.ReadFloat();
                this._RateAttr.push({type:nType,value:fValue});
             }

        }
        public GetOtherAttr(type:Entity.enPropEntity):number
        {
            for(let i:number = 0;i < this._OtherAttr.length;i++)
            {
                let pObj = this._OtherAttr[i];
                if(<Entity.enPropEntity>pObj.type == type)
                {
                    return parseInt(pObj.value);
                }
            }
            return 0;
        }
        public GetShowName():string
        {
            let szIndex:string = this._nID.toString();
            let nIndex:number = parseInt(szIndex.substr(szIndex.length-1,1));
            switch(nIndex)
            {
                case 1:
                {
                    return "良品"+this._szName;
                }
                case 2:
                {
                    return "上品" + this._szName;
                }
                case 3:
                {
                    return "精品" + this._szName;
                }
                case 4:
                {
                    return "极品" + this._szName;
                }
                default:
                {
                    return this._szName;
                }
            }
        }
        public GetNameColor():string
        {
             let szIndex:string = this._nID.toString();
            let nIndex:number = parseInt(szIndex.substr(szIndex.length-1,1));
            switch(nIndex)
            {
                case 1:
                {
                    return "#33FF00";
                }
                case 2:
                {
                    return "#0033CC" ;
                }
                case 3:
                {
                    return "#FF0000";
                }
                case 4:
                {
                    return "#D926C7" ;
                }
                default:
                {
                    return "#FFFFFF";
                }
            }
        }
        public GetItemTypeName():string
        {
            switch(this._Type)
            {
                case StdItemType.itWeapon:
                {
                    return "武器";
                }
                case StdItemType.itDress:
                {
                    return "衣服";
                }
                case StdItemType.itHelmet:
                {
                    return "头盔";
                }
                case StdItemType.itNecklace:
                {
                    return "项链";
                }
                case StdItemType.itDecoration:
                {
                    return "护符";
                }
                case StdItemType.itBracelet:
                {
                    return "手镯";
                }
                case StdItemType.itRing:
                {
                    return "戒指";
                }
                case StdItemType.itGirdle:
                {
                    return "腰带";
                }
                case StdItemType.itShoes:
                {
                    return "鞋子";
                }
            }
            return "特殊物品"
        }
    }
}