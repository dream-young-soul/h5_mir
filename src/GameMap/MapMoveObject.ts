	/**
	 * 地图中可移动的现实对象类，怪物、人物等会移动的物体都继承此类 
	 * @author 后天
	 * 
	 */
module GameMap
{
    export class MapMoveObject extends MapDisplayObject
    {
        protected m_dwMoveSpeed:number = 1000;  //实体移动速度

        protected m_dwMoveStartTick: number = 0;	//移动开始的时间，若为0表示当前没有在移动
		protected m_dwMoveEndTick: number = 0;		//移动结束的时间

        protected m_nMoveTargetX: number = 0;		//移动的目的坐标X
		protected m_nMoveTargetY: number = 0; 		//移动的目的坐标Y
		protected m_nDirection: number = 0; 		//当前方向
        protected m_dMoveLongX: number = 0;		//X方向上每毫秒的移动长度（像素单位）
		protected m_dMoveLongY: number = 0;		//Y方向上每毫秒的移动长度（像素单位）
        protected m_boDisappeared:boolean = false;  //实体是否消失
        constructor()
        {
            super();
        }
        public GetMoveSpeed():number
        {
            return this.m_dwMoveSpeed;
        }

		public SetMoveSpeed(nMoveSpeed:number):void
		{
			this.m_dwMoveSpeed = nMoveSpeed;
		}
        public Update(nCurrentTick:number):void
        {
			
              //如果正在移动则处理移动
			if ( this.m_dwMoveStartTick > 0)
			{
				if ( nCurrentTick < this.m_dwMoveEndTick )
				{	
				
					this.ProcessMove(nCurrentTick - this.m_dwMoveStartTick);
				}
				else 
				{
					this.EndMove();
				}
			}
        }
        /** 
		 *  重载父类设置坐标的函数，以便在移动期间进行设定坐标的操作时可以停止移动
		 * @param X
		 * @param Y
		 * 
		 */
		public SetCurrentXY(X:number, Y:number):void
		{
			//如果正在移动则终止移动
			if ( this.m_dwMoveStartTick > 0)
			{
				this.EndMove();
			}
			super.SetCurrentXY(X, Y);
		}

        //是否正在移动
        public IsMoving():boolean
        {
            return this.m_dwMoveStartTick != 0;
        }
        //是否消失了
        public IsDisappeared():boolean
        {
            return this.m_boDisappeared;
        }

        /**
		 * 移动
		 * @param X 目标坐标X
		 * @param Y 目标坐标Y
		 * @param speed 实际的移动速度，单位是毫秒
		 */
		public MoveTo(X: number, Y: number, speed:number = 0): void
		{			
			if ( X == this.m_nCurrentX && Y == this.m_nCurrentY )
				return;
			//先终止移动
			if ( this.m_dwMoveStartTick > 0 )
			{
				if ( X == this.m_nMoveTargetX && Y == this.m_nMoveTargetY )
					return;
				this.EndMove();
			}
			//移动之前就先进行针对新坐标的排序操作
			this.SortOnContainer(this.m_nCurrentX, X, this.m_nCurrentY, Y);
			//判断是否使用默认速度
			let mSpeed:number;
			if(speed == 0)mSpeed = this.m_dwMoveSpeed;
			else mSpeed = speed;
			//计算移动所需的相关数据
			this.m_nMoveTargetX = X;
			this.m_nMoveTargetY = Y;
			//console.log("移动坐标x:"+this.m_nMoveTargetX+"移动坐标y:"+this.m_nMoveTargetY);
			this.m_dwMoveStartTick = Config.GlobalConfig.s_dwUpdateTick;
		
			this.m_dwMoveEndTick = this.m_dwMoveStartTick + mSpeed;
			//计算x和y方向每毫秒的移动距离（像素单位）
			this.m_dMoveLongX = Number((X - this.m_nCurrentX) * CustomMap.MAPCELLUNITWIDTH) / mSpeed;
			this.m_dMoveLongY = Number((Y - this.m_nCurrentY) * CustomMap.MAPCELLUNITHEIGHT) / mSpeed;
		}

        /**
		 * 移动完成后的处理函数 
		 * 
		 */
		protected EndMove():void
		{
			if ( this.m_dwMoveStartTick > 0 )
			{
				this.m_dwMoveStartTick = 0;
				this.SetCurrentXY( this.m_nMoveTargetX, this.m_nMoveTargetY );
			}
		}

        /**
		 * 处理移动过程的位置变更 
		 * @param MovedTick 自开始移动到现在的时间（ms）
		 * 
		 */
		protected  ProcessMove(MovedTick: number): void
		{
			let x:number = (this.m_nCurrentX + 0.5) * CustomMap.MAPCELLUNITWIDTH + this.m_dMoveLongX * MovedTick;
			let y:number = (this.m_nCurrentY + 0.5) * CustomMap.MAPCELLUNITHEIGHT + this.m_dMoveLongY * MovedTick;
			this.x = Math.floor(x);
			this.y = Math.floor(y);
		
		}

        public SetDirection(nDir:number):void
        {
            this.m_nDirection = nDir;
        }

        public GetDirection():number
        {
            return this.m_nDirection;
        }
    }
}