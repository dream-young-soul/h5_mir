	/**
	 *	游戏地图基础类
	 *	具备读取地图文件的主要功能以及提供对于地图的必要的属性访问器
	 * 	包含一些与地图有关的常量定义
	 * @author 后天 2017.9.28
	 * 
	 */

    module GameMap
    {
        export class CustomMap
        {
           public static readonly MAPCELLUNITWIDTH:number = 48;  //地图每个坐标所占横向像素大小
           public static readonly MAPCELLUNITHEIGHT:number = 32; //地图每个坐标所占纵向像素大小
           public readonly MAPTILEHBLOCK:number = 4;    //每块地表所占地图横向坐标数量,每个地表块所包含的坐标数量是4x8
           public readonly MAPTILEVBLOCK:number = 8;    //每块地表所占地图纵向坐标数量
           public readonly MAPOBJHALIGN:number = 1;     //地面建筑物体层的水平对齐坐标
           public readonly MAPOBJVALIGN:number = 2;     //地面建筑物体层的纵向对齐坐标
           public static readonly CELLFLG_UNMOVEABLE:number =  0x8000; //地图坐标的不可移动标记
           public static readonly CELLFLG_HIDDEN:number = 0x4000;  //地图坐标的遮挡标记
           protected m_Cells:MapCell[] = [];  //地图坐标据表，内存布局方式为ROW - COL
           protected m_nWidth:number = 0;   //地图宽度
           protected m_nHeight:number = 0;  //地图高度
           protected m_nWidthPixel:number = 0;  //地图宽度(像素)
           protected m_nHeightPixel:number = 0; //地图高度(像素)
           protected m_MapPath:MapPath; //A星寻路
           constructor()
           {

           }

           //析构
           public Destruct():void
           {

           }

           public Load(bytes:Laya.Byte):void
           {
               bytes.endian = "littleEndian";
               //读取文件标识
               let uval:number = bytes.getUint32();
               if(uval != 0x00504D57)
               {
                   Common.MirLog.Log(Common.MirLogType.Error,"非有效地图文件头");
               }
               //读取文件版本
               uval = bytes.getUint32();
               if(uval != 0x000A0302)
               {
                    Common.MirLog.Log(Common.MirLogType.Error,"地图文件有效，但不是可使用的地图版本。");
               }
               
			  //读取宽度和高度
              let nWidth:number = bytes.getInt32();
              let nHeight:number = bytes.getInt32();
              bytes.pos += 48;  //跳过48个保留字节
              
               //解压地图数据段的字节流
              let data:Laya.Byte = new Laya.Byte();
              data.endian = bytes.endian;
              data.writeArrayBuffer(bytes.__getBuffer(),bytes.pos);
              bytes = null;
              data.pos = 0;
              let zip:Zlib.Inflate = new Zlib.Inflate( new Uint8Array(data.__getBuffer()))
              let buff = zip.decompress();
              bytes = new Laya.Byte(buff);

              this.m_nWidth = nWidth;
              this.m_nHeight = nHeight;
              this.m_nWidthPixel = this.m_nWidth * CustomMap.MAPCELLUNITWIDTH;
              this.m_nHeightPixel = this.m_nHeight * CustomMap.MAPCELLUNITHEIGHT;
              this.ClearMapData();
              if(this.m_MapPath != null)
              {
                  this.m_MapPath.Destory();
                  this.m_MapPath = null;
              }
              this.m_MapPath = new MapPath(this.m_nWidth,this.m_nHeight);
              for(let i:number = 0;i < this.m_nWidth * this.m_nHeight;i++)
              {
                    let cell:MapCell = new MapCell();
                    let tempBk:number = bytes.getUint16();
                    cell._nFtImgIdx = bytes.getUint16();
                    cell._nFlags = bytes.getUint16();
                    cell._nFtObjIdx = bytes.getByte();
                    let temp:number = bytes.getByte();
                    cell._nBkImgIdx = Common.NumericUtils.MakeLong(tempBk,temp);
                    this.m_Cells.push(cell);
                    if((cell._nFlags & CustomMap.CELLFLG_UNMOVEABLE) != 0)
                    {
                        this.m_MapPath.SetPointMaskByIndex(i,MaskInfo.MASK_FLAG_CLOSE,MaskInfo.MASK_TYPE_MAP);
                    }
              }

           }

           //清除地图格子数据
           protected ClearMapData():void
           {
               this.m_Cells = [];
           }

           //取地图宽度
           public GetMapWidth():number
           {
               return this.m_nWidth;
           }
           public GetMapPath():MapPath
           {
               return this.m_MapPath;
           }
           //取地图高度
           public GetMapHeight():number
           {
               return this.m_nHeight;
           }

           	/**
             *	获取地图某个坐标对象 
             * @param x	X坐标
             * @param y Y坐标
             * @return  该坐标位置的坐标对象
             * 
             */
           public GetCell(x:number,y:number):MapCell
           {
               if ( x < 0 || y < 0 || x >= this.m_nWidth || y >= this.m_nHeight )
               {
                   return null;
               }
               return this.m_Cells[y * this.m_nWidth + x];
           }

           		/**
             * 判断指定的坐标是否可以移动 
             * @param x
             * @param y
             * @return 
             * 
             */
            public Moveable(x:number, y: number):boolean
            {
                if ( x >= this.m_nWidth || y >= this.m_nHeight )
                    return false;
                return (this.m_Cells[y * this.m_nWidth + x]._nFlags & CustomMap.CELLFLG_UNMOVEABLE) == 0;
            }


            /**
             * 判断指定的坐标是否属于遮挡区 
             * @param x
             * @param y
             * @return 
             * 
             */
            public  Hidden(x:number, y: number):boolean
            {
                if ( x >= this.m_nWidth || y >= this.m_nHeight )
                    return false;
                return (this.m_Cells[y * this.m_nWidth + x]._nFlags & CustomMap.CELLFLG_HIDDEN) != 0;
            }



            /************************************************
             * 以下函数为静态公开函数
             ***********************************************/
            /**
             * 计算某个坐标向某个方向移动一定距离后的新坐标 
             * @param currentX	当前X坐标
             * @param currentY	当前Y坐标
             * @param direction	移动方向
             * @param step	移动距离
             * @return 移动后的新坐标
             * 
             */
            public static CalcForwardPosition(currentX: number, currentY: number, direction: number, step: number): Laya.Point
            {
                switch (direction)
                {
                case 0: return new Laya.Point(currentX, currentY - step);
                case 1: return new Laya.Point(currentX + step, currentY - step);
                case 2: return new Laya.Point(currentX + step, currentY);
                case 3: return new Laya.Point(currentX + step, currentY + step);
                case 4: return new Laya.Point(currentX, currentY + step);
                case 5: return new Laya.Point(currentX - step, currentY + step);
                case 6: return new Laya.Point(currentX - step, currentY);
                case 7: return new Laya.Point(currentX - step, currentY - step);
                default: Common.MirLog.Log(Common.MirLogType.Error,"计算前方位置时传递了无效的方向:" + direction);
                }
            }

            /**
             * 取背后方向
             * @dir 方向
             * @return 背后方向
             * */
            public static  GetBackDirection(dir:number):number
            {
                let arr_dir = [4,5,6,7,0,1,2,3];
                if(dir >= arr_dir.length )
                {
                    return 0;
                }
                return arr_dir[dir];
            }

             /**
             * 根据方向与步伐坐标取下一个坐标点
             * @dir 方向
             * @return 背后方向
             * */
            public static  CalcNextPoint(currentX:number,currentY:number,dir:number,step:number):Laya.Point
            {
                let p:Laya.Point = new Laya.Point(currentX,currentY);
                switch(dir)
                {
                    case 0:
                    {
                        p.y = p.y - step;
                        break;
                    }
                    case 1:
                    {
                        p.x =  p.x + step;
                        p.y = p.y - step;
                        break;
                    }
                    case 2:
                    {
                        p.x = p.x + step;
                        break;
                    }
                    case 3:
                    {
                        p.x = p.x + step;
                        p.y = p.y + step;
                        break;
                    }
                    case 4:
                    {
                        p.y = p.y + step;
                        break;
                    }
                    case 5:
                    {
                        p.x = p.x - step;
                        p.x = p.y + step;
                        break;
                    }
                    case 6:
                    {
                        p.x = p.x - step;
                        break;
                    }
                    case 7:
                    {
                        p.x = p.x - step;
                        p.x = p.y - step;
                        break;
                    }
                }
                return p;
            }


                /**
             * 计算当前坐标与另一个坐标的方向 
             * @param currentX	当前X坐标
             * @param currentY	当前Y坐标
             * @param targetX	目标X坐标
             * @param targetY	目标Y坐标
             * @return 方向
             * 
             */
            public static CalcForwardDirection(currentX: number, currentY: number, targetX: number, targetY: number): number
            {
                if ( currentX == targetX )
                {
                    return ( currentY <= targetY ) ? 4 : 0;
                }
                else if ( currentY == targetY )
                {
                    return ( currentX > targetX ) ? 6 : 2;
                }
                else if ( currentX < targetX )
                {
                    return ( currentY > targetY ) ? 1 : 3;
                }
                else 
                {
                    return ( currentY > targetY ) ? 7 : 5
                }
            }


                /**
             * 以圆心(centreX,centreY)为中心，计算坐标(X,Y)与圆心从0点钟方向开始的角度
             * @param centreX 圆心X坐标
             * @param centreY 圆心Y坐标
             * @param X
             * @param Y
             * @return 
             * 
             */
            public static  CalcAngle(centreX: number, centreY: number, x: number, y: number): number
            {
                let nQuadrant: number;
                let dAngle;
                
                if ( x < centreX )
                {
                    if ( y < centreY )
                        nQuadrant = 3;
                    else if ( y > centreY )
                        nQuadrant = 2;
                    else return 270;
                }
                else if ( x > centreX )
                {
                    if ( y < centreY )
                        nQuadrant = 0;
                    else if ( y > centreY )
                        nQuadrant = 1;
                    else return 90;
                }
                else if ( x == centreX )
                {
                    if ( y < centreY )
                        return 0;
                    if ( y > centreY )
                        return 180;
                    return 0;
                }
            
                x -= centreX;
                y -= centreY;
            
                switch ( nQuadrant )
                {
                case 0:
                case 2:
                    if ( !y ) y = 1;
                    dAngle = Math.atan( x /y );
                    break;
                case 1:
                case 3:
                    if ( !x ) x = 1;
                    dAngle = Math.atan( y / x );
                    break;
                }
            
                dAngle = dAngle / 3.1415926 * 180;
            
                dAngle = Math.abs(dAngle) + nQuadrant * 90;
                return dAngle;
            }
                /**
             * 精确计算从一个坐标到另一个坐标的方向 
             * @param StartX
             * @param StartY
             * @param TargertX
             * @param TargetY  
             * @return 
             * 
             */
            public static CalcDirection(StartX: number, StartY: number, TargetX: number, TargetY: number): number
            {
                //相同坐标则面向下
                if ( StartX == TargetX && StartY == TargetY )
                    return 4;
                var angle: number = this.CalcAngle(StartX * CustomMap.MAPCELLUNITWIDTH, StartY * CustomMap.MAPCELLUNITHEIGHT, 
                    TargetX * CustomMap.MAPCELLUNITWIDTH, TargetY * CustomMap.MAPCELLUNITHEIGHT);
                angle += 23;
                angle /= 360/8;
                return angle & 7;
            }

    
        }
    }