	/**
	 * 游戏地图绘制类 
	 * 实现有地图的绘制和资源的管理
	 * 		地图的绘制方式为：只显示屏幕内可以看到的图片，超出的图片不予显示；
	 * 当地图的位置发生了变化的时候，会重新铺设新显示区域的图片并删除不可显示
	 * 区域的图片
	 * @author 后天 2017.9.28
	 * 
	 */
    module GameMap
    {
        export class CustomRenderMap extends CustomMap
        {
            public static readonly MAP_VERTICAL_OFFSET_COORD:number = -1;   //地图Y方向中心位置坐标偏移量（全局）
            public static readonly CANMOVETOEDGE:Boolean = true;   //主角是否支持边缘移动    
            protected m_nCurrentX:number = 0;   //当前X坐标
            protected m_nCurrentY:number = 0;   //当前Y坐标
            protected m_nHCellCount: number = 0;//地图水平方向半个显示区域可以容纳的坐标数量
            protected m_nVCellCount: number = 0;//地图竖直方向半个显示区域可以容纳的坐标数量
            protected m_nShowContentX: number = 0;//当前地图显示内容的中心的X坐标
            protected m_nShowContentY: number = 0;//当前地图显示内容的中心的Y坐标
            protected m_MapLayerRoot:Laya.Sprite;  //地图所有层的显示容器
            protected m_Ground: Laya.Sprite;//作为背景层图像的容器
            protected m_Object: Laya.Sprite; //作为地图显示对象（物品、人物、怪物）等的容器
            protected m_nDisplayWidth: number = 0;//地图显示区域的像素宽度
            protected m_nDisplayHeight: number = 0;//地图显示区域的像素高度
            protected m_nDisplayCenterX: number = 0;//显示区域中心的X像素位置
            protected m_nDisplayCenterY: number = 0;//显示区域中心的Y像素位置 
            protected m_nLayersOffsetX: number = 0;//除背景外的各个层的微偏移量X（可做场景震动效果）
            protected m_nLayersOffsetY: number = 0;//除背景外的各个层的微偏移量Y（可做场景震动效果）
            protected m_DiplayContainer: Laya.Sprite = null;//地图的显示容器对象
            constructor()
            {
               super();
               this.m_MapLayerRoot = new Laya.Sprite();

               this.m_Ground = new Laya.Sprite();
               this.m_MapLayerRoot.addChild(this.m_Ground);
               
               this.m_Object = new Laya.Sprite();
               this.m_MapLayerRoot.addChild(this.m_Object);
               
            }
            public GetMapLayerRoot():Laya.Sprite
            {
                return this.m_MapLayerRoot;
            }
            public GetDisplayContainer(): Laya.Sprite
            {
                return this.m_DiplayContainer;
            }

            /**
             * m_DisplayerContainer的修改器
             * @param container
             * 修改m_DisplayerContainer后会自动将内部向其增加的DisplayObject移除，
             * 若新的Container非空则会将这些DisplayObject添加到新的Container中
             */
            public SetDisplayContainer(container:Laya.Sprite ): void
            {
                if ( this.m_MapLayerRoot.parent )
                {
                    this.m_MapLayerRoot.parent.removeChild(this.m_MapLayerRoot);
                }
				
                this.m_DiplayContainer = container;
                if ( container )
                {
                    container.addChild(this.m_MapLayerRoot);
                }
            }
             /**
             *设置当前中心位置的X和Y坐标
             * @param x
             * @param y
             * 
             */
            public SetCurrentPosition(x: number, y: number): void
            {
                if ( x < 0 || y < 0 || x >= this.m_nWidth || y >= this.m_nHeight )
                {
                    return;
                }
                if ( this.m_nCurrentX == x && this.m_nCurrentY == y )
                    return;
                this.m_nCurrentX = x;
                this.m_nCurrentY = y;
   
                //更新地图显示内容
                this.ShowMapContent(x, y);
            }

            /**
             * 以x,y为中心坐标刷新地图显示内容 
             * @param x
             * @param y
             * 
             */
            protected  ShowMapContent(x: number, y: number): void
            {
                //检查小地图的显示区域是否需要更新
               // this.CheckCopyMinimap( x, y );
                //重新计算和分布地图显示区域
                this.RebuildDisplayArea( x, y );
                //更新地图各个层在displayContainer中的位置
                //注意由于坐标是自左向右和自上向下为轴向，所以此处应当采用x和y坐标的负值
                this.SetLayersPosition( -x * CustomMap.MAPCELLUNITWIDTH, -y * CustomMap.MAPCELLUNITHEIGHT );
                //保存显示更新坐标
                this.m_nShowContentX = x;
                this.m_nShowContentY = y;
            }
            /**
             *	重新构建地图当前的显示区域
             *	包括背景层和建筑层 
             * 
             */
            private  RebuildDisplayArea(x: number, y: number): void
            {
                //删除超出显示区域的地砖图片和物体图片
                this.RemoveOutOfDisplaySizeImages(x, y);
                //重新铺设显示区域内的地转和物体
                this.ReDistributeMapLayers(x, y);
            }

            /**
             * 移动地图所有层
             * @param x	水平方向的像素坐标
             * @param y	竖直方向的像素坐标
             * 
             */
            protected  SetLayersPosition(x:number, y: number): void
            {
                
                this.m_MapLayerRoot.x = x + this.m_nDisplayCenterX + this.m_nLayersOffsetX;
                if(CustomRenderMap.CANMOVETOEDGE)
                {
                    if(this.m_MapLayerRoot.x > 0)
                       this. m_MapLayerRoot.x = 0;
                    else if(this.m_MapLayerRoot.x < this.m_nDisplayWidth - this.m_nWidthPixel)
                        this.m_MapLayerRoot.x = this.m_nDisplayWidth - this.m_nWidthPixel;
                }
                
                this.m_MapLayerRoot.y =  y + this.m_nDisplayCenterY + this.m_nLayersOffsetY;
                if(CustomRenderMap.CANMOVETOEDGE)
                {
                    if(this.m_MapLayerRoot.y > 0)
                        this.m_MapLayerRoot.y = 0;
                    else if(this.m_MapLayerRoot.y < this.m_nDisplayHeight - this.m_nHeightPixel)
                        this.m_MapLayerRoot.y = this.m_nDisplayHeight - this.m_nHeightPixel;
                }
            }

             /**
             *从某个DisplayObjectContainer中移除超出显示范围的Image 
             * 
             */
            private  RemoveOutOfDisplaySizeImages(x: number, y: number): void
            {
                //计算出当前显示区域的显示的坐标范围
                var range: Common.Rectangle = this.CalcMapContentRange(x, y);
                let left:number = range._nX;
                let top:number = range._nY;
                let right:number = range._nRight;
                let bottom:number = range._nBottom;
                //将坐标转化为像素
                left *= CustomMap.MAPCELLUNITWIDTH;
                top *= CustomMap.MAPCELLUNITHEIGHT;
                right *= CustomMap.MAPCELLUNITWIDTH;
                bottom *= CustomMap.MAPCELLUNITHEIGHT;
                //删除地表层中x或y超出显示范围的显示对象
                //注意必须是降序循环，因为有删除操作
                for (let i:number = this.m_Ground.numChildren-1; i>-1; --i )
                {
                    let img:Laya.Sprite  = this.m_Ground.getChildAt(i) as Laya.Sprite;
                    if (img && ( img.x < left || img.y < top || img.x > right || img.y > bottom) )
                    {
                        this.m_Ground.removeChildAt(i);
                        let cell:MapCell = this.m_Cells[(img.y / CustomMap.MAPCELLUNITHEIGHT) * this.m_nWidth + (img.x / CustomMap.MAPCELLUNITWIDTH)];
                        if ( cell._bkImg == img )
                        {
                            cell._bkImg = null;
                        }
                        else
                        {
                            throw new Error("removeOutOfDisplaySizeImages::cell.bkImg != img");
                        }
                    }
                }
            }
            /**
             * 计算以x,y为中心的地图内容显示区域范围
             * @param x
             * @param y
             * @return 
             * 
             */
            protected  CalcMapContentRange(x: number, y: number): Common.Rectangle
            {
              
                let result: Common.Rectangle = new Common.Rectangle();
                
                result._nX = x - this.m_nHCellCount  - this.MAPTILEHBLOCK;
                result._nY = y - this.m_nVCellCount  - this.MAPTILEVBLOCK - CustomRenderMap.MAP_VERTICAL_OFFSET_COORD;
                result._nRight = x + this.m_nHCellCount + this.MAPTILEHBLOCK;
                result._nBottom = y + this.m_nVCellCount  + this.MAPTILEVBLOCK - CustomRenderMap.MAP_VERTICAL_OFFSET_COORD;
                
                if ( result._nX < 0 ) result._nX = 0;
                if ( result._nY < 0 ) result._nY = 0;
                //由于地表层的铺设在地图编辑器中规定为必须铺设在X为MAPTILEHBLOCK的倍数，Y为MAPTILEVBLOCK倍数的位置上
                //所以为了避免显示区域的起始位置不在MAPTILEHBLOCK或MAPTILEVBLOCK的整倍数上而造成边沿区域没有图像的情况，
                //固应当将left和top都对分别对齐到MAPTILEHBLOCK和MAPTILEVBLOCK的整倍数上
                result._nX -= result._nX % this.MAPTILEHBLOCK;
                result._nY-= result._nY % this.MAPTILEVBLOCK;
                if ( result._nRight >= this.m_nWidth ) result._nRight = this.m_nWidth - 1;
                if ( result._nBottom >= this.m_nHeight ) result._nBottom = this.m_nHeight - 1;
                
                return result;
            }
            /**
             *	重新铺设背景层和建筑层在显示区域中没有显示的位置 
             * 
             */
            private  ReDistributeMapLayers(x: number, y: number): void
            {
                // var sp: Sprite;
                // var left: int, top: int, right: int, bottom: int, x: int, y: int;
                // var cell: MapCell;
                // var img: CloneableBitmap;
                // var bdBmp: MapBuildingBitmap;
                // var pxStart: int, pyStart: int, px: int, py: int;
                // var px_inc: int, py_inc: int;
                // var cellStart: int, cellIndex: int;
                
                /**计算背景层需要铺设的坐标区域
                 * 需要注意的是，地转的铺设要比显示区域最左上端的坐标再分别向上MAPTILEVBLOCK坐标且向左MAPTILEHBLOCK个坐标，
                 * 因为一个地转块的大小是MAPTILEHBLOCK x MAPTILEVBLOCK坐标，如果直接从显示区域的首个可见坐标处开始铺设
                 * 地转则可能会造成边缘空白的黑快区域
                 * 另外铺设地砖的终止坐标也要增加X:MAPTILEHBLOCK和Y:MAPTILEVBLOCK坐标以便于预读图像资源
                 * **/
                let range: Common.Rectangle = this.CalcMapContentRange(x, y);
                let left:number = range._nX;
                let top:number = range._nY;
                let right:number = range._nRight;
                let bottom :number= range._nBottom;
                
                //计算出铺设图片的启示像素坐标
                let pxStart:number = left * CustomMap.MAPCELLUNITWIDTH;
                let pyStart:number = top * CustomMap.MAPCELLUNITHEIGHT;
                //开始铺设地转
                y = top;
                let py:number = pyStart;
                let cellStart:number = top * this.m_nWidth + left;
                let px_inc:number = CustomMap.MAPCELLUNITWIDTH * this.MAPTILEHBLOCK;
                let py_inc:number = CustomMap.MAPCELLUNITHEIGHT * this.MAPTILEVBLOCK;
                while ( y <= bottom )
                {
                    x = left;
                    let px:number = pxStart;
                    let cellIndex:number = cellStart;
                    while ( x <= right )
                    {
                        let cell:MapCell = this.m_Cells[cellIndex];
                        if (cell != null && cell._nBkImgIdx > 0 && cell._bkImg == null )
                        {

                            let img:Laya.Sprite = MapResManager._Instance.GetTileImg(cell._nBkImgIdx);
                            if ( img )
                            {
                                this.m_Ground.addChild(img);
                                img.x = px;
                                img.y = py;
                                cell._bkImg = img;
                            }
                        }
                        x += this.MAPTILEHBLOCK;
                        px += px_inc;
                        cellIndex += this.MAPTILEHBLOCK;
                    }
                    y += this.MAPTILEVBLOCK;
                    py += py_inc;
                    cellStart += this.m_nWidth * this.MAPTILEVBLOCK;
                }
            }


            /**
             *设置地图显示区域大小 
             * @param width 显示区域宽度
             * @param height 显示区域高度
             * 
             */
            public  SetDisplaySize(width: number, height: number): void
            {
                if ( width != this.m_nDisplayWidth || height != this.m_nDisplayHeight )
                {
                    this.m_nDisplayWidth = width;
                    this.m_nDisplayHeight = height;
                    /**
                     * 计算显示区域的中心位置（非绝对中心)
                     * 由于人是处于一个坐标的中心的(x+32:y+16)所以需要将中心位置向左和向上偏移半个坐标的像素大小
                     * ***/
                    this.m_nDisplayCenterX = width / 2 - CustomMap.MAPCELLUNITWIDTH / 2;
                    this.m_nDisplayCenterY = height / 2 - CustomMap.MAPCELLUNITHEIGHT / 2;
                    //重新计算1/4个显示区域内的水平和数值方向的坐标数量
                    this.m_nHCellCount = width / CustomMap.MAPCELLUNITWIDTH;
                    if (this.m_nDisplayWidth % CustomMap.MAPCELLUNITWIDTH) 
                        this.m_nHCellCount++;
                    this.m_nVCellCount = this.m_nDisplayCenterY / CustomMap.MAPCELLUNITHEIGHT;
                    if (this.m_nDisplayHeight % CustomMap.MAPCELLUNITHEIGHT) 
                        this.m_nVCellCount++;
                        
                    //横版地图的地图显示中心要向下偏移一个坐标的高度
                    this.m_nDisplayCenterY += CustomMap.MAPCELLUNITHEIGHT * CustomRenderMap.MAP_VERTICAL_OFFSET_COORD;
                    //更新地图显示内容
                    this.UpdateMapContent();
                }
            }
            /**
             * 更新本次显示地图的内容 
             * 
             */
            protected UpdateMapContent(): void
            {
                this.ShowMapContent(this.m_nShowContentX, this.m_nShowContentY);
            }
            /**
             * 向地图中添加一个显示对象
             * @param obj 要添加的显示对象
             * 
             */
            public AddObject(obj: MapDisplayObject): void
            {
                this.m_Object.addChildAt(obj, obj.CalcDisplayIndex(this.m_Object));
            }
            /**
             * 从地图中删除一个显示对象
             * @param obj 要删除的显示对象
             * 
             */
            public RemoveObject(obj: MapDisplayObject): void
            {
                this.m_Object.removeChild(obj);
            }

            	/**
		 *在当前场景中转换屏幕像素坐标到地图坐标 
		 * @param x	基于displayContainer的像素坐标X
		 * @param y	基于displayContainer的像素坐标Y
		 * @return 
		 * 
		 */
		public  ScreenToCoord(x: number, y: number): Laya.Point
		{
           
			var pt: Laya.Point = new Laya.Point(    
                    Math.floor(x - this.m_MapLayerRoot.x) / CustomMap.MAPCELLUNITWIDTH,
                    Math.floor(y - this.m_MapLayerRoot.y) / CustomMap.MAPCELLUNITHEIGHT
				);
			if ( pt.x < 0 ) pt.x = 0;
			if ( pt.x >= this.m_nWidth ) pt.x = this.m_nWidth - 1;
			if ( pt.y < 0 ) pt.y = 0;
			if ( pt.y >= this.m_nHeight ) pt.y = this.m_nHeight - 1;
            pt.x = Math.floor(pt.x);
            pt.y = Math.floor(pt.y);
			return pt;
		}
        }
    }