
/*
* 全局UI管理器
*@author 后天 2017.10.5
*/
module UI
{
    
    export class UIManager
    {
        private static _Instance:UIManager = null;
        private m_LoadItem =[];//加载的项目
        private m_Dialog:Laya.Dialog[] =[]; 
        private m_SceneLogin:UI.Login; //登录场景
        private m_SceneCreateRole:UI.CreateRole;    //创建角色场景
        private m_SceneLoading:UI.Loading;  //加载场景
        private m_MapRootLayer:Laya.Sprite = null;  //地图主场景
        private m_LoadingDialog = [];   //记录游戏内对话框是否正在加载- 防止重复加载
        public static Init():void
        {
            UIManager._Instance = new UIManager();
        }
        public static GetInstance():UIManager
        {
            return UIManager._Instance;
        }

        constructor()
        {
            let pCfg = Config.GlobalConfig._Instance;
            this.m_LoadItem =
            [
                //{ url: "res/atlas/comp/main/log.json",type: Laya.Loader.ATLAS,id:UIDialogID.Log,x:0,y:pCfg._nHeight - 400,visible:true,},
                { url: "res/atlas/comp/scene/loading.json", type: Laya.Loader.ATLAS,id:UIDialogID.Loading,x:0,y:0 }, //加载场景
                 
               
            ]
             Laya.loader.load(this.m_LoadItem,Laya.Handler.create(this, this.onLoadedUI));
        }
        public LoadMainLayer(arrItem):void
        {
            let pCfg = Config.GlobalConfig._Instance;
            this.m_LoadItem =
            [
                { url: "res/atlas/comp/scene/login.json", type: Laya.Loader.ATLAS,id:UIDialogID.Login,x:0,y:0,visible:false, }, //登录场景
                 { url: "res/atlas/comp/main/main.atlas", type: Laya.Loader.ATLAS,id:UIDialogID.Main,x:0,y:0,visible:true, }, //主控
                { url: "res/atlas/comp/main/header.json", type: Laya.Loader.ATLAS,id:UIDialogID.Header,x:0,y:33,visible:true, },
                { url: "res/atlas/comp/main/joy.json", type: Laya.Loader.ATLAS,id:UIDialogID.Joy,x:100,y:pCfg._nSceneHeight - 200,visible:true,},
                { url: "res/atlas/comp/main/joybtn.json", type: Laya.Loader.ATLAS,id:UIDialogID.JoyBtn,x:pCfg._nSceneWidth - 300,y:pCfg._nSceneHeight - 300,visible:true,},
                { url: "res/atlas/comp/main/npctalk.json", type: Laya.Loader.ATLAS,id:UIDialogID.NpcTalk,x:(pCfg._nWidth - 481)/2 ,y:(pCfg._nHeight - 304)/2,visible:false,},
                { url: "res/atlas/comp/main/minimap.json", type: Laya.Loader.ATLAS,id:UIDialogID.MiniMap,x:pCfg._nWidth - 160 ,y:33,visible:true,},
                { url: "res/atlas/comp/main/topheader.json",type: Laya.Loader.ATLAS,id:UIDialogID.TopHeader,x:0,y:0,visible:true,},
                { url: "res/atlas/comp/main/shortcut.json",type: Laya.Loader.ATLAS,id:UIDialogID.Shortcut,x:400,y:35,visible:true,},
                { url: "res/atlas/comp/main/other.atlas",type: Laya.Loader.ATLAS,id:UIDialogID.Normal,x:0,y:0,visible:false,}, //其他资源素材
              //{ url: "res/atlas/comp/main/testscene.atlas",type: Laya.Loader.ATLAS,id:UIDialogID.TestScene,x:0,y:0,visible:true,},

            ]
           //console.log("scenewidth:"+pCfg._nSceneWidth+" sceneheight:"+pCfg._nSceneHeight+"swidth:"+Laya.Browser.clientWidth+"sheight:"+Laya.Browser.clientHeight);
            for(let i:number = 0;i < this.m_LoadItem.length;i++)
            {
                arrItem.push(this.m_LoadItem[i]);
            }   
           
        }
        //初始化游戏主场景
        public InitMainLayer()
        {

            if(this.m_SceneCreateRole != null)
            {
                Laya.stage.removeChild(this.m_SceneCreateRole);
                this.m_SceneCreateRole.destroy();
                this.m_SceneCreateRole = null;
            }
            if(this.m_SceneLogin != null)
            {
                Laya.stage.removeChild(this.m_SceneLogin);
                this.m_SceneLogin.destroy();
                this.m_SceneLogin = null;
            }
            if(this.m_MapRootLayer != null)
            {
                Laya.stage.removeChild(this.m_MapRootLayer);
                this.m_MapRootLayer.destroy();
               
            }
            if(this.m_SceneLoading != null)
            {
                Laya.stage.removeChild(this.m_SceneLoading);
                this.m_SceneLoading.destroy();
                this.m_SceneLoading = null;
            }
            //显示UI
            for(let i:number = 0;i < this.m_LoadItem.length;i++)
            {
                let pItem = this.m_LoadItem[i];
                //if(pItem.visible == true)
                {
                    let pDialog = this.m_Dialog[pItem.id];
                   
                    if(pDialog != null)
                    {
                        pDialog.visible = pItem.visible;
                        Laya.stage.addChild(pDialog);
                        pDialog.zOrder =1000;
                        pDialog.pos(pItem.x,pItem.y);
                    }
                }
            }
            this.m_MapRootLayer = new Laya.Sprite();
            Laya.stage.addChild( this.m_MapRootLayer);
            let pMap:GameMap.CustomGameMap = GameMap.CustomGameMap.GetInstance();
            pMap.SetDisplayContainer(this.m_MapRootLayer);
            let pCfg:Config.GlobalConfig = Config.GlobalConfig._Instance;
            pMap.SetDisplaySize(pCfg._nWidth,pCfg._nHeight);

            //loadingdialog框
            let pLoadingDialog:UI.LoadingDialog = new UI.LoadingDialog();
            this.m_Dialog[UI.UIDialogID.LoadingDialog] = pLoadingDialog;
            this.InitDialogInfo();
            
        }

        //初始化对话框信息- 进入游戏后点击按钮才加载的
        private InitDialogInfo():void
        {
            this.m_LoadItem =
            [
                { url: "res/atlas/comp/dialog/role.json", type: Laya.Loader.ATLAS,id:UIDialogID.Role,x:0,y:0,visible:true },
                { url: "res/atlas/comp/dialog/skill.json", type: Laya.Loader.ATLAS,id:UIDialogID.Skill,x:0,y:0,visible:true },
                { url: "res/atlas/comp/dialog/map.json", type: Laya.Loader.ATLAS,id:UIDialogID.Map,x:0,y:0,visible:true },
                { url: "res/atlas/comp/dialog/itemtips.atlas", type: Laya.Loader.ATLAS,id:UIDialogID.ItemTips,x:0,y:0,visible:true },
            ]
        }
        //加载创建角色场景
        public LoadCreateRoleScene():void
        {
            this.m_LoadItem =
            [
                { url: "res/atlas/comp/scene/createrole.json", type: Laya.Loader.ATLAS,id:UIDialogID.CreateRole,x:0,y:0 },
               
            ]
            Laya.loader.load(this.m_LoadItem,Laya.Handler.create(this, this.onLoadedUI));
        }
   

        public GetHeaderDialog():UI.Header
        {
            return this.m_Dialog[UIDialogID.Header] as UI.Header;
        }
        public GetJoyDialog():UI.Joy
        {
            return this.m_Dialog[UIDialogID.Joy] as UI.Joy;
        }

        public GetNpcDialog():UI.NpcTalk
        {
            return this.m_Dialog[UIDialogID.NpcTalk] as UI.NpcTalk;
        }

        public GetMiniMapDialog():UI.MiniMap
        {
            return this.m_Dialog[UIDialogID.MiniMap] as UI.MiniMap;
        }
        public GetTopHeaderDialog():UI.TopHeader
        {
            return this.m_Dialog[UIDialogID.TopHeader] as UI.TopHeader;
        }
        public GetLogDialog():UI.Log
        {
            return null;
           // return this.m_Dialog[UIDialogID.Log] as UI.Log;
        }

        public GetItemTipsDialog():UI.ItemTips
        {
            if(this.m_Dialog[UIDialogID.ItemTips]  == null)
            {
               
                return null;
            }
            return this.m_Dialog[UIDialogID.ItemTips] as UI.ItemTips;
        }
        private CreateUI(pItem,isShow = false)
        {
            switch(pItem.id)
            {
                case UIDialogID.Login:
                {
                    this.m_SceneLogin = new UI.Login();
                    Laya.stage.removeChild(this.m_SceneLoading);
                    Laya.stage.addChild(this.m_SceneLogin);
                    break;
                }
                case UIDialogID.CreateRole:
                {
                    this.m_SceneLogin.destroy();
                    Laya.stage.removeChild(this.m_SceneLogin);

                    this.m_SceneCreateRole = new UI.CreateRole();
                    Laya.stage.addChild(this.m_SceneCreateRole);
                    break;
                }
                case UIDialogID.Loading:
                {
                    this.m_SceneLoading = new UI.Loading();
                    //载入加载场景，加载配置文件资源
                    Laya.stage.addChild(this.m_SceneLoading);
                    this.m_SceneLoading.zOrder = 1000;
                    this.m_SceneLoading.Init();

                                //日志对话框
                    // let pLogDialog:UI.Log = new UI.Log();
                    // this.m_Dialog[UIDialogID.Log] = pLogDialog;
                    // Laya.stage.addChild(pLogDialog);
                    // pLogDialog.pos(200,0);
                    // pLogDialog.zOrder = 1001;
                    break;
                }
            }
            let ui:Laya.Dialog = null;
            switch(pItem.id)
            {
                case UIDialogID.Header:
                {   
                    ui = new UI.Header();
                    break;
                }
                case UIDialogID.Joy:
                {
                    ui = new UI.Joy();
                    break;
                }
                case UIDialogID.JoyBtn:
                {
                    ui = new UI.Joybtn();
                    break;
                }
                case UIDialogID.NpcTalk:
                {
                    ui = new UI.NpcTalk();
                    break;
                }
                case UIDialogID.MiniMap:
                {
                    ui = new UI.MiniMap();
                    break;
                }
                case UIDialogID.TopHeader:
                {
                    ui = new UI.TopHeader();
                    break;
                }
                case UIDialogID.Shortcut:
                {
                    ui = new UI.Shortcut();
                    break;
                }
                case UIDialogID.Role:
                {
                    ui = new UI.Role();
                    break;
                }
                case UIDialogID.Skill:
                {
                    ui = new UI.Skill();
                    break;
                }
                // case UIDialogID.Log:
                // {
                //     ui = new UI.Log();
                //     isShow = true;
                //     break;
                // }
                case UIDialogID.Map:
                {
                    ui = new UI.Map();
                    break;
                }
                case UIDialogID.ItemTips:
                {
                    ui = new UI.ItemTips();
                    break;
                }
                case UIDialogID.Main:
                {
                    ui = new UI.Main();
                    break;
                }
         
            }
            if(ui != null)
            {
                this.m_Dialog[pItem.id] = ui;
                if(isShow)
                {
                    Laya.stage.addChild(ui);
                    ui.pos(pItem.x,pItem.y);
                    ui.zOrder = 1000;   //最优先层
                    //日志在最高层
                    // if(pItem.id == UIDialogID.Log)
                    // {
                    //     ui.zOrder = 10000;
                    // }

                    //物品tips
                    if(pItem.id == UIDialogID.ItemTips)
                    {
                        (ui as UI.ItemTips).ShowItem(Config.GlobalConfig._Instance._CurrentShowItem,Config.GlobalConfig._Instance._ShowItemTipsType);
                    }
                }

            }
                
        }
        public onLoadedUI():void
        {
            for(let i in this.m_LoadItem)
            {
                let pItem = this.m_LoadItem[i];
                this.CreateUI(pItem);
            }

        }
        public OnMouseDown():void
        {

        }

        public OnMouseUp():void
        {
            if(this.GetJoyDialog() != null)
            {
                this.GetJoyDialog().OnJoyMouseUp();    
            }
            
        }

        public Update(nCurrentTick:number):void
        {
            let pJoyDialog:UI.Joy = this.GetJoyDialog();
            if(pJoyDialog != null)
            {
                 pJoyDialog.Update(nCurrentTick);
            }

            let pItemTips:UI.ItemTips = this.GetItemTipsDialog();
            if(pItemTips != null && pItemTips.parent != null)
            {
                pItemTips.Update(nCurrentTick);
            }
            
        }

        //加载对话框完成
        private onLoadedDialog(e)
        {
            let pLoadingDialog:UI.LoadingDialog = this.m_Dialog[UIDialogID.LoadingDialog] as UI.LoadingDialog;
            if(pLoadingDialog != null)
            {
                pLoadingDialog.removeSelf();
            }
           this.CreateUI(e,true);

        }
        private onLoadedDialogProgress(v)
        {
             let pLoadingDialog:UI.LoadingDialog = this.m_Dialog[UIDialogID.LoadingDialog]as UI.LoadingDialog;
            if(pLoadingDialog != null)
            {
                pLoadingDialog.UpdateProgress(v);
            }
            
        }
        public HideDialog(nDialogId:UIDialogID):void
        {
            if(this.m_Dialog[nDialogId] != null)
            {
             
                let pDialog:Laya.Dialog = this.m_Dialog[nDialogId];
                Laya.stage.removeChild(pDialog);
            }
        }
        public ShowDialog(nDialogId:UIDialogID):void
        {
            if(this.m_Dialog[nDialogId] != null)
            {
                let pDialog:Laya.Dialog = this.m_Dialog[nDialogId];
                Laya.stage.addChild(pDialog);
                return;
            }
            if(this.m_LoadingDialog[nDialogId] != null)
            {
                return;
            }
            let pLoadingDialog:UI.LoadingDialog = this.m_Dialog[UIDialogID.LoadingDialog]as UI.LoadingDialog;
            if(pLoadingDialog != null && pLoadingDialog.parent != null)
            {
                return;
            }
            for(let i:number = 0;i < this.m_LoadItem.length;i++)
            {
                if(this.m_LoadItem[i].id == nDialogId)
                {
                    Laya.stage.addChild(pLoadingDialog);
                    let asset =[]
                    asset.push(this.m_LoadItem[i]);
                    this.m_LoadingDialog[nDialogId] = true;
                    Laya.loader.load(asset,Laya.Handler.create(this, this.onLoadedDialog,[this.m_LoadItem[i]]),
                        Laya.Handler.create(this,this.onLoadedDialogProgress));

                    break;
                }
            }
        }
    }
}