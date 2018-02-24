	/**
	 * MDPBitmapPackage Group 
	 * @author 后天
	 * 通过索引访问或加载媒体资源包
	 * 资源包的命名规则必须是固定长度的数字序列，例如：00000.mdp,00001.mdp,...
	 */
    module Resources
    {
       
        export class SRPackGroup
        {
            private m_sGroupName:string = "";  //组名称
            private m_ArrSRPack:SRPack[] = [];  //资源包组
            private m_Loading=[];   //正在加载中
            constructor(sGroupName:string)
            {
                this.m_sGroupName = sGroupName;
            }

            public GetGroupName():string
            {
                return this.m_sGroupName;
            }
            public GetPackByName(szName:string):SRPack
            {
                if(this.m_ArrSRPack[szName] != null)
                {
                    return this.m_ArrSRPack[szName];
                }
                let sFileName:string = Config.GlobalConfig._Instance._szUrl+this.m_sGroupName + "/" +  szName + ".sr";
                this.m_Loading[szName] = sFileName;
                let asset=[];
                asset.push({url:sFileName,type:Laya.Loader.BUFFER})
                Laya.loader.load(asset,Laya.Handler.create(this,this.OnLoader))
                let pack:SRPack = new SRPack();
                this.m_ArrSRPack[szName] = pack;
                return pack;
                
            }
            public GetPack(nIndex:number):SRPack
            {
                if(this.m_ArrSRPack[nIndex.toString()] != null)
                {
                    return this.m_ArrSRPack[nIndex.toString()];
                }
                //文件名
                let sFileName: string = nIndex.toString();
                while ( sFileName.length < 5 )
                {
                    sFileName = "0" + sFileName;
                }
                sFileName = Config.GlobalConfig._Instance._szUrl+this.m_sGroupName + "/" +  sFileName + ".sr";
                this.m_Loading[nIndex] = sFileName;
                let asset=[];
                asset.push({url:sFileName,type:Laya.Loader.BUFFER})
                Laya.loader.load(asset,Laya.Handler.create(this,this.OnLoader))
                let pack:SRPack = new SRPack();
                this.m_ArrSRPack[nIndex.toString()] = pack;
                return pack;
            }
            private OnLoader():void
            {
                for(let nIndex in this.m_Loading)
                {
                    let szFile:string = this.m_Loading[nIndex];
                    let data = Laya.loader.getRes(szFile);
                    if(data != null)
                    {
                        let pack:SRPack = this.m_ArrSRPack[nIndex.toString()];
                        if(pack.Load(szFile,new Laya.Byte(data)))
                        {
                            this.m_Loading[nIndex] = null;

                        }

                    }
                }
            }

            public CheckFreeMemory():number
            {
                let nRet = 0;
                for(let key in this.m_ArrSRPack)
                {
                    let pack:SRPack = this.m_ArrSRPack[key];
                    if(pack != null)
                    {
                        if(pack.CheckFreeMemory())
                        {
                            this.m_ArrSRPack[key] = null;
                            nRet++;
                        }
                    }
                }
                return nRet;
            }
        }
    }