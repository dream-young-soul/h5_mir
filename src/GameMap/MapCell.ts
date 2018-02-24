	/**
	 *	地图坐标单元格数据对象类
	 * @author 后天 2017.9.28
	 * 
	 */
module GameMap
{
    export class MapCell
    {
        public _nBkImgIdx:number = 0;   //背景层图片编号
        public _nFtImgIdx:number = 0;   //物体层图片编号
        public _nFtObjIdx:number = 0;   //物体层图片分类编号
        public _nFlags:number = 0;      //标识
        public _bkImg:Laya.Sprite = null;   //地砖背景
    }
}