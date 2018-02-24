module GameMap
{
    	/**
	 * 地图显示对象的基础类，地图中的物品、角色等对象都将继承此类
	 * 当对象的地图坐标发生变化后，会自动在显示容器中重新排序
	 * ★★★★ 父容器中的所有显示对象必须都是此类型或此类型的子类型，不得与其他类型的显示组件混合放在同一和显示容器中!
	 * ★★★★ 排序的规则是：
	 * 		Y坐标大的显示在前面，如果Y坐标相同则X坐标小的显示在前面，对于相同坐标的对象，排序等级越高的显示在前面
	 * ★★★★ 不能使用addChild将此对象添加到显示容器中！
	 * ★★★★ 必须使用addChildAt，其中索引通过调用函数calcDisplayIndex来计算
	 * @author 后天 2017.9.30
	 * 
	 */
    export class MapDisplayObject extends Laya.Sprite
    {
        protected m_nCurrentX:number = 0;   //当前地图坐标X
        protected m_nCurrentY:number = 0;   //当前地图坐标Y
        protected m_nSortLevel:number = 0;  //对于处于同一坐标的排序优先级，优先级越大的越排到前面
        protected m_nSortRowLevel:number = 0;   //对于处于同坐标行（Row）的排序优先级，优先级越大的越排到前面，此优先级高于m_nShortLevel
        constructor()
        {
            super();
        }

        public GetCurentX():number
        {
            return this.m_nCurrentX;
        }

        public GetCurrentY():number
        {
            return this.m_nCurrentY;
        }

/**
		 * 设定当前坐标位置 
		 * 会基于新的Y值在显示容器中重新排序
		 * @param X
		 * @param Y
		 * 
		 */
		public SetCurrentXY(X: number, Y: number): void
		{
			if ( X != this.m_nCurrentX || Y != this.m_nCurrentY )
			{
				this.SortOnContainer(this.m_nCurrentX, X, this.m_nCurrentY, Y);
			}
			this.m_nCurrentX = X;
			this.m_nCurrentY = Y;
			//console.log("最终目标x:"+this.m_nCurrentX+"最终目标Y:"+this.m_nCurrentY);
			this.x = CustomMap.MAPCELLUNITWIDTH * (X + 0.5);
			this.y = CustomMap.MAPCELLUNITHEIGHT * (Y + 0.5);
		}

        /**
		 * 状态处理函数，子类如果需要周期或循环性的处理某些逻辑则应当覆盖此函数 
		 * @param CurrentTick 当前系统运行时间
		 * 
		 */
		public Update(nCurrentTick: number): void
		{

		}

        		/**
		 * 计算在显示容器中的显示顺序
		 * 此函数的设计初衷是向CustomRenderMap提供插入地图物体的索引值的计算功能 
		 * @param Container  显示容器
		 * @return 
		 * 
		 */
		public CalcDisplayIndex(Container: Laya.Sprite):number
		{
			let nIndex: number = Container.numChildren - 1;
			let mapObj: MapDisplayObject;
			//先基于Y坐标排序
			while (nIndex > -1)
			{
				mapObj = Container.getChildAt(nIndex) as MapDisplayObject;
				//使用<=判断，会终止在新的Y坐标行中的第一个对象的前面
				if (mapObj != null &&  mapObj.m_nCurrentY <= this.m_nCurrentY )
					break;
				nIndex--;
			}
			//再基于X坐标排序
			//由于是终止在新的Y坐标行中的第一个对象的前面，
			//所以这里应当继续在同Y行中尝试向后移动，直到遇到Y坐标不同或X坐标大于等于自身X坐标的对象
			while (nIndex > -1)
			{
				mapObj = Container.getChildAt(nIndex) as MapDisplayObject;
				if ( mapObj.m_nSortRowLevel < this.m_nSortRowLevel )
					break;
				else if ( mapObj.m_nSortRowLevel == this.m_nSortRowLevel )
				{
					if ( mapObj.m_nCurrentY != this.m_nCurrentY )
						break;
					if ( mapObj.m_nCurrentX > this.m_nCurrentX )
						break;
					else if ( mapObj.m_nCurrentX == this.m_nCurrentX )
					{
						//对于相同位置的角色，优先级小的排列在后面
						if (mapObj.m_nSortLevel <= this.m_nSortLevel)
							break;
					}
				}
				nIndex--;
			}
			return nIndex + 1;
		}

        		/*********************************************
		 * 以下为私有和保护函数
		 ********************************************/
		/**
		 * 基于自身的的地图坐标坐标在显示容器中排序 
		 * @param OldY
		 * @param NewY
		 * 
		 */
		protected  SortOnContainer(OldX: number, NewX: number, OldY: number, NewY: number): void
		{
            
			let myParent: Laya.Sprite = this.parent as Laya.Sprite;
			if ( !myParent )
				return;
			let mapObj: MapDisplayObject;
			let nIndex: number, nOldIndex: number, nY: number;
			let nCount: number = myParent.numChildren;
			nOldIndex = myParent.getChildIndex(this);
			
			nIndex = nOldIndex;
			//Y坐标减少了，显示顺序应当向后移动
			if ( NewY < OldY )
			{
				nIndex--;
				while ( nIndex > -1 )
				{
					mapObj = myParent.getChildAt(nIndex) as MapDisplayObject;
					//使用<=判断，会终止在新的Y坐标行中的第一个对象的前面
					if ( mapObj.m_nCurrentY <= NewY )
						break;
					nIndex--;
				}
				//由于是终止在新的Y坐标行中的第一个对象的前面，
				//所以这里应当继续在同Y行中尝试向后移动，直到遇到Y坐标不同或X坐标大于等于自身X坐标的对象
				while ( nIndex > -1 )
				{
					mapObj = myParent.getChildAt(nIndex) as MapDisplayObject;
					if ( mapObj.m_nSortRowLevel < this.m_nSortRowLevel )
						break;
					else if ( mapObj.m_nSortRowLevel == this.m_nSortRowLevel )
					{
						if ( mapObj.m_nCurrentY != NewY )
							break;
						if ( mapObj.m_nCurrentX > NewX )
							break;
						else if ( mapObj.m_nCurrentX == NewX )
						{
							//对于相同位置的角色，优先级小的排列在后面
							if (mapObj.m_nSortLevel <= this.m_nSortLevel)
								break;
						}
					}
					nIndex--;
				}
				nIndex++;
			}
			//Y坐标增加了，显示顺序应当向上移动
			else if ( NewY > OldY )
			{
				nIndex++;
				while ( nIndex < nCount )
				{
					mapObj = myParent.getChildAt(nIndex) as MapDisplayObject;
					//使用>=判断，会终止在新的Y坐标行中最后一个对象的后面
					if ( mapObj.m_nCurrentY >= NewY )
						break;
					nIndex++;
				}
				//由于是终止在新的Y坐标行中最后一个对象的后面，
				//所以这里应当继续在同Y行中尝试向前移动，直到遇到Y坐标不同或X坐标小于等于自身X坐标的对象
				while ( nIndex < nCount )
				{
					mapObj = myParent.getChildAt(nIndex) as MapDisplayObject;
					if ( mapObj.m_nSortRowLevel > this.m_nSortRowLevel )
						break;
					else if ( mapObj.m_nSortRowLevel == this.m_nSortRowLevel )
					{
						if ( mapObj.m_nCurrentY != NewY )
							break;
						if ( mapObj.m_nCurrentX < NewX )
							break;
						else if ( mapObj.m_nCurrentX == NewX )
						{
							//对于相同位置的角色，优先级小的排列在后面
							if (mapObj.m_nSortLevel >= this.m_nSortLevel)
								break;
						}
					}
					nIndex++;
				}
				nIndex--;
			}
			//Y方向没有变化，X方向坐标减少了，显示顺序应当向前移动
			else if ( NewX < OldX )
			{
				nIndex++;
				while ( nIndex < nCount )
				{
					mapObj = myParent.getChildAt(nIndex) as MapDisplayObject;
					if ( mapObj.m_nSortRowLevel > this.m_nSortRowLevel )
						break;
					else if ( mapObj.m_nSortRowLevel == this.m_nSortRowLevel )
					{
						if ( mapObj.m_nCurrentY != NewY )
							break;
						if ( mapObj.m_nCurrentX < NewX )
							break;
						else if ( mapObj.m_nCurrentX == NewX )
						{
							//对于相同位置的角色，优先级小的排列在后面
							if (mapObj.m_nSortLevel >= this.m_nSortLevel)
								break;
						}
					}
					nIndex++;
				}
				nIndex--;
			}
			//Y方向没有变化，X方向坐标增加了，显示顺序应当向后移动
			else if ( NewX > OldX )
			{
				nIndex--;
				while ( nIndex > -1 )
				{
					mapObj = myParent.getChildAt(nIndex) as MapDisplayObject;
					if ( mapObj.m_nSortRowLevel < this.m_nSortRowLevel )
						break;
					else if ( mapObj.m_nSortRowLevel == this.m_nSortRowLevel )
					{
						if ( mapObj.m_nCurrentY != NewY )
							break;
						if ( mapObj.m_nCurrentX > NewX )
							break;
						else if ( mapObj.m_nCurrentX == NewX )
						{
							//对于相同位置的角色，优先级小的排列在后面
							if (mapObj.m_nSortLevel <= this.m_nSortLevel)
								break;
						}
					}
					nIndex--;
				}
				nIndex++;
			}

			if ( nIndex != nOldIndex )
			{
				myParent.setChildIndex(this, nIndex);
			}
		}


    }
}