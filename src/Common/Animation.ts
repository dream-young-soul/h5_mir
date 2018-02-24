/*
* 资源包动画
*@author 后天 2017.9.29
*/
module Common
{
    export class Animation extends Laya.Sprite
    {
        public static readonly DefaultFrameInterval:number = 80;    //默认动画每秒帧数
        private static readonly LOOPCOUNT = -1;//无限循环次数标识
        protected m_nPlayIndex:number = 0;  //播放次数计次
        protected m_nPlayCount:number = 0;  //播放次数
        protected m_nStartFrame:number = 0; //开始帧数
        protected m_nEndFrame:number = 0;   //结束帧数
        protected m_nFrameRate:number = 0;  //帧率
        protected m_Pack:Resources.SRPack = null; //资源包
        protected m_CurrentSprite:Laya.Sprite = null; //当前动画显示精灵
        protected m_nLastUpdateTime:number = 0;
        protected m_nCurrentFrame:number = 0;   //当前帧
        protected m_nCurrentFrameWidth:number = 0;  //当前帧宽度
        protected m_nCurrentFrameHeight:number = 0; //当前帧高度
        protected m_bEndFramePasue:boolean = false; //最后一帧是否停顿- 永久停留在最后一帧
         /**
         *	构造函数
         * @param pack	资源包
         * @param nStartFrame 起始帧数
         * @param nEndFrame 结束帧数
         * @param nFrameRate 帧率
         * @param nPlayCount 播放次数 -1 为无限循环
         * @return  该坐标位置的坐标对象
         * 
         */
        constructor(pack:Resources.SRPack,nStartFrame:number,nEndFrame:number,nFrameRate:number,nPlayCount:number)
        {
            super();
            this.m_Pack = pack;
            this.m_nEndFrame = nEndFrame;
            this.m_nStartFrame = nStartFrame;
            this.m_nFrameRate = nFrameRate;
            if(this.m_nFrameRate <= 0)
            {
                this.m_nFrameRate = Animation.DefaultFrameInterval;
            }
            this.m_nPlayCount = nPlayCount;
            this.m_nCurrentFrame = this.m_nStartFrame;
        }

        public GetPack():Resources.SRPack
        {
            return this.m_Pack;
        }

        public Destory():void
        {
            if(this.parent != null)
            {
                this.parent.removeChild(this);
            }
            if(this.m_CurrentSprite != null)
            {
                this.m_CurrentSprite.removeSelf();
            }
            this.m_CurrentSprite = null;
            this.m_Pack = null;
            this.m_nPlayIndex = 0;  
            this.m_nPlayCount = 0;  
            this.m_nStartFrame = 0;
            this.m_nEndFrame = 0;   
            this.destroy();
        }
        public SetPack(pack:Resources.SRPack)
        {
            this.m_Pack = pack;
            if(this.m_Pack == null)
            {
                if(this.m_CurrentSprite != null && this.m_CurrentSprite.parent != null)
                {
                    this.removeChild(this.m_CurrentSprite);
                    this.m_CurrentSprite = null;
                     this.m_nCurrentFrameWidth = 0;
                    this.m_nCurrentFrameHeight = 0;
                }
            }
        }
        public GetCurrentFrameSprite():Laya.Sprite
        {
            return this.m_CurrentSprite;
        }
        public GetCurrentFrameWidth():number
        {
            return this.m_nCurrentFrameWidth;
        }
        public SetEndFramePasue(bEndFramePasue:boolean):void
        {
            this.m_bEndFramePasue = bEndFramePasue;
        }
        public GetCurrentFrameHeight():number
        {
            return this.m_nCurrentFrameHeight;
        }

        public GetCurrentFrame():number
        {
            return this.m_nCurrentFrame;
        }
        public SetCurrentFrame(nFrame:number):void
        {
            this.m_nCurrentFrame = nFrame;
            this.m_nLastUpdateTime = Config.GlobalConfig.s_dwUpdateTick;
        }
        public SetEndFrame(nEndFrame:number):void
        {
            this.m_nEndFrame = nEndFrame;
        }
        public GetEndFrame():number
        {
            return this.m_nEndFrame;
        }
        public SetStartFrame(nStartFrame:number):void
        {
            this.m_nStartFrame = nStartFrame;
        }
        public GetStartFrame():number
        {
            return this.m_nStartFrame;
        }
        public SetFrameRate(nFrameRate:number):void
        {
            this.m_nFrameRate = nFrameRate;
        }
        public GetFrameRate():number{
            return this.m_nFrameRate;
        }
        public Update(nCurrentTime:number):void
        {
            if( this.m_Pack == null || this.parent == null || this.m_Pack.GetFrameCount()<= 0)
            {return;}
            if(nCurrentTime >= this.m_nLastUpdateTime)
            {
                this.m_nCurrentFrame++;
                if(this.m_nCurrentFrame >= this.m_nEndFrame)
                {
    
                    this.m_nPlayIndex++;
                    if(this.m_nPlayCount != Animation.LOOPCOUNT)
                    {
                        if(this.m_nPlayIndex >= this.m_nPlayCount)
                        {
                            if(this.parent != null)
                            {
                                this.parent.removeChild(this);
                                this.parent = null;
                            }
                            return;
                        }else
                        {
                            this.m_nCurrentFrame = this.m_nStartFrame;
                        }
                    }else
                    {
                        this.m_nCurrentFrame = this.m_nStartFrame;
                    }
                    //最后一帧是否停顿
                    if(  this.m_bEndFramePasue )
                    {
                        this.m_nCurrentFrame = this.m_nEndFrame - 1;
                    }
                }
                this.m_nLastUpdateTime = nCurrentTime + this.m_nFrameRate;

                if(this.m_CurrentSprite != null && this.m_CurrentSprite.parent != null)
                {
                    this.removeChild(this.m_CurrentSprite);
                    this.m_CurrentSprite = null;
                     this.m_nCurrentFrameWidth = 0;
                     this.m_nCurrentFrameHeight = 0;
                }
                this.m_CurrentSprite = this.m_Pack.GetSpriteByIndex(this.m_nCurrentFrame);
                if(this.m_CurrentSprite != null)
                {
                    this.m_nCurrentFrameWidth = this.m_Pack.GetSpriteByIndexWidth(this.m_nCurrentFrame);
                    this.m_nCurrentFrameHeight =this.m_Pack.GetSpriteByIndexHeight(this.m_nCurrentFrame);
                    this.addChild(this.m_CurrentSprite);
                }
               
            }

            
        }
    }
}