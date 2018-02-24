module Config
{
     export class ItemConfig extends BaseConfig
     {

        private m_ArrItem = [];
        public Load(data):void
        {
            this.m_ArrItem = [];
           
            let pack:Net.Packet = new Net.Packet(data);
            let nCount:number = pack.ReadInt32();
            for(let i:number = 0;i < nCount;i++)
            {
                let pStdItem:StdItem = new StdItem();
                pStdItem.DeSerialize(pack);

                this.m_ArrItem[pStdItem._nID] = pStdItem;
            }
        }

        public FindItemById(nId:number):StdItem
        {
            if(this.m_ArrItem[nId] != null)
            {
                return this.m_ArrItem[nId] as StdItem;
            }
            return null;
        }
        
        public static GetItemTips(pUserItem:Config.UserItem):string
        {
            if(pUserItem == null)
            {
                return "";
            }
           
            let pStdItem:Config.StdItem =  Config.ConfigManager.GetInstance().GetItemConfig().FindItemById(pUserItem._wItemId);
            if(pStdItem == null)
            {
                return "";
            }
            let ret:string = "";
            ret = "<(type:1,color:FF0000)"+pStdItem.GetItemTypeName()+">\\";
            if(pStdItem._Vocation != Config.Vocation.Normal)
            {
                let szVocation = "";
                switch(pStdItem._Vocation)
                {
                    case Config.Vocation.Warrion:
                    {
                        szVocation = "战士";
                        break;
                    }
                    case Config.Vocation.Mage:
                    {
                        szVocation = "法师";
                        break;
                    }
                    case Config.Vocation.Tao:
                    {
                        szVocation = "道士";
                        break;
                    }
                }
                ret +=  "<(type:1)职业需求: "+szVocation+">\\"
            }
            if(pStdItem._nNeedLevel > 0)
            {
                 ret +=  "<(type:1)等级需求: "+pStdItem._nNeedLevel+">\\"
            }
            let nMinAttack:number =  pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_PHYSICAL_ATTACK_MIN);
            let nMaxAttack:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_PHYSICAL_ATTACK_MAX);
            if(nMinAttack > 0 || nMaxAttack > 0)
            {
                ret = ret + "<(type:1)物理攻击: ><(type:1)"+nMinAttack.toString()+"-"+nMaxAttack.toString()+">\\";
            }
            let nMinMagicAttack:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_MAGIC_ATTACK_MIN);
            let nMaxMagicAttack:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_MAGIC_ATTACK_MAX);
            if(nMinMagicAttack > 0 || nMaxMagicAttack > 0)
            {
                ret = ret + "<(type:1)魔法攻击: ><(type:1)"+nMinMagicAttack.toString()+"-"+nMaxMagicAttack.toString()+">\\";
            }

            let nMinDefense:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_PYSICAL_DEFENCE_MIN);
            let nMaxDefense:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_PYSICAL_DEFENCE_MAX);
            if(nMinDefense > 0 || nMaxDefense > 0)
            {
                ret = ret + "<(type:1)物理防御:><(type:1)"+nMinDefense.toString()+"-"+nMaxDefense.toString()+">\\";
            }

            let nMinMagicDefense:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_MAGIC_DEFENCE_MIN);
            let nMaxMagicDefense:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_MAGIC_DEFENCE_MAX);
            if(nMinMagicDefense > 0 || nMaxMagicDefense > 0)
            {
                ret = ret + "<(type:1)魔法防御:><(type:1)"+nMinMagicDefense.toString()+"-"+nMaxMagicDefense.toString()+">\\";
            }
            //准确
            let nHit:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_HITVALUE);
            if(nHit > 0)
            {
                ret = ret + "<(type:1)准确:><(type:1)"+nHit.toString()+">\\";
            }
            //敏捷
            let nDod:number = pStdItem.GetOtherAttr(Entity.enPropEntity.PROP_CREATURE_DODVALUE);
            if(nDod > 0)
            {
                ret = ret + "<(type:1)敏捷:><(type:1)"+nHit.toString()+">\\";
            }
            //描述需要自动分行
            if(pStdItem._szDesc.length > 0)
            {
                let nWidth:number = 320;
                let pItemTipsDialog:UI.ItemTips = UI.UIManager.GetInstance().GetItemTipsDialog();
                if(pItemTipsDialog != null)
                {
                    let nWidth:number = pItemTipsDialog.width;
                }
                let szDesc = pStdItem._szDesc;
                let lineCount:number = parseInt((nWidth / Config.GlobalConfig._Instance._nFontSize).toString()) - 1/*不填满宽度-减去一个文字*/;
                let nLoop:number = parseInt((pStdItem._szDesc.length / lineCount).toString()) + 1;
                for(let i:number = 0;i < nLoop;i++)
                {
                   ret = ret +  "<(type:1,color:FFFF2A)"+szDesc.substr(0,lineCount)+">\\";
                   szDesc = szDesc.substr(lineCount,szDesc.length - lineCount );
                }
                
            }
            return ret;
        }
     }
}