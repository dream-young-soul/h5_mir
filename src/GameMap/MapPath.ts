/**
 * A星寻路
 * @author 后天 2017.10.4
 */
module GameMap
{
    class TTree
    {
        public nH:number;
        public nX:number;
        public nY:number;
        public nDir:number;
        public Father:TTree;
        constructor()
        {
           this.nH = 0;
           this.nX = 0;
           this.nY = 0;
           this.nDir = 0;
           this.Father = null;
        }

    }

    class TLink
    {
        public node:TTree ;
        public nF:number ;
        public next:TLink ;
       constructor()
        {
            this.node = null;
            this.next = null;
            this.nF = 0;
        }
    }
    export class MaskInfo
    {
        public static readonly MASK_FLAG_OPEN:number =1;
        public static readonly MASK_FLAG_CLOSE:number =0;

        public static readonly MASK_TYPE_MAP:number =1;
        public static readonly MASK_TYPE_MONSTER:number = 2;
        public _nFlag:number;   //标记
        public _bType:number;   //类型

    }
    export class MapPath
    {
        
        private m_nWidth:number = 0;    //宽度
        private m_nHeight:number = 0;   //高度
        private m_MapData:MaskInfo[]=[];
        private m_PassPoint:number[] =[];
        private m_Queue:TLink = new TLink();
        constructor(nWidth:number,nHeight:number)
        {
            this.m_nWidth = nWidth;
            this.m_nHeight = nHeight;
            for(let i:number = 0;i < this.m_nWidth * this.m_nHeight;i++)
            {
                let pMaskInfo:MaskInfo = new MaskInfo();
                pMaskInfo._nFlag = MaskInfo.MASK_FLAG_OPEN;
                pMaskInfo._bType = 0;
                this.m_MapData.push(pMaskInfo);
                this.m_PassPoint.push(0);
            }
        }
        public Destory():void
        {
            this.m_MapData = [];
            this.m_PassPoint =[];
            
        }
        public  SetPointMaskByIndex(nIndex:number, nTag:number,nType:number):void
        {
            this.m_MapData[nIndex]._bType = nType;
            this.m_MapData[nIndex]._nFlag = nTag;
        }
        public  SetPointMask(nX:number,nY:number, nTag:number,nType:number):void
        {
            if(nX < 0 || nY < 0)
            {
                return;
            }
            if(nX >= this.m_nWidth || nY >= this.m_nHeight)
            {
                return;
            }
           
            let pMaskInfo:MaskInfo = this.GetMaskInfo(nX,nY);
             //地图阻挡是不会动态改变的
            if(pMaskInfo._bType == MaskInfo.MASK_TYPE_MAP)
            {
                return;
            }
            pMaskInfo._nFlag = nTag;
            pMaskInfo._bType = nType;
        }

        public GetMaskInfo(nX:number,nY:number)
        {
            return this.m_MapData[nY * this.m_nWidth + nX];
        }
        private  GetFromQueue():TTree
        {
            let bestchoice:TTree;
            let Next:TLink;
            bestchoice = this.m_Queue.next.node;
            Next = this.m_Queue.next.next;
            this.m_Queue.next = null;
            this.m_Queue.next = Next;
            return bestchoice;
        }
        private  InitQueue():void
        {
            this.m_Queue = new TLink();
            this.m_Queue.node = null;
            this.m_Queue.nF = -1;
            this.m_Queue.next = new TLink();
            this.m_Queue.next.nF = 0xfffffff;
            this.m_Queue.next.node = null;
            this.m_Queue.next.next = null;
        }

        private  EnterQueue(node:TTree , nf:number ):void
        {
            let p:TLink = this.m_Queue;
            let Father:TLink = p;
            while (nf > p.nF)
            {
                Father = p;
                p = p.next;
                if (p == null) break;
            }
            let q:TLink = new TLink();
            q.nF = nf;
            q.node = node;
            q.next = p;
            Father.next = q;
        }
    // 估价函数,估价 x,y 到目的地的距离,估计值必须保证比实际值小		
        private  Judge(nX:number, nY:number, nEndX:number,nEndY:number):number
        {
            let x:number = nEndX - nX;
            let y:number = nEndY -nY;
            return Math.abs(x) + Math.abs( y);
        }
        public FindPath(nScrX:number, nSrcY:number, nDestX:number, nDestY:number,):any
        {
            if(this.GetMaskInfo(nDestX,nDestY)._nFlag == MaskInfo.MASK_FLAG_CLOSE)
            {
                return null;
            }
            for(let i:number = 0;i < this.m_PassPoint.length;i++)
            {
                this.m_PassPoint[i] = 0xFFFFFFFF;
            }
            this.InitQueue();
            let root:TTree = new TTree();
            root.nX = nScrX;
            root.nY = nSrcY;
            root.nH = 0;
            root.Father = null;
            this.EnterQueue(root, this.Judge(nScrX, nSrcY, nDestX, nDestY));
            let nEndx:number = nDestX;
            let nEndy:number = nDestY;
            let ii:number = 0;
            let nIndex:number = 0;
            let bTry:boolean = false;
            while(true)
            {
                root = this.GetFromQueue(); //将第一个弹出
                ii++;
                if (ii == 86610) ii = 0;
                if (root == null) break;
                nIndex++;

                let x:number = root.nX;
                let y:number = root.nY;
                if (x == nEndx && y == nEndy)
                {
                    break;
                }
                bTry = false;
             
                if (this.Trytile(x,y - 1, nEndx, nEndy, root, 0)) bTry = true; //尝试向上移动
                if (this.Trytile(x + 1, y - 1, nEndx, nEndy, root, 1)) bTry = true; //尝试向右上移动
                if (this.Trytile(x + 1, y, nEndx, nEndy, root, 2)) bTry = true; //尝试向右移动
                if (this.Trytile(x + 1, y + 1, nEndx, nEndy, root, 3)) bTry = true; //尝试向右下移动
                if (this.Trytile(x, y + 1, nEndx, nEndy, root, 4)) bTry = true; //尝试向下移动
                if (this.Trytile(x - 1, y + 1, nEndx, nEndy, root, 5)) bTry = true; //尝试向左下移动
                if (this.Trytile(x - 1, y, nEndx, nEndy, root, 6)) bTry = true; //尝试向左移动
                if (this.Trytile(x - 1, y - 1, nEndx, nEndy, root, 7)) bTry = true; //尝试向左上移动
            }
            if (root == null) return null;
            let ret:Laya.Point[] = [];
            //起始坐标点不放进去
           let temp:Laya.Point  = new Laya.Point(root.nX,root.nY);
           ret.push(temp);
         
            let p:TTree = root;
            root = root.Father;
            while (root != null)
            {
                temp = new Laya.Point(root.nX,root.nY);
                ret.push(temp);
                
                root = root.Father;
            }
            return ret;
        }


                // 尝试下一步移动到 x,y 可行否
        private  Trytile(x:number, y:number, end_x:number, end_y:number,  father:TTree,  dir:number):boolean
        {
            let p:TTree;
            let h:number;
            let Result:boolean = false;
            if (x >= this.m_nWidth || y >= this.m_nHeight || x < 0 || y < 0)
            {
                return Result;
            }
            
            if (this.GetMaskInfo(x,y)._nFlag == MaskInfo.MASK_FLAG_CLOSE)
            {
                return Result;
            }
            p = father;
            while (p != null)
            {
                if (x == p.nX && y == p.nY)
                {
                    return false;
                }
                p = p.Father;
            }
            if (dir == 0 || dir == 2 || dir == 4 || dir == 6)
            {
                h = father.nH + 10;
            }
            else
            {
                h = father.nH + 14;
            }
           
            if (h >=  this.m_PassPoint[x * this.m_nHeight + y])
            {
                return false; //// 如果曾经有更好的方案移动到 (x,y) 失败
            }
            this.m_PassPoint[x * this.m_nHeight + y] = h; // 记录这次到 (x,y) 的距离为历史最佳距离

            p = new TTree();
            p.Father = father;
            p.nH = h;
            p.nX = x;
            p.nY = y;
            p.nDir = dir;
            this.EnterQueue(p, p.nH + this.Judge(x, y, end_x, end_y));
            return true;
        }
    }
}