// 程序入口
class GameMain{
    //private sMapAddr:string  = "http://cdn.zr2.51.com/v1/map/122BiQiCheng.wwm";
    public  sMapAddr:string  = "./data/map/122BiQiCheng.wwm";
    public Ani:Common.Animation  = null;
    public Map:GameMap.CustomGameMap;
    public m_bMouseMove:boolean = false;
    private m_nFrameTick:number = 0;
    private  rich:UI.RichText = null;
    private m_Sprite:Laya.Sprite = null;
    constructor()
    {
        //Laya.timer.loop(5000,this,this.onTimerStart);
 
       // this.onTimerStart();
        this.OnStart();
    }
    private OnStart():void
    {
        let pCfg = Config.GlobalConfig._Instance;
        Laya.init(pCfg._nWidth,pCfg._nHeight,Laya.WebGL);
        let nWidth:number= Laya.Browser.clientWidth;
        //laya.resource.ResourceManager.systemResourceManager.autoRelease = false; 
        Laya.stage.scaleMode =  "exactfit"; 
        //Laya.stage.scaleMode =  "fixedauto"; //
        Laya.stage.screenMode = "horizontal"; //横屏
        Laya.stage.frameRate = "slow";
      //   console.log("缩放系数X:"+Laya.stage.clientScaleX+ "缩放系数Y:"+Laya.stage.clientScaleY);
        // pCfg._nSceneWidth = Laya.Browser.clientWidth;
        // pCfg._nSceneHeight = Laya.Browser.clientHeight;
        pCfg._nSceneWidth = pCfg._nWidth;
        pCfg._nSceneHeight = pCfg._nHeight;

        let Stat   = Laya.Stat;
        Stat.show(0, 0);
        let loader = []
      
        LogicManager.GetInstance().Init();
       
        Laya.timer.loop(30,this,this.OnLogicRun);
        //添加键盘按下事件,一直按着某按键则会不断触发
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        //添加键盘抬起事件
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);

        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.OnMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.OnMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.OnMouseMove);
        //Laya.stage.on(Laya.Event.RESIZE,this,this.OnReSize);
        //测试富文本
       
        //<(type:2,file:data/yiyi.jpg,width:640,height:826)>
        // this.rich =  new UI.RichText();
        // let str:string = "<(type:1,color:FFFFFF,link:showwin)一个超文本链接><(type:1,color:FFFFFF)攻击属性><(type:3,width:100,height:100,index:1)>";
        // str +="\\"+str;
        // this.rich.SetText(str);
        // this.rich .stage.addChild(this.rich );
        // this.rich .pos(200,200);
        // this.rich .zOrder = 100000;

 


        //测试精灵点击事件
        // let a:Laya.Sprite = new Laya.Sprite();
        // this.m_Sprite = new Laya.Sprite();
        // //this.m_Sprite.loadImage("./data/yiyi.JPG");
        // this.m_Sprite.on(Laya.Event.CLICK,this,this.onImageClick);
        // a.addChild(this.m_Sprite);
        // Laya.stage.addChild(a);
        // a.pos(100,100);
        // a.zOrder = 10000;
        // let rect = this.m_Sprite.hitArea;
        
        // Laya.loader.load("./data/yiyi.JPG",Laya.Handler.create(this,this.onLoadImage));
    }

    // private OnReSize():void
    // {
    //     let nWidth:number = Laya.Browser.width;
    //     let nHeight:number = Laya.Browser.height;
    //     let pCfg = Config.GlobalConfig._Instance;
    //     pCfg._nWidth = pCfg._nSceneWidth = Laya.Browser.width;
    //     pCfg._nHeight = pCfg._nSceneHeight = Laya.Browser.height;
    //     Laya.stage.setScreenSize(nWidth,nHeight);
    // }
    private onTimerStart():void
    {
     
        let pCfg = Config.GlobalConfig._Instance;
        pCfg._nWidth = pCfg._nSceneWidth = Laya.Browser.width;
        pCfg._nHeight = pCfg._nSceneHeight = Laya.Browser.height;
      
    }
    // private onLoadImage(data):void
    // {
    //     this.m_Sprite.texture = data as Laya.Texture;
    //     this.m_Sprite.hitArea = new laya.maths.Rectangle(0,0,this.m_Sprite.texture.width,this.m_Sprite.texture.height);
    //    //console.log("11111");
    // }
    // private onImageClick():void
    // {
    //     console.log("onImageClick");
    //     let a:number = 0;
    //     a++;
    // }
    private OnMouseMove(e:laya.events.Event):void
    {
       
         let touches = e.touches;
        if(this.m_bMouseMove)
        {
             LogicManager.GetInstance().OnMouseDown(Laya.stage.mouseX,Laya.stage.mouseY)
        }
       
    }
    private OnMouseUp(e:laya.events.Event):void
    {
        if(e.target == Laya.stage)
        {
             UI.UIManager.GetInstance().OnMouseUp(); //恢复摇杆
             LogicManager.GetInstance().OnMouseUp(Laya.stage.mouseX,Laya.stage.mouseY);
        }
       this.m_bMouseMove = false;
       
        
        
    }
    private OnMouseDown(e):void
    {
        //单击了除了UI之外的位置
        if(e.target == Laya.stage)
        {
          let ret:boolean =  LogicManager.GetInstance().OnMouseDown(Laya.stage.mouseX,Laya.stage.mouseY);
          if(ret)
          {
             this.m_bMouseMove = true;
          }
         
        }

    }
       /**键盘按下处理*/
        private onKeyDown(e: Event): void 
        {

            var keyCode: number = e["keyCode"];
            //this.m_nKeyCode = keyCode;
            
        }
         /**键盘抬起处理*/
        private onKeyUp(e: Event): void 
        {
           
            var keyCode: number = e["keyCode"];
            switch(keyCode)
            {
                case 38: //上光标键
                {
                    // let Player:Entity.Player =Entity.Player.GetInstance();
                    // let pPath:GameMap.MapPath  = GameMap.CustomGameMap.GetInstance().GetMapPath();
                    // let ret:Laya.Point[] = pPath.FindPath(Player.GetCurentX(),Player.GetCurrentY(),100,135);
                    // if(ret != null)
                    // {

                    // }
                   // this.Map.MoveTo(100,105,400);
                    break;
                }
            }
        }
    private OnLogicRun():void
    {
        let nCurrentTime:number = Laya.timer.currTimer;
        // if(this.Ani != null)
        // {
        //     this.Ani.Update(nCurrentTime);
        // }
        //标准间隔
         let pCfg:Config.GlobalConfig = Config.GlobalConfig._Instance;
     
      
       LogicManager.GetInstance().Update(nCurrentTime);
      
       pCfg._nCurrentFrameTick =nCurrentTime ;

       if(this.rich != null)
       {
           this.rich.Update(nCurrentTime);
       }
      
    }

    // private OnLoadPic():void
    // {
    //     let data = Laya.loader.getRes("./2.jpg");
    //     let base:Base64 = new Base64();
    //     let byte:Laya.Byte = new Laya.Byte(data);
    //     let str:string = base.encode(byte.__getBuffer());
    //     str = "data:image/png;base64,"+str;
    //     let s:Laya.Sprite = Laya.Sprite.fromImage(str);
    //     Laya.stage.addChild(s);
    // }
    // private OnLoadSuccess():void
    // {
    //     let data = Laya.loader.getRes(this.sMapAddr);
        
    //     let bytes:Laya.Byte = new Laya.Byte(data);
       
    //     this.Map.Load(bytes);
    //     let s:Laya.Sprite = new Laya.Sprite();
    //     Laya.stage.addChild(s);
    //     this.Map.SetDisplayContainer(s);
    //     this.Map.SetDisplaySize(1024,768);
      
    //     //创建主角
    //     let propSet:Entity.PropertySet = new Entity.PropertySet(); 
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSX,135);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSY,156);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_DIR,4);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_MODELID,137);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MAXHP,100);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_HP,100);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MOVEONESLOTTIME,400);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ACTOR_WEAPONAPPEARANCE,85); //武器外观
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ACTOR_SEX,0);  //性别
    //     LogicManager.GetInstance().CreateEntity(1,Entity.EntityType.Player,propSet);

    //     Entity.Player.GetInstance().PostActionMessage(Entity.StandardActions.SA_IDLE,null);
    //     this.Map.SetCurrentPosition(propSet.GetIntProperty(Entity.enPropEntity.PROP_ENTITY_POSX),propSet.GetIntProperty(Entity.enPropEntity.PROP_ENTITY_POSY));


    //     //创建测试npc
    //     propSet= new Entity.PropertySet()
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSX,140);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSY,156);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_MODELID,1);
    //     let pNpc:Entity.Npc = LogicManager.GetInstance().CreateEntity(2,Entity.EntityType.Npc,propSet) as Entity.Npc;

    //     //创建测试怪物
    //     propSet = new Entity.PropertySet();
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSX,130);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSY,156);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_MODELID,20);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MAXHP,100);
    //     propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_HP,100);
    //     let pMonster:Entity.Monster = LogicManager.GetInstance().CreateEntity(3,Entity.EntityType.Monster,propSet) as Entity.Monster;

    // }


}
new GameMain();
