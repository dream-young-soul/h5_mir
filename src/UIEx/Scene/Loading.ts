module UI
{
    export class Loading extends ui.Scene.loadingUI
    {
        private m_LoadItem=[];
        private m_nOldWidth:number = 0;
        private m_nOldHeight:number = 0;
        private m_nOldTime:number = 0;
        constructor()
        {
            super();
            this.m_Progress.value = 0;
           
        }

        public Init():void
        {
            //动态适配屏幕分辨率
            this.m_nOldWidth = Laya.Browser.width;
            this.m_nOldHeight = Laya.Browser.height;
            this.m_nOldTime = Laya.timer.currTimer;
            //Laya.timer.loop(100,this,this.onInited);
            this.onInited();
           // Laya.stage.setScreenSize()
             //播放音乐
            //SoundManager.GetInstance().PlayBackMusic("data/sound/bg/1000-3.mp3",1)
             //Laya.stage.screenAdaptationEnabled = false;
           

        }
        private onInited():void
        {
        //    if((Laya.Browser.width != this.m_nOldWidth || Laya.Browser.height != this.m_nOldHeight) ||
        //     (Laya.timer.currTimer - this.m_nOldTime > 5000) )
            {
              //  Common.MirLog.Log(Common.MirLogType.Tips,"屏幕宽度:"+Laya.Browser.width +"屏幕高度:"+ Laya.Browser.height);
               
                let pCfg = Config.GlobalConfig._Instance;
                //   pCfg._nWidth = pCfg._nSceneWidth = Laya.Browser.width;
                //   pCfg._nHeight = pCfg._nSceneHeight = Laya.Browser.height;
                // pCfg._nSceneWidth = Laya.Browser.width;
                // pCfg._nSceneHeight = Laya.Browser.height;
                // Laya.stage.setScreenSize(pCfg._nWidth,pCfg._nHeight);
                // Laya.stage.width = Laya.stage.designWidth = pCfg._nWidth;
                // Laya.stage.height =Laya.stage.designHeight = pCfg._nHeight;
                //飘血特效
                DamageEff.GetInstance().Init(this.m_LoadItem);
                //主UI
                UI.UIManager.GetInstance().LoadMainLayer(this.m_LoadItem);
                //配置文件
                Config.ConfigManager.GetInstance().LoadConfig(this.m_LoadItem);
                //其他资源
                this.m_LoadItem.push({url:"res/atlas/comp/main/other.atlas",type:Laya.Loader.ATLAS});
                //hp血条
                this.m_LoadItem.push({url:pCfg._szHPProgressUrl[0],type:Laya.Loader.IMAGE});
                this.m_LoadItem.push({url:pCfg._szHPProgressUrl[1],type:Laya.Loader.IMAGE});
                
                Laya.loader.load(this.m_LoadItem,Laya.Handler.create(this,this.OnLoaded),Laya.Handler.create(this,this.OnProgress));

                Laya.timer.clear(this,this.onInited);

            }
        }
        private OnLoaded():void
        {
            DamageEff.GetInstance().OnLoaded();
            UI.UIManager.GetInstance().onLoadedUI();
            Config.ConfigManager.GetInstance().OnLoaded();
           
        }

        private OnProgress(data):void
        {
            this.m_Progress.value = parseInt(data);
            
        }
    }
}