	/**
	 * 游戏地图操作类，游戏中实际可用的地图类 
	 * @author 后天 2017.9.29
	 * 
	 */
    module GameMap
    {
        export class CustomGameMap extends CustomRenderMap
        {
            private static  _Instance:CustomGameMap = null;
            private  m_MoveTargetPos: Laya.Point = null;//移动的目的地坐标，为null表示当前不在移动中
            private  m_nMoveDir: number = 0;//移动的方向
            private  m_nMoveStartTick: number = 0;//开始移动的时间
		    private  m_nMoveEndTick: number = 0;//移动完成的时间
		    private  m_dMoveSpeedH: number = 0;//水平方向的移动速度（每毫秒移动多少像素)
		    private  m_dMoveSpeedV: number = 0;//竖直方向的移动速度（每毫秒移动多少像素)
            private m_sMapName:string = ""; //地图名称
            private m_nMapID:number = 0;    //地图id
            private m_szMapFile:string = "";    //地图路径
            private m_ArrEffect:Array<Common.Animation>;    //场景特效
            private m_EffectLayer:Laya.Sprite ;
            constructor()
            {
                super();

                //场景层特效
                this.m_EffectLayer = new Laya.Sprite();
                this.m_MapLayerRoot.addChild(this.m_EffectLayer);
                this.m_ArrEffect =new Array<Common.Animation>();

            }
            public static Init():void
            {
                CustomGameMap._Instance = new CustomGameMap();
            }

            public static GetInstance():CustomGameMap{
                return CustomGameMap._Instance;
            }

            public LoadMap(szMapFile:string,szMapName:string,nMapId:number)
            {
                this.m_sMapName = szMapName;
                this.m_nMapID = nMapId;
                this.m_szMapFile = szMapFile;
                let assat=[];
                assat.push(
                    {
                        url:Config.GlobalConfig._Instance._szUrl+ szMapFile,
                        type:Laya.Loader.BUFFER,
                    }
                )
                Laya.loader.load(assat,Laya.Handler.create(this,this.OnLoadMap));
            }
            public GetMapId():number
            {
                return this.m_nMapID;
            }
            public GetmapFile():string
            {
                return this.m_szMapFile;
            }
            private OnLoadMap():void
            {
                let data = Laya.loader.getRes(Config.GlobalConfig._Instance._szUrl+this.m_szMapFile);
                let bytes:Laya.Byte = new Laya.Byte(data);
                this.Load(bytes);
                let pPlayer:Entity.Player = Entity.Player.GetInstance();
                this.SetCurrentPosition(pPlayer.GetCurentX(),pPlayer.GetCurrentY());
            }
            /**
             *	地图移动等操作的更新函数 
             * 	周期性的处理或移动等操作必须由使用者调用update函数当做事件驱动来执行更新
             * @param CurrentTick 当前系统运行时间
             */
            public  Update(CurrentTick: number): void
            {

                //如果移动的目的坐标存在，则处理移动或完成移动
                if ( this.m_MoveTargetPos != null)
                {
                    //仍在移动
                    if ( CurrentTick < this.m_nMoveEndTick )
                    {	
                        this.ProcessMove(CurrentTick);
                    }
                    else
                    {
                        //完成移动
                        this.EndMove();
                    }	
                }

                //更新特效
            for(let i:number = this.m_ArrEffect.length - 1;i > 0 ;i--)
            {
                let pAni:Common.Animation = this.m_ArrEffect[i];
                pAni.Update(CurrentTick);
                if(pAni.parent == null)
                {
                    this.m_ArrEffect.splice(i,1);
                }
            }
            }
            /**
             * 覆盖函数——设置当前中心位置的X和Y坐标
             * @param x
             * @param y
             * 
             */
            public SetCurrentPosition(x: number, y: number): void
            {
                //如果正在移动则首先停止移动
                if ( this.m_MoveTargetPos != null )
                {
                    this.EndMove();
                }
                super.SetCurrentPosition(x, y);
            }
            /**
             *使地图向x,y坐标以speed速度移动 
             * @param x, y	移动的目的坐标
             * @param speed	移动的速度，指在多少毫秒内完成移动
             * 
             */
            public  MoveTo(x: number, y: number, speed: number): void
            {
                if ( this.m_MoveTargetPos != null )
                {
                     return;
                }

                //计算移动后的目标位置
                if ( x < 0 || y < 0 || x >= this.m_nWidth || y >= this.m_nHeight )
                {
                     throw new Error("无法将地图向(" + x + "," + y + ")位置移动");
                }
                this.m_MoveTargetPos = new  Laya.Point(x, y);   
                this.m_nMoveDir = CustomMap.CalcForwardDirection( this.m_nCurrentX, this.m_nCurrentY, x, y );
                this.m_nMoveStartTick = Config.GlobalConfig.s_dwUpdateTick;
                this.m_nMoveEndTick = this.m_nMoveStartTick + speed;
                //计算水平和竖直方向移动的速度
                this.m_dMoveSpeedH = (this.m_nCurrentX - x) * CustomMap.MAPCELLUNITWIDTH / speed;
                this.m_dMoveSpeedV = (this.m_nCurrentY - y) * CustomMap.MAPCELLUNITHEIGHT / speed;
            }


            /**
             *使地图向direction方向移动step坐标 
             * @param direction	移动的方向，游戏具有8个方向，0点钟方向为0方向，6点钟方向为4方向，以此类推
             * @param step	移动的距离，单位是坐标，移动的距离必须小于4坐标
             * @param speed	移动的速度，指在多少毫秒内完成移动
             * 
             */
            public MoveBy(direction: number, step: number, speed: number): void
            {
                if ( step <= 0 || step > 3 )
                {
                    throw new Error("移动的距离超出最大设计范围:" + step);
                }
                
                if ( this.m_MoveTargetPos != null )
                {
                     return;
                }
                   
                //计算移动后的目标位置
                this.m_MoveTargetPos = CustomMap.CalcForwardPosition( this.m_nCurrentX, this.m_nCurrentY, direction, step );
                //console.log("mapx:"+this.m_MoveTargetPos.x+"mapy:"+this.m_MoveTargetPos.y);
                if ( this.m_MoveTargetPos.x < 0 || this.m_MoveTargetPos.y < 0 || 
                    this.m_MoveTargetPos.x >= this.m_nWidth || this.m_MoveTargetPos.y >= this.m_nHeight )
                {
                        throw new Error("无法将地图向" + direction + "方向移动" + step);
                }
                   
                this.m_nMoveDir = direction;
                this.m_nMoveStartTick =Config.GlobalConfig.s_dwUpdateTick;
                this.m_nMoveEndTick = this.m_nMoveStartTick + speed;
                //计算水平和竖直方向移动的速度
                this.m_dMoveSpeedH = (this.m_nCurrentX - this.m_MoveTargetPos.x) * CustomMap.MAPCELLUNITWIDTH / speed;
                this.m_dMoveSpeedV = (this.m_nCurrentY - this.m_MoveTargetPos.y) * CustomMap.MAPCELLUNITHEIGHT / speed;
            }
            /**
             * 停止场景移动 
             * 
             */
            public StopMove(): void
            {
                this.EndMove();
            }

            /**
             *完成移动，将当前坐标设置为m_MoveTargetPos并将m_MoveTargetPos设为null; 
             * 
             */
            private  EndMove(): void
            {
                if ( this.m_MoveTargetPos != null)
                {
                    //要使用一个中间变量保存m_MoveTargetPos并将m_MoveTargetPos置空
                    //放置在调用setCurrentPosition后再次调用endMove造成死递归
                    let targetPos: Laya.Point = this.m_MoveTargetPos;
                    this.m_MoveTargetPos = null;
                    this.SetCurrentPosition(targetPos.x, targetPos.y);
                }
            }


            /******************************************************************
             * 
             * 以下函数均为似有和保护函数
             * 
             * ***************************************************************/
            /**
             *	处理移动过程 
             * @param CurrentTick 当前时间
             */
            private  ProcessMove(CurrentTick: number): void
            {
                
                let nMovedTick: number = CurrentTick - this.m_nMoveStartTick;//计算得已移动的时间
                let nXMoved: number = this.m_dMoveSpeedH * nMovedTick;
                let nYMoved: number = this.m_dMoveSpeedV * nMovedTick;
                
                let offx:number = -this.m_nCurrentX * CustomMap.MAPCELLUNITWIDTH + nXMoved;
                let offy = -this.m_nCurrentY * CustomMap.MAPCELLUNITHEIGHT + nYMoved;
                offx = Math.ceil(offx)
                offy = Math.ceil(offy)
                this.SetLayersPosition(offx,offy);
 
            }

            public GetGlobalPoint(x:number,y:number):Laya.Point
            {
                let point:Laya.Point = new Laya.Point(x,y);
                this.m_MapLayerRoot.localToGlobal(point);
                return point;
            }

            public AddEffect(nEffId:number,type:Config.EffectType,nX:number,nY:number,nDuration:number):void
            {
                let pEffect:Common.Animation =null;
                let pack = Resources.ResourcesManager._Instance.GetSkillEffectPackage(nEffId);
                //特效并没有加载完成
                if(pack.GetFrameCount() <= 0)
                {
                    return;
                }
                switch(type)
                {
                    case Config.EffectType.meKeepOnBody:
                    case Config.EffectType.meKeepOnFeet:
                    case Config.EffectType.meExplode:
                    {
                         let nStartFrame:number = 0;
                        let nEndFrame:number = pack.GetFrameCount();
                        pEffect = new Common.Animation(pack,nStartFrame,nEndFrame,0,1)
                        break;
                    }
                }
                if(pEffect != null)
                {
                
                    this.m_EffectLayer.addChild(pEffect);
                    pEffect.x = (nX + 0.5) * CustomMap.MAPCELLUNITWIDTH;
				    pEffect.y = (nY + 0.5) * CustomMap.MAPCELLUNITHEIGHT;
                    this.m_ArrEffect.push(pEffect);
                    //播放音效
                    let pStdEffect:Config.StdEffect = Config.ConfigManager.GetInstance().GetEffectConfig().GetEffectByID(nEffId);
                    if(pStdEffect != null && pStdEffect._nSoundId > 0)
                    {
                        SoundManager.GetInstance().PlayEffectSound(pStdEffect._nSoundId);
                    }
                }
            }

           
         
        }
    }