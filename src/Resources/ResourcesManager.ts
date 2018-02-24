module Resources
{
    export class ResourcesManager
    {
        public static readonly _Instance:ResourcesManager = new ResourcesManager();
        private static readonly FREETIME = 60 * 1000 * 1; //三分钟释放一次
        private  m_NpcGroup:SRPackGroup; //npc动画资源组
        private  m_HumanGroup:SRPackGroup;   //角色动画资源组
        private m_WeaponBoyGroup:SRPackGroup; //角色男孩武器资源组
        private m_WeaponGirlGroup:SRPackGroup; //角色女孩武器资源组
        private m_ShadowGroup:SRPackGroup;  //影子资源组
        private m_MonsterGroup:SRPackGroup; //怪物资源组
        private m_SkillEffect:SRPackGroup;  //技能特效资源组
        private m_OtherEffect:SRPackGroup;  //其他特效
        private m_EmotionGroup:SRPackGroup; //表情动画资源组
        private m_ArrSprite = [];   //碎图片资源包
        //需要定时释放的资源包
        private m_FreePackGroup:Array<SRPackGroup> = new Array<SRPackGroup>();
        private m_nLastFreeTick:number = 0;
        
        constructor()
        {
            this.m_NpcGroup = new SRPackGroup("npc");
            this.m_HumanGroup = new SRPackGroup("human/Xmodel");
            this.m_WeaponBoyGroup = new SRPackGroup("human/Xweapon/boy");
            this.m_WeaponGirlGroup = new SRPackGroup("human/Xweapon/girl")
            this.m_ShadowGroup = new SRPackGroup("human/shadow");
            this.m_MonsterGroup = new SRPackGroup("monster");
            this.m_SkillEffect = new SRPackGroup("skilleffect");
            this.m_OtherEffect = new SRPackGroup("othereffect");
            this.m_EmotionGroup = new SRPackGroup("emotion");

            //加入到定时释放中
            this.m_FreePackGroup.push(this.m_NpcGroup);
            this.m_FreePackGroup.push(this.m_HumanGroup);
            this.m_FreePackGroup.push(this.m_WeaponBoyGroup);
            this.m_FreePackGroup.push(this.m_WeaponGirlGroup);
            this.m_FreePackGroup.push(this.m_ShadowGroup);
            this.m_FreePackGroup.push(this.m_MonsterGroup);
            this.m_FreePackGroup.push(this.m_SkillEffect);
            this.m_FreePackGroup.push(this.m_OtherEffect);
            this.m_FreePackGroup.push(this.m_EmotionGroup);
        }

        public Update(nCurrentTick:number):void
        {
            if(this.m_nLastFreeTick == 0 )
            {
                this.m_nLastFreeTick = nCurrentTick + ResourcesManager.FREETIME;
            }

            if(nCurrentTick >= this.m_nLastFreeTick)
            {
                for(let i:number = 0;i < this.m_FreePackGroup.length;i++)
                {
                    let packGroup:SRPackGroup = this.m_FreePackGroup[i];
                    packGroup.CheckFreeMemory();
                }

                //碎图片
                for(let key in this.m_ArrSprite)
                {
                    if(this.m_ArrSprite[key] != null && 
                       this.m_ArrSprite[key].CheckFreeMemory())
                    {
                        this.m_ArrSprite[key] = null;
                    }
                }
                this.m_nLastFreeTick = nCurrentTick + ResourcesManager.FREETIME;
            }
        }
        public GetNpcPack(nIndex:number):SRPack
        {
            return this.m_NpcGroup.GetPack(nIndex);
        }

        public GetHumanPackage(nIndex:number):SRPack
        {
            return this.m_HumanGroup.GetPack(nIndex);
        }
        public GetHumanShadowPackage(nSex:number):SRPack
        {
            return this.m_ShadowGroup.GetPack(nSex);
        }

        public GetEmotionPackage(nIndex:number):SRPack
        {
            return this.m_EmotionGroup.GetPack(nIndex);
        }
        public GetWeaponPackage(nIndex:number,nSex:number):SRPack
        {
            if(nSex == 0)
            {
                return this.m_WeaponBoyGroup.GetPack(nIndex);
            }
            return this.m_WeaponGirlGroup.GetPack(nIndex);
        }

        public GetMonsterPackage(nIndex:number):SRPack
        {
            return this.m_MonsterGroup.GetPack(nIndex);
        }

        public GetSkillEffectPackage(nIndex:number):SRPack
        {
            return this.m_SkillEffect.GetPack(nIndex);
        }

        public GetOtherEffect(szName:string):SRPack
        {
            return this.m_OtherEffect.GetPackByName(szName);
        }

       public GetSpriteForURL(szUrl:string):Laya.Sprite
       {
           if( this.m_ArrSprite[szUrl] != null)
           {
               return  this.m_ArrSprite[szUrl].GetSprite();
           }
            this.GetResSprite(szUrl);
            let pResSprite:ResSprite = new ResSprite();
            this.m_ArrSprite[szUrl] = pResSprite;
            return pResSprite.GetSprite();
       }
        public GetMiniMapImage(szMapFile:string):Laya.Sprite
        {
            szMapFile = szMapFile.substr(0,szMapFile.length - 4);
            let sFile:string = "data/"+szMapFile+".jpg";
            if(this.m_ArrSprite[sFile] != null)
            {
                return this.m_ArrSprite[sFile].GetSprite();
            }
            
            return this.GetSpriteForURL(sFile);
        }
        public GetItemIconImage(nItemIconId:number):Laya.Sprite
        {
            let sFile:string = "data/itemicon/"+nItemIconId.toString()+".png";
            if(this.m_ArrSprite[sFile] != null)
            {
                return this.m_ArrSprite[sFile].GetSprite();
            }
            return this.GetSpriteForURL(sFile);
        }
        private GetResSprite(szFile:string):void
        {
     
            Laya.loader.load(szFile,Laya.Handler.create(this,this.onLoadedResSprite));
        }

        private onLoadedResSprite(data):void
        {
            let pTex:Laya.Texture = data as Laya.Texture;
            if(pTex != null )
            {
                let pResSprite:ResSprite = this.m_ArrSprite[pTex.url];
                pResSprite.SetTexture(pTex);
            }
        }
    }
}