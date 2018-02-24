module Config
{
    export class ConfigManager
    {
        private static _Instance = null;
        private m_LoadItem = [];
        private m_ArrCfg:Array<BaseConfig> ;
        public static GetInstance():ConfigManager
        {
            if(ConfigManager._Instance == null)
            {
                ConfigManager._Instance = new ConfigManager();
            }
            return ConfigManager._Instance;
        }

        public LoadConfig(arrItem):void
        {
            this.m_LoadItem = 
            [
              {url:"data/config/skill.dat",type:Laya.Loader.BUFFER,CType:ConfigType.Skill},
              {url:"data/config/effect.dat",type:Laya.Loader.BUFFER,CType:ConfigType.Effect},
              {url:"data/config/item.dat",type:Laya.Loader.BUFFER,CType:ConfigType.Item},
               {url:"data/config/npc.dat",type:Laya.Loader.BUFFER,CType:ConfigType.Npc},
            ]
            for(let i:number = 0;i < this.m_LoadItem.length;i++)
            {
                arrItem.push(this.m_LoadItem[i]);
            }
        }
        public GetSkillConfig():SkillConfig
        {
            return this.m_ArrCfg[ConfigType.Skill] as SkillConfig;
        }

        public GetEffectConfig():EffectConfig
        {
            return this.m_ArrCfg[ConfigType.Effect] as EffectConfig;
        }

        public GetItemConfig():ItemConfig
        {
            return this.m_ArrCfg[ConfigType.Item] as ItemConfig;
        }

        public GetNpcConfig():NpcConfig
        {
            return this.m_ArrCfg[ConfigType.Npc] as NpcConfig;
        }
        public OnLoaded():void
        {
            this.m_ArrCfg = new Array<BaseConfig>();
            for(let i:number = 0;i < this.m_LoadItem.length;i++)
            {
                let pData = Laya.Loader.getRes(this.m_LoadItem[i].url);
                if(pData != null)
                {
                    let pCfg:BaseConfig = null;
                    switch(this.m_LoadItem[i].CType)
                    {
                        case ConfigType.Skill://技能配置文件
                        {
                            pCfg = new SkillConfig();
                            break;
                        }
                        case ConfigType.Effect: //特效配置文件
                        {
                            pCfg = new EffectConfig();
                            break;
                        }
                        case ConfigType.Item: //道具配置文件
                        {
                            pCfg = new ItemConfig();
                            break;
                        }
                        case ConfigType.Npc: //npc配置文件
                        {
                            pCfg = new NpcConfig();
                            break;
                        }
                    }
                    if(pCfg != null)
                    {
                        pCfg.Load(pData);
                    }

                    this.m_ArrCfg[this.m_LoadItem[i].CType] = pCfg;
                }
            }
        }
    }
}